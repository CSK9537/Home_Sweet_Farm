(function () {
  'use strict';

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function getCtx() {
    if (typeof window.__CTX === 'string') return window.__CTX;
    var b = document.body;
    var ctxFromBody = b && b.getAttribute('data-ctx');
    if (ctxFromBody) return ctxFromBody;
    return '';
  }

  function getQueryParam(name) {
    try { return new URLSearchParams(location.search).get(name); }
    catch (e) {
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

  var boardId = (typeof window.board_id !== 'undefined') ? safeInt(window.board_id) : safeInt(getQueryParam('board_id'));
  var boardType = getQueryParam('type') || (typeof window.boardType !== 'undefined' ? window.boardType : null) || 'FREE';

  var btnPrev = $('#btnPrev');
  var btnNext = $('#btnNext');
  var btnList = $('#btnList');

  var btnBoardList = $('#btnBoardList');
  var btnBoardLike = $('#btnBoardLike');
  var btnBoardEdit = $('#btnBoardEdit');
  var btnBoardDelete = $('#btnBoardDelete');
  var btnBoardReport = $('#btnBoardReport');

  var userPop = $('#userPop');
  var activeUser = null;

  var prevId = (typeof window.prevId !== 'undefined') ? safeInt(window.prevId) : null;
  var nextId = (typeof window.nextId !== 'undefined') ? safeInt(window.nextId) : null;

  function goList() {
    location.href = getCtx() + '/community/list?type=' + encode(boardType);
  }
  function goViewById(id) {
    location.href = getCtx() + '/community/view?board_id=' + encode(id) + '&type=' + encode(boardType);
  }

  function openUserPop(triggerEl) {
    if (!userPop || !triggerEl) return;

    // JSP에 맞춤: data-user-id / data-user-nick
    var userId = triggerEl.getAttribute('data-user-id');
    var nick = triggerEl.getAttribute('data-user-nick') || triggerEl.textContent.trim();

    activeUser = { user_id: safeInt(userId) || userId, nickname: nick };

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

  function closeAllMoreMenus() {
    $all('.js-more-pop.is-open, .cv-cmt-pop.is-open').forEach(function (el) {
      el.classList.remove('is-open');
      el.style.display = 'none';
    });
    $all('.js-more-pop, .cv-cmt-pop').forEach(function (el) {
      el.style.display = 'none';
    });
  }

  function toggleMoreMenu(btnEl) {
    var item = btnEl.closest('.cv-comment-item');
    if (!item) return;

    // JSP 구조에 맞춤: .js-more-pop
    var menu = item.querySelector('.js-more-pop');
    if (!menu) return;

    var isOpen = (menu.style.display === 'block') || menu.classList.contains('is-open');

    closeAllMoreMenus();

    if (!isOpen) {
      menu.style.display = 'block';
      menu.classList.add('is-open');
    }
  }

  function bindButtons() {
    if (btnList) btnList.addEventListener('click', goList);
    if (btnBoardList) btnBoardList.addEventListener('click', goList);

    if (btnBoardLike) {
      btnBoardLike.addEventListener('click', function () {
        toast('좋아요 기능은 백엔드(ajax/endpoint) 연결이 필요합니다.');
      });
    }

    if (btnBoardEdit) {
      btnBoardEdit.addEventListener('click', function () {
        if (!boardId) return toast('board_id를 찾지 못했습니다.');
        location.href = getCtx() + '/community/form?mode=edit&board_id=' + encode(boardId) + '&type=' + encode(boardType);
      });
    }

    if (btnBoardDelete) {
      btnBoardDelete.addEventListener('click', function () {
        toast('삭제 기능은 백엔드 delete 매핑이 연결되어야 동작합니다.');
      });
    }

    if (btnPrev) btnPrev.addEventListener('click', function () {
      if (!prevId) return toast('이전글 정보(prevId)가 없습니다.');
      goViewById(prevId);
    });

    if (btnNext) btnNext.addEventListener('click', function () {
      if (!nextId) return toast('다음글 정보(nextId)가 없습니다.');
      goViewById(nextId);
    });

    if (btnBoardReport) btnBoardReport.addEventListener('click', function () {
      toast('신고 기능(모달/endpoint) 연결이 필요합니다.');
    });
  }

  function bindDelegatedEvents() {
    document.addEventListener('click', function (e) {
      var t = e.target;

      var trigger = t.closest ? t.closest('.js-user-trigger') : null;
      if (trigger) {
        if (userPop && userPop.classList.contains('is-open')) closeUserPop();
        else { closeAllMoreMenus(); openUserPop(trigger); }
        e.preventDefault(); e.stopPropagation();
        return;
      }

      var moreBtn = t.closest ? t.closest('.js-more-menu') : null;
      if (moreBtn) {
        closeUserPop();
        toggleMoreMenu(moreBtn);
        e.preventDefault(); e.stopPropagation();
        return;
      }

      // 그 외 클릭 시 닫기
      closeUserPop();
      closeAllMoreMenus();
    }, true);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeUserPop();
        closeAllMoreMenus();
      }
    });
  }

  function init() {
    bindButtons();
    bindDelegatedEvents();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();