(function () {

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return (root || document).querySelectorAll(sel); }
  function toInt(v) { var n = parseInt(v, 10); return isNaN(n) ? 0 : n; }

  // rail 안의 카드들을 rail-track으로 감싸기
  function ensureTrack(rail) {
    var track = rail.querySelector('.rail-track');
    if (track) return track;

    track = document.createElement('div');
    track.className = 'rail-track';

    // rail의 직계 element만 track으로 이동
    var nodes = [];
    var i;
    for (i = 0; i < rail.childNodes.length; i++) {
      if (rail.childNodes[i].nodeType === 1) nodes.push(rail.childNodes[i]);
    }
    for (i = 0; i < nodes.length; i++) track.appendChild(nodes[i]);

    rail.appendChild(track);
    return track;
  }

  function getGap(track) {
    var cs = window.getComputedStyle(track);
    var g = cs.columnGap || cs.gap || '0';
    return toInt(g);
  }

  function visibleCountByRail(rail) {
    var w = rail.getBoundingClientRect().width;
    // CSS 반응형과 동일하게
    if (w <= 767) return 1;
    if (w <= 1024) return 2;
    return 4;
  }

  function initCarousel(key) {
    var rail = document.getElementById('rail-' + key);
    if (!rail) return;

    var track = ensureTrack(rail);
    var leftBtn = qs('.js-nav[data-target="' + key + '"][data-dir="-1"]');
    var rightBtn = qs('.js-nav[data-target="' + key + '"][data-dir="1"]');

    var state = {
      key: key,
      rail: rail,
      track: track,
      left: leftBtn,
      right: rightBtn,
      idx: 0,
      step: 0,
      visible: 4,
      total: 0,
      maxCards: 10
    };

    function applyMax10() {
      var kids = track.children;
      var i;
      for (i = 0; i < kids.length; i++) {
        // 10개 초과분은 숨김
        kids[i].style.display = (i >= state.maxCards) ? 'none' : '';
      }
    }

    function recountTotal() {
      var kids = track.children;
      var count = 0;
      var i;
      for (i = 0; i < kids.length; i++) {
        if (kids[i].style.display === 'none') continue;
        count++;
      }
      state.total = count;
    }

    function computeStep() {
      var kids = track.children;
      var first = null;
      var i;
      for (i = 0; i < kids.length; i++) {
        if (kids[i].style.display === 'none') continue;
        first = kids[i];
        break;
      }
      if (!first) { state.step = 0; return; }

      var gap = getGap(track);
      var w = first.getBoundingClientRect().width;
      state.step = w + gap;
    }

    function maxIdx() {
      var m = state.total - state.visible;
      return m < 0 ? 0 : m;
    }

    function clampIdx() {
      if (state.idx < 0) state.idx = 0;
      var m = maxIdx();
      if (state.idx > m) state.idx = m;
    }

    function render() {
      clampIdx();
      var x = -(state.idx * state.step);
      track.style.transform = 'translateX(' + x + 'px)';

      if (state.left) state.left.disabled = (state.idx === 0);
      if (state.right) state.right.disabled = (state.idx === maxIdx());
    }

    function measure() {
      applyMax10();
      recountTotal();
      state.visible = visibleCountByRail(state.rail);
      computeStep();
      clampIdx();
      render();
    }

    if (state.left) {
      state.left.onclick = function () {
        state.idx -= 1;   // 1장씩 이동
        render();
      };
    }
    if (state.right) {
      state.right.onclick = function () {
        state.idx += 1;   // 1장씩 이동
        render();
      };
    }

    // 초기
    measure();

    // 리사이즈 대응
    var t = null;
    window.addEventListener('resize', function () {
      if (t) clearTimeout(t);
      t = setTimeout(measure, 80);
    });
  }

  function bindMoves() {
    // 탭 이동
    var tabs = qsa('#communityTabs .tab-item');
    var i;
    for (i = 0; i < tabs.length; i++) {
      tabs[i].onclick = function () {
        var mv = this.getAttribute('data-move');
        if (mv) window.location.href = mv;
      };
    }

    // 글쓰기 이동
    var btnWrite = qs('#btnWrite');
    if (btnWrite) {
      btnWrite.onclick = function () {
        var mv = btnWrite.getAttribute('data-move');
        if (mv) window.location.href = mv;
      };
    }

    // 카드 클릭 이동(.card / .qcard 모두 js-card 사용)
    document.addEventListener('click', function (e) {
      var el = e.target;
      while (el && el !== document) {
        if (el.classList && el.classList.contains('js-card')) {
          var url = el.getAttribute('data-move');
          if (url) window.location.href = url;
          break;
        }
        el = el.parentNode;
      }
    });
  }

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    // 네 JSP 기준 4개 rail
    initCarousel('popular');
    initCarousel('hot');
    initCarousel('latest');
    initCarousel('qa');
    bindMoves();
  });

})();
