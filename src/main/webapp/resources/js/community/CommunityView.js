(function () {
  'use strict';

  /* =========================
   * Board Type 표시/변환
   * ========================= */

  function convertBoardType(type) {
    switch (type) {
      case 'G': return '자유게시판';
      case 'T':
      case 'S': return '벼룩시장';
      case 'Q': return '질문게시판';
      case 'A': return '답변게시판';
      case 'FREE': return '자유게시판';
      case 'MARKET': return '벼룩시장';
      default: return '게시판';
    }
  }

  function normalizeBoardTab(type) {
    var v = String(type || '').toUpperCase();

    if (v === 'MARKET' || v === 'T' || v === 'S') return 'MARKET';
    if (v === 'FREE' || v === 'G') return 'FREE';

    return 'FREE';
  }

  function initBoardTypeBreadcrumb() {
    var el = document.getElementById('boardTypeLink');
    if (!el) return;

    var rawType = el.getAttribute('data-board-type');
    var boardTab = normalizeBoardTab(el.getAttribute('data-board-tab') || rawType);

    el.textContent = convertBoardType(rawType);
    el.setAttribute('href', getCtx() + '/community/list?type=' + encode(boardTab));
    el.setAttribute('data-board-tab', boardTab);
  }

  /* =========================
   * Helpers
   * ========================= */

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

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
        if (decodeURIComponent(kv[0]) === name) return decodeURIComponent(kv[1] || '');
      }
      return null;
    }
  }

  function encode(v) { return encodeURIComponent(String(v == null ? '' : v)); }
  function toast(msg) { alert(msg); }
  function safeInt(v) { var n = parseInt(v, 10); return isNaN(n) ? null : n; }

  function postForm(url, data) {
	  return fetch(url, {
	    method: 'POST',
	    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
	    body: new URLSearchParams(data).toString()
	  }).then(function (r) {
	    if (!r.ok) {
	      throw new Error('HTTP ' + r.status);
	    }
	    return r.json();
	  });
	}

  /* =========================
   * State
   * ========================= */

  var ctx = getCtx();

  var boardId = safeInt($('#board_id') && $('#board_id').value) ||
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

  var userPop = $('#userPop');
  var activeUser = null;

  var prevId = safeInt($('#prev_id') && $('#prev_id').value) ||
               (typeof window.prevId !== 'undefined' ? safeInt(window.prevId) : null);

  var nextId = safeInt($('#next_id') && $('#next_id').value) ||
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

  function scrollToReply() {
    var target = $('#replySection') || $('#replyScroll') || $('.cv-comments');
    if (target && target.scrollIntoView) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* =========================
   * User Popup
   * ========================= */

  function readUserFromTrigger(triggerEl) {
    var user_id =
      triggerEl.getAttribute('data-user_id') ||
      triggerEl.getAttribute('data-user-id') ||
      triggerEl.getAttribute('data-userid') ||
      triggerEl.getAttribute('data-userId');

    var nickname =
      triggerEl.getAttribute('data-nickname') ||
      triggerEl.getAttribute('data-user-nick') ||
      triggerEl.textContent.trim();

    return { user_id: safeInt(user_id) || user_id, nickname: nickname };
  }

  function openUserPop(triggerEl) {
    if (!userPop || !triggerEl) return;

    activeUser = readUserFromTrigger(triggerEl);

    var rect = triggerEl.getBoundingClientRect();
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    userPop.style.display = 'block';
    userPop.style.position = 'absolute';
    userPop.style.top = (rect.bottom + scrollTop + 8) + 'px';
    userPop.style.left = (rect.left + scrollLeft) + 'px';
    userPop.classList.add('is-open');
  }

  function closeUserPop() {
    if (!userPop) return;
    userPop.classList.remove('is-open');
    userPop.style.display = 'none';
    activeUser = null;
  }

  /* =========================
   * 댓글 더보기 메뉴
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

    var isOpen = (menu.style.display === 'block');

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
   * 좋아요
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

  function doBoardLike(board_id) {
    postForm(ctx + '/community/like', { board_id: board_id })
      .then(function (res) {
        if (!res || res.ok !== true) {
          if (res && res.msg === 'LOGIN_REQUIRED') toast('로그인이 필요합니다.');
          else toast('좋아요 처리 중 오류가 발생했습니다.');
          return;
        }
        if (typeof res.like_cnt !== 'undefined') syncLikeCount(res.like_cnt);
        setLikeDisabled(true);
      })
      .catch(function (err) {
    	  console.error('좋아요 요청 실패:', err);
    	  toast('좋아요 요청 실패');
    	});
  }

  function bindLikeButton(btn) {
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (btn.disabled) return;
      var bid = btn.getAttribute('data-board-id') || boardId;
      if (!bid) return toast('board_id를 찾지 못했습니다.');
      doBoardLike(bid);
    });
  }

  /* =========================
   * 신고
   * ========================= */

  function doBoardReport(board_id) {
    var reason = prompt('신고 사유를 입력하세요 (간단히)');
    if (reason == null) return;

    reason = (reason || '').trim();
    if (!reason) return toast('신고 사유를 입력해주세요.');

    postForm(ctx + '/community/report', { board_id: board_id, reason: reason })
      .then(function (res) {
        if (!res || res.ok !== true) {
          if (res && res.msg === 'LOGIN_REQUIRED') toast('로그인이 필요합니다.');
          else toast('신고 처리 중 오류가 발생했습니다.');
          return;
        }
        toast('신고가 접수되었습니다.');
      })
      .catch(function () {
        toast('신고 요청 실패');
      });
  }

  /* =========================
   * 버튼 바인딩
   * ========================= */

  function bindButtons() {
    if (btnList) btnList.addEventListener('click', goList);
    if (btnBoardList) btnBoardList.addEventListener('click', goList);

    if (btnBoardEdit) {
      btnBoardEdit.addEventListener('click', function () {
        if (!boardId) return toast('board_id를 찾지 못했습니다.');
        location.href = ctx + '/community/form?mode=edit&board_id=' + encode(boardId) + '&type=' + encode(boardType);
      });
    }

    if (btnBoardDelete) {
      btnBoardDelete.addEventListener('click', function () {
        toast('삭제 기능은 백엔드 delete 매핑이 연결되어야 동작합니다.');
      });
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', function () {
        var id = safeInt(btnPrev.getAttribute('data-id')) || prevId;
        if (!id) return toast('이전글 정보(prevId)가 없어 이동할 수 없습니다.');
        goViewById(id);
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', function () {
        var id = safeInt(btnNext.getAttribute('data-id')) || nextId;
        if (!id) return toast('다음글 정보(nextId)가 없어 이동할 수 없습니다.');
        goViewById(id);
      });
    }

    if (btnGoReply) btnGoReply.addEventListener('click', function (e) { e.preventDefault(); scrollToReply(); });
    if (btnReplyStat) btnReplyStat.addEventListener('click', function () { scrollToReply(); });

    bindLikeButton(btnLikeTop);
    bindLikeButton(btnLikeStat);
    bindLikeButton(btnLikeBottom);

    if (btnBoardReport) {
      btnBoardReport.addEventListener('click', function () {
        var bid = btnBoardReport.getAttribute('data-board-id') || boardId;
        if (!bid) return toast('board_id를 찾지 못했습니다.');
        doBoardReport(bid);
      });
    }
  }

  /* =========================
   * 전역 이벤트
   * ========================= */

  function bindDelegatedEvents() {
    document.addEventListener('click', function (e) {
      var t = e.target;

      var trigger = t.closest ? t.closest('.js-user-trigger') : null;
      if (trigger) {
        if (userPop && userPop.classList.contains('is-open')) closeUserPop();
        else { closeAllMoreMenus(); openUserPop(trigger); }
        e.preventDefault();
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();