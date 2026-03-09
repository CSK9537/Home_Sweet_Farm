(function () {
  'use strict';

  var ctx = window.__CTX__ || "";
  var loginUserId = window.__LOGIN_USER_ID__;
  var boardId = window.__BOARD_ID__;
  var boardWriterId = window.__BOARD_WRITER_ID__;
  var isPostSelected = window.__IS_POST_SELECTED__ === "true";

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  // ===== 1. 초기화 및 댓글 로드 =====
  function init() {
    // [1] 질문(본문) 댓글 로드
    loadReplies(boardId, $('.qv-question-comments .js-reply-list'));

    // [2] 각종 버튼 바인딩
    bindEvents();
  }

  function bindEvents() {
    // 목록 버튼
    var btnList = $('#btnList');
    if (btnList) btnList.onclick = function() { location.href = ctx + '/qna/QnaList'; };

    // 질문 수정/삭제
    var btnEditQ = $('#btnEditQuestion');
    if (btnEditQ) {
      btnEditQ.onclick = function() {
        location.href = ctx + '/qna/ask?mode=edit&board_id=' + boardId;
      };
    }

    var btnDelQ = $('#btnDeleteQuestion');
    if (btnDelQ) {
      btnDelQ.onclick = function() {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        // AJAX 또는 폼 제출로 연동 필요
        showCustomToast('삭제 기능은 개발 예정입니다.', 'info');
      };
    }

    // 답변 등록
    var btnAnsSubmit = $('#btnAnswerSubmit');
    if (btnAnsSubmit) {
      btnAnsSubmit.onclick = function() {
        var content = $('#answerContent').value.trim();
        if (!content) return showCustomToast('답변 내용을 입력해주세요.', 'warning');
        submitAnswer(content);
      };
    }

    // 이벤트 위임 처리 (좋아요, 채택, 댓글 토글 등)
    document.addEventListener('click', function(e) {
      var t = e.target;

      // [좋아요 버튼]
      if (t.classList.contains('js-board-like')) {
        var id = t.getAttribute('data-id');
        handleLike(id, t);
      }

      // [답변 채택]
      if (t.classList.contains('js-btn-select-answer')) {
        var aid = t.getAttribute('data-id');
        if (confirm('이 답변을 채택하시겠습니까? 채택 후에는 변경할 수 없습니다.')) {
          handleSelectAnswer(aid);
        }
      }

      // [댓글 토글]
      if (t.classList.contains('js-reply-toggle')) {
        var parentId = t.getAttribute('data-answer-id');
        var container = t.parentNode.querySelector('.js-answer-reply-box');
        if (container.style.display === 'none') {
          container.style.display = 'block';
          t.innerHTML = '댓글 접기 ▴';
          loadReplies(parentId, container.querySelector('.js-reply-list'));
        } else {
          container.style.display = 'none';
          t.innerHTML = '댓글 ' + container.querySelectorAll('.cv-comment-item').length + '개 보기 ▾';
        }
      }

      // [댓글 등록 버튼] 
      if (t.classList.contains('js-reply-submit')) {
         var pid = t.getAttribute('data-parent-id');
         var input = t.closest('.cv-comment-form, .cv-reply-write').querySelector('textarea, input');
         var val = input.value.trim();
         if (!val) return showCustomToast('댓글 내용을 입력하세요.', 'warning');
         submitReply(pid, val, t.closest('.qv-question-comments, .js-answer-reply-box').querySelector('.js-reply-list'), input);
      }
    });
  }

  // ===== 2. 비즈니스 로직 (AJAX 등) =====

  // 댓글 로드
  function loadReplies(bId, listEl) {
    if (!listEl) return;
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', ctx + '/community/reply/list?board_id=' + bId, true); // 커뮤니티 댓글 API 재사용 가정
    xhr.onload = function() {
      if (xhr.status === 200) {
        var replies = JSON.parse(xhr.responseText || '[]');
        renderReplies(replies, listEl);
      }
    };
    xhr.send();
  }

  function renderReplies(replies, listEl) {
    if (!replies || replies.length === 0) {
      listEl.innerHTML = '<li class="cv-loading">등록된 댓글이 없습니다.</li>';
      return;
    }

    var html = "";
    replies.forEach(function(r) {
      html += '<li class="cv-comment-item" data-reply-id="' + r.reply_id + '">';
      html += '  <div class="cv-comment-left"><div class="cv-avatar cv-avatar-sm"><span class="cv-avatar-fallback"></span></div></div>';
      html += '  <div class="cv-comment-body">';
      html += '    <div class="cv-comment-head">';
      html += '      <a href="javascript:void(0)" class="js-user-trigger cv-nick" data-user-id="' + r.user_id + '" data-user-nick="' + r.writer + '">' + r.writer + '</a>';
      html += '      <div class="cv-comment-head-right">';
      html += '        <span class="cv-comment-date">' + formatDate(r.reg_date) + '</span>';
      html += '      </div>';
      html += '    </div>';
      html += '    <div class="cv-comment-text">' + r.content + '</div>';
      html += '  </div>';
      html += '</li>';
    });
    listEl.innerHTML = html;
  }

  // 답변 등록
  function submitAnswer(content) {
    if (!content || content.trim() === '') {
      alert('답변 내용을 입력해주세요.');
      return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', ctx + '/qna/AnswerWrite', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
      if (xhr.status === 200) {
        showCustomToast('답변이 등록되었습니다.', 'success').then(function() {
          location.reload();
        });
      } else if (xhr.status === 401 || xhr.status === 400 || xhr.status === 502) {
        showCustomToast('로그인이 필요한 서비스입니다.', 'warning').then(function() {
          location.href = ctx + '/user/login';
        });
      } else {
        showCustomToast('답변 등록에 실패했습니다. (Error: ' + xhr.status + ')', 'error');
      }
    };
    xhr.onerror = function() {
      showCustomToast('네트워크 오류가 발생했습니다.', 'error');
    };
    
    // parentId로 질문 ID를 전달 (Controller 파라미터명에 맞춤)
    var params = 'parentId=' + boardId + '&content=' + encodeURIComponent(content);
    xhr.send(params);
    location.href = ctx + '/qna/detail/' + boardId;
  }

  // 댓글 등록
  function submitReply(bId, content, listEl, inputEl) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', ctx + '/reply/write', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
      if (xhr.status === 201 || xhr.status === 200) {
        inputEl.value = '';
        loadReplies(bId, listEl);
      } else if (xhr.status === 401) {
        showCustomToast('로그인이 필요한 서비스입니다.', 'warning').then(function() {
          location.href = ctx + '/user/login';
        });
      } else {
        showCustomToast('댓글 등록에 실패했습니다.', 'error');
      }
    };
    var data = JSON.stringify({ board_id: bId, content: content });
    xhr.send(data);
  }

  // 채택 처리
  function handleSelectAnswer(aid) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', ctx + '/qna/select', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
      if (xhr.status === 200) {
        showCustomToast('채택이 완료되었습니다.', 'success').then(function() {
          location.reload();
        });
      } else {
        showCustomToast('처리에 실패했습니다.', 'error');
      }
    };
    xhr.send('board_id=' + aid + '&parent_id=' + boardId);
  }

  // 좋아요 처리
  function handleLike(id, btn) {
    // 기존 좋아요 로직 이식
    showCustomToast('좋아요 처리 (ID: ' + id + ')', 'info');
  }

function formatDate(ts) {
  if (!ts) return "";
  var d = new Date(ts);
  
  // 'ko-KR' 옵션을 주면 한국 형식(YYYY. MM. DD.)으로 출력
  return d.toLocaleDateString('ko-KR').replace(/\s/g, '').replace(/\.$/, '');
}

  init();
})();
