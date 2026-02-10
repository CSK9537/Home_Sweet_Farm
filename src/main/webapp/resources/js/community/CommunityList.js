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

  function applyView(view) {
    // view: 'card' | 'album' | 'list'
    listEl.className = listEl.className
      .replace(/\bview-card\b/g, '')
      .replace(/\bview-album\b/g, '')
      .replace(/\bview-list\b/g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/^\s+|\s+$/g, '');

    listEl.className += ' ' + ('view-' + view);

    for (var i = 0; i < btns.length; i++) {
      var v = btns[i].getAttribute('data-view');
      if (v === view) btns[i].className = 'viewBtn is-active';
      else btns[i].className = 'viewBtn';
    }

    // 선택 유지(선택사항)
    try { localStorage.setItem('communityViewMode', view); } catch (e) {}
  }

  function init() {
    var saved = null;
    try { saved = localStorage.getItem('communityViewMode'); } catch (e) {}

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
