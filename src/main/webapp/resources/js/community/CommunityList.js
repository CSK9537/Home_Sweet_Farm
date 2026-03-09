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

  function applyViewClass(view) {
    listEl.className = listEl.className
      .replace(/\bview-card\b/g, '')
      .replace(/\bview-album\b/g, '')
      .replace(/\bview-list\b/g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/^\s+|\s+$/g, '');

    listEl.className += ' ' + ('view-' + view);
  }

  function syncButtons(view) {
    for (var i = 0; i < btns.length; i++) {
      var v = btns[i].getAttribute('data-view');
      btns[i].className = (v === view) ? 'viewBtn is-active' : 'viewBtn';
    }
  }

  function removeInlineBadges() {
    var clones = qsa('.marketBadgeClone', listEl);
    for (var i = 0; i < clones.length; i++) {
      if (clones[i] && clones[i].parentNode) {
        clones[i].parentNode.removeChild(clones[i]);
      }
    }
  }

  function injectInlineBadgesIfNeeded(view) {
    if (view !== 'list') {
      removeInlineBadges();
      return;
    }

    var items = qsa('.postItem', listEl);
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var titleEl = qs('.postItem__title', item);
      if (!titleEl) continue;

      if (qs('.marketBadgeClone', titleEl)) continue;

      var badge = qs('.marketBadge', item);
      if (!badge) continue;

      var clone = badge.cloneNode(true);
      clone.className = (clone.className + ' marketBadgeClone').replace(/\s{2,}/g, ' ');

      if (titleEl.firstChild) {
        titleEl.insertBefore(clone, titleEl.firstChild);
      } else {
        titleEl.appendChild(clone);
      }

      titleEl.insertBefore(document.createTextNode(' '), clone.nextSibling);
    }
  }

  function applyView(view) {
    applyViewClass(view);
    syncButtons(view);
    injectInlineBadgesIfNeeded(view);
  }

  function init() {
    // 항상 카드형으로 시작
    applyView('card');

    // 예전 localStorage 값이 남아 있어도 무시
    try {
      localStorage.removeItem('communityViewMode_FREE');
      localStorage.removeItem('communityViewMode_MARKET');
    } catch (e) {}

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