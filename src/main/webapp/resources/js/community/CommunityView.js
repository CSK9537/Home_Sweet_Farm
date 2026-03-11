(function () {
  'use strict';

  /* =========================
   * Helpers
   * ========================= */

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function getCtx() {
    var b = document.body;
    var ctxFromBody = b && b.getAttribute('data-ctx');
    return ctxFromBody || '';
  }

  function getQueryParam(name) {
    try {
      return new URLSearchParams(location.search).get(name);
    } catch (e) {
      var query = location.search.replace(/^\?/, '').split('&');
      for (var i = 0; i < query.length; i++) {
        var kv = query[i].split('=');
        if (decodeURIComponent(kv[0]) === name) {
          return decodeURIComponent(kv[1] || '');
        }
      }
      return null;
    }
  }

  function encode(v) {
    return encodeURIComponent(String(v == null ? '' : v));
  }

  function safeInt(v) {
    var n = parseInt(v, 10);
    return isNaN(n) ? null : n;
  }

  function toast(msg) {
    alert(msg);
  }

  function postForm(url, data) {
	  return fetch(url, {
	    method: 'POST',
	    headers: {
	      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
	      'X-Requested-With': 'XMLHttpRequest',
	      'Accept': 'application/json'
	    },
	    body: new URLSearchParams(data).toString()
	  }).then(function (r) {
	    if (!r.ok) {
	      throw new Error('HTTP ' + r.status);
	    }

	    var contentType = r.headers.get('content-type') || '';

	    if (contentType.indexOf('application/json') > -1) {
	      return r.json();
	    }

	    return r.text().then(function (text) {
	      console.error('JSON이 아닌 응답:', text);
	      throw new Error('INVALID_RESPONSE_FORMAT');
	    });
	  });
	}

  /* =========================
   * Board Type / Breadcrumb
   * ========================= */

  function convertBoardType(type) {
    switch (String(type || '').toUpperCase()) {
      case 'G':
      case 'FREE':
        return '자유게시판';
      case 'T':
      case 'S':
      case 'MARKET':
        return '벼룩시장';
      case 'Q':
        return '질문게시판';
      case 'A':
        return '답변게시판';
      default:
        return '게시판';
    }
  }

  function normalizeBoardTab(type) {
    var v = String(type || '').toUpperCase();

    if (v === 'MARKET' || v === 'T' || v === 'S') return 'MARKET';
    if (v === 'FREE' || v === 'G') return 'FREE';
    if (v === 'Q') return 'Q';
    if (v === 'A') return 'A';

    return 'FREE';
  }

  function initBoardTypeBreadcrumb() {
    var el = $('#boardTypeLink');
    if (!el) return;

    var rawType = el.getAttribute('data-board-type') || '';
    var boardTab = normalizeBoardTab(el.getAttribute('data-board-tab') || rawType);

    el.textContent = convertBoardType(rawType);
    el.setAttribute('href', ctx + '/community/list?type=' + encode(boardTab));
    el.setAttribute('data-board-tab', boardTab);
  }

  /* =========================
   * State
   * ========================= */

  var ctx = getCtx();

  var boardId =
    safeInt($('#board_id') && $('#board_id').value) ||
    (typeof window.board_id !== 'undefined' ? safeInt(window.board_id) : null) ||
    safeInt(getQueryParam('board_id'));

  var boardTabInput = $('#board_tab');
  var boardTypeLink = $('#boardTypeLink');

  var boardType = normalizeBoardTab(
    getQueryParam('type') ||
    (boardTabInput && boardTabInput.value) ||
    (boardTypeLink && boardTypeLink.getAttribute('data-board-tab')) ||
    (boardTypeLink && boardTypeLink.getAttribute('data-board-type')) ||
    (typeof window.boardType !== 'undefined' ? window.boardType : null)
  );

  var btnPrev = $('#btnPrev');
  var btnNext = $('#btnNext');
  var btnList = $('#btnList');

  var btnBoardList = $('#btnBoardList');
  var btnBoardEdit = $('#btnBoardEdit');
  var btnBoardDelete = $('#btnBoardDelete');
  var btnBoardReport = $('#btnBoardReport');

  var btnGoReply = $('#btnGoReply');
  var btnReplyStat = $('#btnReplyStat');

  var btnLikeTop = $('#btnLikeTop');
  var btnLikeStat = $('#btnLikeStat');
  var btnLikeBottom = $('#btnLikeBottom');

  var activeUser = null;
  var activeUserPop = null;

  var prevId =
    safeInt($('#prev_id') && $('#prev_id').value) ||
    (typeof window.prevId !== 'undefined' ? safeInt(window.prevId) : null);

  var nextId =
    safeInt($('#next_id') && $('#next_id').value) ||
    (typeof window.nextId !== 'undefined' ? safeInt(window.nextId) : null);

  /* =========================
   * Navigation
   * ========================= */

  function goList() {
    location.href = ctx + '/community/list?type=' + encode(boardType);
  }

  function goViewById(id) {
    location.href = ctx + '/community/view?board_id=' + encode(id) + '&type=' + encode(boardType);
  }

  function goEdit() {
    if (!boardId) {
      toast('board_id를 찾지 못했습니다.');
      return;
    }

    location.href = ctx + '/community/form?mode=edit&board_id=' + encode(boardId);
  }

  function scrollToReply() {
    var target = $('#replySection') || $('#replyScroll') || $('.cv-comments');
    if (target && target.scrollIntoView) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /* =========================
   * User Popup
   * ========================= */

  function readUserFromTrigger(triggerEl) {
    var userId =
      triggerEl.getAttribute('data-user_id') ||
      triggerEl.getAttribute('data-user-id') ||
      triggerEl.getAttribute('data-userid') ||
      triggerEl.getAttribute('data-userId');

    var nickname =
      triggerEl.getAttribute('data-nickname') ||
      triggerEl.getAttribute('data-user-nick') ||
      (triggerEl.textContent || '').trim();

    return {
      user_id: safeInt(userId) || userId,
      nickname: nickname
    };
  }

  function openUserPop(triggerEl) {
    if (!triggerEl) return;

    var wrap = triggerEl.closest('.cv-user-pop-wrap');
    if (!wrap) return;

    var pop = wrap.querySelector('.js-inline-user-pop');
    if (!pop) return;

    closeUserPop();

    activeUser = readUserFromTrigger(triggerEl);
    activeUserPop = pop;

    pop.style.display = 'block';
    pop.classList.add('is-open');
  }

  function closeUserPop() {
    if (activeUserPop) {
      activeUserPop.classList.remove('is-open');
      activeUserPop.style.display = 'none';
    }

    activeUserPop = null;
    activeUser = null;
  }

  function handleUserPopAction(action) {
    if (!action || !activeUser) return;

    if (action === 'boardView') {
      location.href = ctx + '/community/list?writerId=' + encode(activeUser.user_id);
      closeUserPop();

    }  else if (action === 'chat') {
        var loggedInInput = document.getElementById('isLoggedInStatus');
        var isUserLoggedIn = (loggedInInput && loggedInInput.value === "true");

        var chatUrl = ctx + '/chat?target_id=' + encode(activeUser.user_id);

        if (isUserLoggedIn) {
          // 1. 로그인 상태: 새 창(팝업)으로 채팅 열기
          window.open(chatUrl);
        } else {
          // 2. 비로그인 상태: 현재 창에서 채팅 URL로 이동 
          location.href = chatUrl;
        }

        closeUserPop();

      }else if (action === 'report') {
      toast('프로필 신고 기능은 연결이 필요합니다.');
      closeUserPop();

    } else if (action === 'block') {
      toast('차단 기능은 연결이 필요합니다.');
      closeUserPop();
    }
  }

  /* =========================
   * Comment More Menu
   * ========================= */

  function closeAllMoreMenus() {
    $all('.moreMenu.is-open, .cv-more-menu.is-open, .js-more-menu-panel.is-open, .js-more-pop')
      .forEach(function (el) {
        el.classList.remove('is-open');
        el.style.display = 'none';
      });
  }

  function toggleMoreMenu(btnEl) {
    var item = btnEl.closest('.cv-comment-item, li');
    if (!item) return;

    var menu = item.querySelector('.js-more-pop');
    if (!menu) return;

    var isOpen = menu.style.display === 'block';

    closeAllMoreMenus();

    if (!isOpen) {
      menu.style.display = 'block';
      menu.classList.add('is-open');

      var rect = btnEl.getBoundingClientRect();
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      menu.style.position = 'absolute';
      menu.style.top = (rect.bottom + scrollTop + 8) + 'px';
      menu.style.left = (rect.left + scrollLeft) + 'px';
    }
  }

  /* =========================
   * Like
   * ========================= */

  function setLikeDisabled(disabled) {
    [btnLikeTop, btnLikeStat, btnLikeBottom].forEach(function (b) {
      if (b) b.disabled = !!disabled;
    });
  }

  function syncLikeCount(cnt) {
    var likeCntTop = $('#likeCntTop');
    var likeCntStat = $('#likeCntStat');
    var likeCntBottom = $('#likeCntBottom');

    if (likeCntTop) likeCntTop.textContent = cnt;
    if (likeCntStat) likeCntStat.textContent = cnt;
    if (likeCntBottom) likeCntBottom.textContent = cnt;
  }

  function doBoardLike(targetBoardId) {
	  postForm(ctx + '/community/like', { board_id: targetBoardId })
	    .then(function (res) {
	      if (!res || res.ok !== true) {
	        if (res && res.msg === 'LOGIN_REQUIRED') {
	          toast('로그인이 필요합니다.');
	        } else {
	          toast('좋아요 처리 중 오류가 발생했습니다.');
	        }
	        return;
	      }

	      if (typeof res.like_cnt !== 'undefined') {
	        syncLikeCount(res.like_cnt);
	      }

	      setLikeDisabled(true);
	    })
	    .catch(function (err) {
	      console.error('좋아요 요청 실패:', err);

	      if (err && err.message === 'INVALID_RESPONSE_FORMAT') {
	        toast('서버 응답 형식 오류');
	        return;
	      }

	      toast('좋아요 요청 실패');
	    });
	}

  function bindLikeButton(btn) {
    if (!btn) return;

    btn.addEventListener('click', function () {
      if (btn.disabled) return;

      var bid = btn.getAttribute('data-board-id') || boardId;
      if (!bid) {
        toast('board_id를 찾지 못했습니다.');
        return;
      }

      doBoardLike(bid);
    });
  }

  /* =========================
   * Report
   * ========================= */

  function doBoardReport(targetBoardId) {
	  var reason = prompt('신고 사유를 입력하세요 (간단히)');
	  if (reason == null) return;

	  reason = (reason || '').trim();
	  if (!reason) {
	    toast('신고 사유를 입력해주세요.');
	    return;
	  }

	  postForm(ctx + '/community/report', {
	    board_id: targetBoardId,
	    reason: reason
	  })
	    .then(function (res) {
	      if (!res || res.ok !== true) {
	        if (res && res.msg === 'LOGIN_REQUIRED') {
	          toast('로그인이 필요합니다.');
	        } else {
	          toast('신고 처리 중 오류가 발생했습니다.');
	        }
	        return;
	      }

	      toast('신고가 접수되었습니다.');
	    })
	    .catch(function (err) {
	      console.error('신고 요청 실패:', err);

	      if (err && err.message === 'INVALID_RESPONSE_FORMAT') {
	        toast('서버 응답 형식 오류');
	        return;
	      }

	      toast('신고 요청 실패');
	    });
	}
  /* =========================
   * Delete
   * ========================= */

  function doBoardDelete() {
    if (!boardId) {
      toast('board_id를 찾지 못했습니다.');
      return;
    }

    if (!confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    postForm(ctx + '/community/delete', { board_id: boardId })
      .then(function (res) {
        if (!res || res.ok !== true) {
          if (res && res.msg === 'LOGIN_REQUIRED') {
            toast('로그인이 필요합니다.');
          } else if (res && res.msg === 'FORBIDDEN') {
            toast('본인 게시글만 삭제할 수 있습니다.');
          } else if (res && res.msg === 'DELETE_FAILED') {
            toast('삭제에 실패했습니다.');
          } else {
            toast('삭제 처리 중 오류가 발생했습니다.');
          }
          return;
        }

        alert('삭제되었습니다.');
        goList();
      })
      .catch(function (err) {
        console.error('삭제 요청 실패:', err);
        toast('삭제 요청 실패');
      });
  }

  /* =========================
   * Replies (댓글)
   * ========================= */

  // 댓글 등록 함수
  function doReplySubmit() {
    var contentEl = $('#replyContent');
    var content = (contentEl.value || '').trim();

    var loginUserId = $('#loginUserId') ? $('#loginUserId').value : '';

    if (!loginUserId || loginUserId === "0" || loginUserId === "") {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }

    if (!content) {
      toast('댓글 내용을 입력해주세요.');
      contentEl.focus();
      return;
    }

    fetch(ctx + '/replies/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        board_id: boardId,
        user_id: safeInt(loginUserId),
        content: content
      })
    })
      .then(function (res) {
        if (res.ok) {
          alert('댓글이 등록되었습니다.');
          location.reload();
        }
      });
  }

  // 대댓글(답글) 토글 및 데이터 불러오기 함수
  function toggleReplyList(btn) {
    var item = btn.closest('.cv-comment-item');
    if (!item) return;
    var replyArea = item.querySelector('.js-replies');
    if (!replyArea) return;

    var isHidden = replyArea.style.display === 'none';

    if (isHidden) {
      var parentId = item.getAttribute('data-reply-id');
      var listUl = replyArea.querySelector('.cv-reply-list');

      listUl.innerHTML = '<li class="cv-reply-loading">불러오는 중...</li>';

      fetch(ctx + '/replies/child/' + parentId)
        .then(function (res) { return res.json(); })
        .then(function (data) {

          // 1. 답글 개수 실시간 업데이트
          var countEl = btn.querySelector('.js-reply-count');
          if (countEl && data) {
            countEl.textContent = data.length;
          }

          // 2. 답글 목록 그리기
          var html = '';
          if (data && data.length > 0) {
            data.forEach(function (reply) {
              var regDate = new Date(reply.reg_date).toLocaleDateString();
              var writerName = reply.writer_name || '익명';
              var profileImgTag = '';

              // 프로필 이미지 처리
              if (reply.profile_filename) {
                var imgSrc = ctx + '/user/getProfile?fileName=' + encodeURIComponent(reply.profile_filename);
                profileImgTag = '<img src="' + imgSrc + '" style="width:30px; height:30px; border-radius:50%; vertical-align:middle; margin-right:5px; object-fit:cover;">';
              } else {
                profileImgTag = '<div style="width:30px; height:30px; border-radius:50%; background:#ddd; display:inline-block; vertical-align:middle; margin-right:5px;"></div>';
              }

              html += '<li class="cv-reply-item" style="padding:8px 0; border-bottom:1px dotted #eee; list-style:none;">';
              html += '  <div class="cv-reply-body">';
              html += '    ' + profileImgTag;
              html += '    <strong style="font-size:13px;">' + writerName + '</strong>';
              html += '    <p style="margin:5px 0 5px 35px; font-size:14px; color:#444;">' + reply.content + '</p>';
              html += '    <small style="margin-left:35px; color:#999;">' + regDate + '</small>';
              html += '  </div>';
              html += '</li>';
            });
          } else {
            html = '<li class="cv-reply-empty" style="padding:10px; color:#999;">등록된 답글이 없습니다.</li>';
          }
          listUl.innerHTML = html;
        })
        .catch(function (err) {
          console.error('대댓글 로드 실패:', err);
          listUl.innerHTML = '<li class="cv-error">목록을 불러오지 못했습니다.</li>';
        });

      replyArea.style.display = 'block';
    } else {
      replyArea.style.display = 'none';
    }

    var caret = btn.querySelector('.cv-caret');
    if (caret) caret.textContent = isHidden ? '▴' : '▾';
  }
  // 대댓글 등록 함수
  function doChildReplySubmit(btn) {
    var item = btn.closest('.cv-comment-item');
    var parentId = item ? item.getAttribute('data-reply-id') : null;
    var input = item ? item.querySelector('.js-reply-input') : null;
    var content = (input.value || '').trim();
    var loginUserId = $('#loginUserId') ? $('#loginUserId').value : '';

    if (!loginUserId) {
      toast('로그인이 필요합니다.');
      return;
    }
    if (!content) {
      toast('답글 내용을 입력해주세요.');
      return;
    }

    fetch(ctx + '/replies/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        board_id: boardId,
        user_id: safeInt(loginUserId),
        parent_reply_id: safeInt(parentId),
        content: content
      })
    })
      .then(function (res) {
        if (res.ok) {
          alert('답글이 등록되었습니다.');
          location.reload();
        }
      });
  }

  /* =========================
   * Button Bindings
   * ========================= */

  function bindButtons() {
    if (btnList) {
      btnList.addEventListener('click', goList);
    }

    if (btnBoardList) {
      btnBoardList.addEventListener('click', goList);
    }

    if (btnBoardEdit) {
      btnBoardEdit.addEventListener('click', function () {
        goEdit();
      });
    }

    if (btnBoardDelete) {
      btnBoardDelete.addEventListener('click', function () {
        doBoardDelete();
      });
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', function () {
        var id = safeInt(btnPrev.getAttribute('data-id')) || prevId;
        if (!id) {
          toast('이전글 정보(prevId)가 없어 이동할 수 없습니다.');
          return;
        }
        goViewById(id);
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', function () {
        var id = safeInt(btnNext.getAttribute('data-id')) || nextId;
        if (!id) {
          toast('다음글 정보(nextId)가 없어 이동할 수 없습니다.');
          return;
        }
        goViewById(id);
      });
    }

    if (btnGoReply) {
      btnGoReply.addEventListener('click', function (e) {
        e.preventDefault();
        scrollToReply();
      });
    }

    if (btnReplyStat) {
      btnReplyStat.addEventListener('click', function () {
        scrollToReply();
      });
    }

    bindLikeButton(btnLikeTop);
    bindLikeButton(btnLikeStat);
    bindLikeButton(btnLikeBottom);

    if (btnBoardReport) {
      btnBoardReport.addEventListener('click', function () {
        var bid = btnBoardReport.getAttribute('data-board-id') || boardId;
        if (!bid) {
          toast('board_id를 찾지 못했습니다.');
          return;
        }
        doBoardReport(bid);
      });
    }
    // 댓글 등록 버튼
    var btnReplySubmit = $('#btnReplySubmit');
    if (btnReplySubmit) {
      btnReplySubmit.addEventListener('click', doReplySubmit);
    }
  }

  /* =========================
   * Delegated Events
   * ========================= */

  function bindDelegatedEvents() {
    document.addEventListener('click', function (e) {
      var t = e.target;

      var trigger = t.closest ? t.closest('.js-user-trigger') : null;
      if (trigger) {
        var wrap = trigger.closest('.cv-user-pop-wrap');
        var sameWrap =
          activeUserPop &&
          wrap &&
          activeUserPop.closest('.cv-user-pop-wrap') === wrap;

        if (sameWrap && activeUserPop.classList.contains('is-open')) {
          closeUserPop();
        } else {
          closeAllMoreMenus();
          closeUserPop();
          openUserPop(trigger);
        }

        e.preventDefault();
        e.stopPropagation();
        return;
      }

      var userActionBtn = t.closest ? t.closest('.js-inline-user-pop .cv-pop-item') : null;
      if (userActionBtn) {
        var action = userActionBtn.getAttribute('data-action');
        handleUserPopAction(action);
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      var insideUserPop = t.closest ? t.closest('.js-inline-user-pop') : null;
      if (insideUserPop) {
        e.stopPropagation();
        return;
      }

      var moreBtn = t.closest ? t.closest('.js-more-menu') : null;
      if (moreBtn) {
        closeUserPop();
        toggleMoreMenu(moreBtn);
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      var replyToggleBtn = t.closest('.js-reply-toggle');
      if (replyToggleBtn) {
        toggleReplyList(replyToggleBtn);
        return;
      }

      // 답글 등록 버튼
      var childReplySubmitBtn = t.closest('.js-reply-submit');
      if (childReplySubmitBtn) {
        doChildReplySubmit(childReplySubmitBtn);
        return;
      }

      // '답글' 버튼 클릭 시 입력창으로 포커스
      var replyFocusBtn = t.closest('.js-reply-btn');
      if (replyFocusBtn) {
        var item = replyFocusBtn.closest('.cv-comment-item');
        var replyArea = item.querySelector('.js-replies');
        replyArea.style.display = 'block';
        item.querySelector('.js-reply-input').focus();
        return;
      }

      closeUserPop();
      closeAllMoreMenus();
    });
  }

  /* =========================
   * Init
   * ========================= */

  function init() {
    initBoardTypeBreadcrumb();
    bindButtons();
    bindDelegatedEvents();
    refreshAllReplyCounts();
  }

  function refreshAllReplyCounts() {
    // 모든 답글 토글 버튼을 찾습니다.
    var replyButtons = $all('.js-reply-toggle');

    replyButtons.forEach(function (btn) {
      var item = btn.closest('.cv-comment-item');
      if (!item) return;

      var parentId = item.getAttribute('data-reply-id');
      var countEl = btn.querySelector('.js-reply-count');

      if (parentId && countEl) {
        // 서버에 해당 댓글의 대댓글 목록을 요청
        fetch(ctx + '/replies/child/' + parentId)
          .then(function (res) { return res.json(); })
          .then(function (data) {
            if (data) {
              // 실제 데이터 개수로 화면의 '0'을 바꿈
              countEl.textContent = data.length;
            }
          })
          .catch(function (err) {
            console.error('개수 업데이트 실패:', err);
          });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

