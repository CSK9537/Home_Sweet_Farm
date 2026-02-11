(function () {
  'use strict';

  /* 공통 유틸 함수 */

  // querySelector 단축
  function $(sel, root) { return (root || document).querySelector(sel); }

  // querySelectorAll 단축
  function $all(sel, root) { return (root || document).querySelectorAll(sel); }

  // 문자열 trim
  function trim(s) { return (s || '').replace(/^\s+|\s+$/g, ''); }

  // XSS 방지용 escape
  function esc(s) {
    s = String(s === undefined || s === null ? '' : s);
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // matches polyfill
  function matches(el, selector) {
    if (!el || el.nodeType !== 1) return false;
    var p = Element.prototype;
    var f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector;
    return f ? f.call(el, selector) : false;
  }

  // closest 구현
  function closest(el, selector) {
    while (el) {
      if (matches(el, selector)) return el;
      el = el.parentNode;
    }
    return null;
  }

  // context path 계산
  function getCtx() {
    var path = location.pathname;
    var idx = path.indexOf('/community');
    return idx > 0 ? path.substring(0, idx) : '';
  }

  /* 전역 값 */

  var loginUserId = $('#loginUserId') ? $('#loginUserId').value : '';
  var board_id = $('#board_id') ? $('#board_id').value : '';

  /* 게시글 신고 버튼 (목록 옆)*/
  var btnBoardReport = document.getElementById('btnBoardReport');
  if (btnBoardReport) {
    btnBoardReport.addEventListener('click', function () {
      location.href =
        getCtx() +
        '/community/board/report?board_id=' +
        encodeURIComponent(board_id);
    });
  }

  /* 유저 닉네임 팝업 */

  var userPop = $('#userPop');
  var activeUser = null;

  function closeUserPop() {
    if (!userPop) return;
    userPop.style.display = 'none';
    activeUser = null;
  }

  function openUserPop(anchor, userId, userNick) {
    if (!userPop) return;

    activeUser = { user_id: userId, writer: userNick };

    var rect = anchor.getBoundingClientRect();
    userPop.style.left = rect.left + 'px';
    userPop.style.top = rect.bottom + 8 + 'px';
    userPop.style.display = 'block';
  }

  /* 
   * 댓글 ⋮ 메뉴
   * - 본인: 수정/삭제
   * - 타인: 신고
  */

  function closeAllMoreMenus() {
    var pops = $all('.js-more-pop');
    for (var i = 0; i < pops.length; i++) {
      pops[i].style.display = 'none';
    }
  }

  function openMoreMenu(ownerItem, anchorBtn) {
    var pop = $('.js-more-pop', ownerItem);
    if (!pop) return;

    // 이미 열려있으면 토글로 닫기
    if (pop.style.display === 'block') {
      pop.style.display = 'none';
      return;
    }

    closeAllMoreMenus();

    // 작성자 비교
    var writerId = ownerItem.getAttribute('data-writer-id');
    var isOwner = String(writerId) === String(loginUserId);

    // 버튼 분기
    $('.js-edit', pop).style.display = isOwner ? 'block' : 'none';
    $('.js-delete', pop).style.display = isOwner ? 'block' : 'none';
    $('.js-report', pop).style.display = isOwner ? 'none' : 'block';

    // fixed 기준 위치 계산
    var rect = anchorBtn.getBoundingClientRect();
    pop.style.display = 'block';
    pop.style.left = rect.right - pop.offsetWidth + 'px';
    pop.style.top = rect.bottom + 8 + 'px';
  }

  /* 댓글 수정 기능 */
  function startEditItem(ownerItem) {
    var textEl = $('.js-item-text', ownerItem);
    if (!textEl) return;

    var old = textEl.textContent;

    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<textarea class="cv-textarea">' + esc(old) + '</textarea>' +
      '<div class="cv-form-actions">' +
      '<button class="cv-btn js-edit-save">수정</button>' +
      '</div>';

    textEl.style.display = 'none';
    textEl.parentNode.insertBefore(wrap, textEl.nextSibling);

    wrap.addEventListener('click', function (e) {
      if (e.target.classList.contains('js-edit-save')) {
        var newVal = trim(wrap.querySelector('textarea').value);
        if (!newVal) return;

        textEl.textContent = newVal;
        wrap.remove();
        textEl.style.display = 'block';
      }
    });
  }

  /* 대댓글 처리
     - 입력창에 @ 자동 삽입 안함
     - 등록 시에만 @배지 생성
  */

  var replyContext = null; // 멘션 대상 저장용

  function renderNestedReply(rootLi, depth, targetNick, content) {
    var list = $('.cv-reply-list', rootLi);
    if (!list) return;

    var uiLevel = depth > 3 ? 3 : depth;

    // 등록 시에만 멘션 생성
    var mentionHtml = '';
    if (depth >= 2 && targetNick) {
      mentionHtml = '<span class="cv-mention">@' + esc(targetNick) + '</span>';
    }

    var li = document.createElement('li');
    li.className = 'cv-reply-item';
    li.setAttribute('data-writer-id', loginUserId);

    li.innerHTML =
      '<div class="cv-reply-bubble">' +
      '<div class="cv-reply-text js-item-text">' +
      mentionHtml + esc(content) +
      '</div>' +
      '</div>' +
      '<div class="cv-pop cv-cmt-pop js-more-pop" style="display:none;">' +
      '<button class="js-edit">수정</button>' +
      '<button class="js-delete">삭제</button>' +
      '<button class="js-report">신고</button>' +
      '</div>';

    list.appendChild(li);
  }

  /* 전역 클릭 이벤트 위임 */
  document.addEventListener('click', function (e) {
    var t = e.target;

    // 유저 닉 클릭
    if (t.classList.contains('js-user-trigger')) {
      openUserPop(t, t.dataset.userId, t.dataset.userNick);
      return;
    }

    // ⋮ 메뉴 클릭 (대댓글 우선)
    if (t.classList.contains('js-more-menu')) {
      var owner =
        closest(t, '.cv-reply-item') ||
        closest(t, '.cv-comment-item');
      if (owner) openMoreMenu(owner, t);
      return;
    }

    // 수정 클릭
    if (t.classList.contains('js-edit')) {
      startEditItem(closest(t, '.cv-reply-item') ||
                    closest(t, '.cv-comment-item'));
      return;
    }

    // 삭제 클릭
    if (t.classList.contains('js-delete')) {
      var item =
        closest(t, '.cv-reply-item') ||
        closest(t, '.cv-comment-item');
      if (confirm('삭제하시겠습니까?')) item.remove();
      return;
    }

    // 답글 버튼
    if (t.classList.contains('js-reply-btn')) {
      var root = closest(t, '.cv-comment-item');
      replyContext = {
        rootLi: root,
        depth: 2,
        targetNick: root.getAttribute('data-writer-nick')
      };
      return;
    }

    // 대댓글 등록
    if (t.classList.contains('js-reply-submit')) {
      var rootLi = closest(t, '.cv-comment-item');
      var input = $('.js-reply-input', rootLi);
      var content = trim(input.value);
      if (!content) return;

      var depth = replyContext ? replyContext.depth : 2;
      var targetNick = replyContext ? replyContext.targetNick : '';

      renderNestedReply(rootLi, depth, targetNick, content);

      input.value = '';
      replyContext = null;
      return;
    }
  });

})();
