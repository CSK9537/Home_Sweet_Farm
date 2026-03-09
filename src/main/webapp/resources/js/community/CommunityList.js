(function () {
  function qs(sel, parent) {
    return (parent || document).querySelector(sel);
  }

  function qsa(sel, parent) {
    return (parent || document).querySelectorAll(sel);
  }

  function getQueryParam(name) {
    try {
      return new URLSearchParams(window.location.search).get(name);
    } catch (e) {
      return null;
    }
  }

  function normalizeView(view) {
    if (view === 'album' || view === 'list') {
      return view;
    }
    return 'card';
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

  function moveWithView(view) {
    var url;
    try {
      url = new URL(window.location.href);
    } catch (e) {
      return;
    }

    url.searchParams.set('view', view);
    url.searchParams.set('page', '1');
    window.location.href = url.toString();
  }

  function init() {
    var currentView = normalizeView(getQueryParam('view'));
    applyView(currentView);

    for (var i = 0; i < btns.length; i++) {
      btns[i].onclick = function () {
        var view = normalizeView(this.getAttribute('data-view'));
        moveWithView(view);
      };
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();