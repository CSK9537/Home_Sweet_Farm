(function () {
  function qs(sel, parent) {
    return (parent || document).querySelector(sel);
  }
  function qsa(sel, parent) {
    return (parent || document).querySelectorAll(sel);
  }

  var listEl = qs('#communityList');
  var btns = qsa('.viewBtn');

  if (!listEl || !btns || btns.length === 0) return;

  // 현재 게시판 타입 추정(쿼리스트링 type=FREE|MARKET 기준)
  function getBoardType() {
    var s = location.search || '';
    // 간단 파싱
    if (s.indexOf('type=MARKET') !== -1) return 'MARKET';
    return 'FREE';
  }

  // 저장 키를 타입별로 분리(선택사항: FREE/MARKET 각각 다른 뷰 기억)
  function storageKey() {
    return 'communityViewMode_' + getBoardType();
  }

  // className에서 view-* 제거 후 view-xxx만 적용
  function applyViewClass(view) {
    listEl.className = listEl.className
      .replace(/\bview-card\b/g, '')
      .replace(/\bview-album\b/g, '')
      .replace(/\bview-list\b/g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/^\s+|\s+$/g, '');

    listEl.className += ' ' + ('view-' + view);
  }

  // 버튼 active 처리
  function syncButtons(view) {
    for (var i = 0; i < btns.length; i++) {
      var v = btns[i].getAttribute('data-view');
      btns[i].className = (v === view) ? 'viewBtn is-active' : 'viewBtn';
    }
  }

  // =========================================================
  // 리스트 뷰에서 배지가 안 보이는 문제 해결:
  // - JSP에서 marketBadge가 imgWrap 안에 있으면
  //   view-list에서는 imgWrap 자체가 display:none이라 배지도 같이 숨겨짐
  // - 따라서 view-list일 때만 badge를 title 앞에 "복제"해 보여줌
  // =========================================================
  function removeInlineBadges() {
    var clones = qsa('.marketBadgeClone', listEl);
    for (var i = 0; i < clones.length; i++) {
      if (clones[i] && clones[i].parentNode) clones[i].parentNode.removeChild(clones[i]);
    }
  }

  function injectInlineBadgesIfNeeded(view) {
    // 리스트 뷰가 아니면 복제 배지 제거
    if (view !== 'list') {
      removeInlineBadges();
      return;
    }

    // 리스트 뷰: 각 postItem마다 imgWrap 안의 배지를 찾아 title 앞에 복제
    var items = qsa('.postItem', listEl);
    for (var i = 0; i < items.length; i++) {
      var item = items[i];

      // title 요소
      var titleEl = qs('.postItem__title', item);
      if (!titleEl) continue;

      // 이미 넣었으면 스킵
      if (qs('.marketBadgeClone', titleEl)) continue;

      // 원본 배지(imgWrap 안)
      var badge = qs('.marketBadge', item);
      if (!badge) continue; // 자유게시판이거나 마켓인데 배지가 없으면 패스

      // 복제 생성
      var clone = badge.cloneNode(true);
      clone.className = (clone.className + ' marketBadgeClone').replace(/\s{2,}/g, ' ');

      // 리스트에서 inline-chip 형태로 보이도록( CSS에서 .view-list .marketBadge {position:static...} 이미 처리 )
      // title 맨 앞에 삽입
      if (titleEl.firstChild) {
        titleEl.insertBefore(clone, titleEl.firstChild);
      } else {
        titleEl.appendChild(clone);
      }

      // 배지 뒤에 공백
      titleEl.insertBefore(document.createTextNode(' '), clone.nextSibling);
    }
  }

  function applyView(view) {
    // view: 'card' | 'album' | 'list'
    applyViewClass(view);
    syncButtons(view);

    // 리스트 뷰 배지 처리
    injectInlineBadgesIfNeeded(view);

    // 선택 유지
    try { localStorage.setItem(storageKey(), view); } catch (e) {}
  }

  function init() {
    var saved = null;
    try { saved = localStorage.getItem(storageKey()); } catch (e) {}

    if (saved === 'album' || saved === 'list' || saved === 'card') {
      applyView(saved);
    } else {
      applyView('card'); // 기본: 카드형
    }

    for (var i = 0; i < btns.length; i++) {
      btns[i].onclick = function () {
        var view = this.getAttribute('data-view');
        applyView(view);
      };
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
