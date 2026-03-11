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
  var activeUserPopWrap = null; // 유저 팝업의 원래 부모 기억용
  var activeMorePop = null;     // 더보기 팝업 기억용
  var activeMorePopWrap = null; // 더보기 팝업의 원래 부모 기억용

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

    closeUserPop(); // 열려있는 건 닫고 원래 자리로 복구

    activeUser = readUserFromTrigger(triggerEl);
    activeUserPop = pop;
    activeUserPopWrap = wrap;

    // 1. 스크롤 영역에 잘리지 않도록 body의 맨 끝으로 임시 이동
    document.body.appendChild(pop);

    // 2. 높이 계산을 위해 잠깐 보이게 처리
    pop.style.display = 'block';
    pop.style.position = 'absolute';
    pop.style.zIndex = '99999';
    pop.style.margin = '0';
    
    // 가로 길이
    pop.style.setProperty('min-width', '130px', 'important');
    pop.style.setProperty('width', '130px', 'important');

    // 3. 문서 전체 기준의 절대 좌표 계산
    var rect = triggerEl.getBoundingClientRect();
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    var popHeight = pop.offsetHeight || 160;

    // 화면 바닥에 닿을 것 같으면 위로 열림
    if (rect.bottom + popHeight > window.innerHeight) {
      pop.style.top = (rect.top + scrollTop - popHeight - 8) + 'px';
    } else {
      pop.style.top = (rect.bottom + scrollTop + 8) + 'px';
    }
    pop.style.left = (rect.left + scrollLeft) + 'px';

    pop.classList.add('is-open');
  }

  function closeUserPop() {
    if (activeUserPop) {
      activeUserPop.classList.remove('is-open');
      activeUserPop.style.display = 'none';
      // 💡 닫을 때는 원래 있던 HTML 요소 안으로 다시 쏙 넣어줌
      if (activeUserPopWrap) {
        activeUserPopWrap.appendChild(activeUserPop);
      }
    }
    activeUserPop = null;
    activeUserPopWrap = null;
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
    if (activeMorePop) {
      activeMorePop.classList.remove('is-open');
      activeMorePop.style.display = 'none';
      if (activeMorePopWrap) {
        activeMorePopWrap.appendChild(activeMorePop);
      }
    }
    activeMorePop = null;
    activeMorePopWrap = null;
  }

  function toggleMoreMenu(btnEl) {
    var item = btnEl.closest('.cv-comment-item, li');
    if (!item) return;

    // 이미 body로 이동해 있다면 activeMorePop에서 찾고, 아니면 요소 안에서 찾음
    var menu = item.querySelector('.js-more-pop');
    if (!menu && activeMorePopWrap === item) menu = activeMorePop;
    if (!menu) return;

    var isOpen = menu.classList.contains('is-open');

    closeAllMoreMenus();
    closeUserPop();

    if (!isOpen) {
      activeMorePop = menu;
      activeMorePopWrap = item;

      document.body.appendChild(menu);
      menu.style.display = 'block';
      menu.style.position = 'absolute';
      menu.style.zIndex = '99999';

      var rect = btnEl.getBoundingClientRect();
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      var menuHeight = menu.offsetHeight || 120;

      if (rect.bottom + menuHeight > window.innerHeight) {
        menu.style.top = (rect.top + scrollTop - menuHeight - 8) + 'px';
      } else {
        menu.style.top = (rect.bottom + scrollTop + 8) + 'px';
      }
      // 더보기 메뉴는 버튼의 우측 정렬
      menu.style.left = (rect.right + scrollLeft - menu.offsetWidth) + 'px';
      
      menu.classList.add('is-open');
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
              // 날짜 포맷팅 (YYYY.MM.DD HH:mm)
              var rd = reply.reg_date;
              var formattedDate = '';
              
              if (Array.isArray(rd)) {
                // 백엔드에서 배열 형식 [년, 월, 일, 시, 분, 초] 로 넘어올 때
                var y = rd[0];
                var m = String(rd[1]).padStart(2, '0');
                var d = String(rd[2]).padStart(2, '0');
                var h = String(rd[3] || 0).padStart(2, '0'); // 시, 분이 없을 경우 0으로 처리
                var min = String(rd[4] || 0).padStart(2, '0');
                formattedDate = y + '.' + m + '.' + d + ' ' + h + ':' + min;
              } else {
                // 백엔드에서 문자열이나 타임스탬프로 넘어올 때
                var dObj = new Date(rd);
                var y = dObj.getFullYear();
                var m = String(dObj.getMonth() + 1).padStart(2, '0');
                var d = String(dObj.getDate()).padStart(2, '0');
                var h = String(dObj.getHours()).padStart(2, '0');
                var min = String(dObj.getMinutes()).padStart(2, '0');
                formattedDate = y + '.' + m + '.' + d + ' ' + h + ':' + min;
              }
              
              // 1. 사용자 ID와 닉네임 변수 세팅
              var userId = reply.user_id || '';
              var writerName = reply.writer || reply.writer_name || '익명';

              // 2. 프로필 이미지
              var imgSrc = reply.profile_filename
                ? ctx + '/user/getProfile?fileName=' + encodeURIComponent(reply.profile_filename)
                : ctx + '/resources/image/default_profile.png';

              var profileImgTag =
                '<button type="button" class="cv-reply-avatar-btn" onclick="GlobalProfileModal.open(\'' + userId + '\')" title="' + writerName + ' 프로필 보기">' +
                '  <img src="' + imgSrc + '" alt="' + writerName + ' 프로필">' +
                '</button>';

              // 3. 닉네임 영역
              var nicknameHtml =
                '<div class="cv-user-pop-wrap">' +
                '  <a href="javascript:void(0)" class="js-user-trigger cv-nick" data-user_id="' + userId + '" data-nickname="' + writerName + '">' + writerName + '</a>' +
                '  <div class="cv-pop cv-user-pop js-inline-user-pop" style="display:none;">' +
                '    <button type="button" class="cv-pop-item" data-action="boardView">게시글보기</button>' +
                '    <button type="button" class="cv-pop-item" data-action="chat">채팅하기</button>' +
                '    <button type="button" class="cv-pop-item" data-action="report">프로필 신고하기</button>' +
                '    <button type="button" class="cv-pop-item cv-pop-danger" data-action="block">차단하기</button>' +
                '  </div>' +
                '</div>';

                // 4. 최종 HTML 조립
                html += '<li class="cv-reply-item">';
                
                // 상단 영역: 왼쪽(프로필+닉네임) / 오른쪽(날짜)
                html += '  <div class="cv-reply-head">';
                html += '    <div class="cv-reply-head-left">';
                html += '      ' + profileImgTag;
                html += '      ' + nicknameHtml;
                html += '    </div>';
                html += '    <span class="cv-reply-date">' + formattedDate + '</span>';
                html += '  </div>';
                
                // 하단 영역: 내용
                html += '  <div class="cv-reply-content">';
                html += '    <p>' + reply.content + '</p>';
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
        // 💡 팝업이 밖으로 나갔으므로 저장해둔 activeUserPopWrap 변수와 비교합니다.
        var sameWrap = activeUserPopWrap && (activeUserPopWrap === wrap);

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
    
    var commentScrollArea = document.querySelector('.cv-comment-scroll');
    if (commentScrollArea) {
      commentScrollArea.addEventListener('scroll', function() {
        closeUserPop();
        closeAllMoreMenus();
      });
    }
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

