(function () {
  function qs(sel, parent) { return (parent || document).querySelector(sel); }
  function qsa(sel, parent) { return (parent || document).querySelectorAll(sel); }

  function getQueryObj() {
    var obj = {};
    var s = window.location.search;
    if (!s || s.length < 2) return obj;
    var parts = s.substring(1).split('&');
    for (var i = 0; i < parts.length; i++) {
      var kv = parts[i].split('=');
      if (kv[0]) obj[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || '');
    }
    return obj;
  }

  function buildQuery(obj) {
    var arr = [];
    for (var k in obj) {
      if (!obj.hasOwnProperty(k)) continue;
      if (obj[k] === null || obj[k] === undefined || obj[k] === '') continue;
      arr.push(encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]));
    }
    return arr.length ? ('?' + arr.join('&')) : '';
  }

  // 제목(전체보기/해시태그)
  var titleEl = qs('#qnaListTitleValue');
  (function syncTitle() {
    if (!titleEl) return;
    var q = getQueryObj();
    titleEl.textContent = (q.category && q.category !== '') ? q.category : '전체보기';
  })();

  // ===== 보기 방식 + 개수 제한 =====
  var table = qs('#qnaTable');
  var btnWrap = qs('#qnaViewBtns');
  var viewBtns = btnWrap ? qsa('.viewBtn', btnWrap) : [];
  var headRow = qs('#qnaHeadRow');
  var currentView = 'list';

  var VIEW_LIMITS = { list: 20, album: 10, card: 10 };

  function getBodyRows() {
    return table ? qsa('.qna-row--body', table) : [];
  }

  function setActiveBtn(view) {
    for (var i = 0; i < viewBtns.length; i++) {
      if (viewBtns[i].getAttribute('data-view') === view) viewBtns[i].classList.add('active');
      else viewBtns[i].classList.remove('active');
    }
  }

  function applyLimit(view) {
    var rows = getBodyRows();
    var limit = VIEW_LIMITS[view] || 20;
    for (var i = 0; i < rows.length; i++) {
      rows[i].style.display = (i < limit) ? '' : 'none';
    }
  }

  function applyView(view) {
    if (!table) return;

    currentView = view;

    table.className = table.className
      .replace(/\bview-list\b/g, '')
      .replace(/\bview-album\b/g, '')
      .replace(/\bview-card\b/g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/^\s+|\s+$/g, '');

    table.className += ' view-' + view;

    setActiveBtn(view);
    applyLimit(view);

    try { localStorage.setItem('qna_view_mode', view); } catch (e) {}
  }

  (function initView() {
    var view = 'list';
    try {
      var saved = localStorage.getItem('qna_view_mode');
      if (saved === 'list' || saved === 'album' || saved === 'card') view = saved;
    } catch (e) {}
    applyView(view);
  })();

  if (btnWrap) {
    btnWrap.addEventListener('click', function (e) {
      var t = e.target;
      while (t && t !== btnWrap && t.tagName !== 'BUTTON') t = t.parentNode;
      if (!t || t === btnWrap) return;

      var view = t.getAttribute('data-view');
      if (!view) return;

      applyView(view);
    });
  }

  // ===== (요청 4) 좋아요/답변/작성 정렬 =====
  var sortState = { key: null, dir: 'asc' }; // dir: asc|desc

  function toNumber(v) {
    var n = parseFloat(v);
    return isNaN(n) ? 0 : n;
  }

  function sortRows(key, dir) {
    if (!table) return;

    var rows = getBodyRows();
    var arr = [];
    for (var i = 0; i < rows.length; i++) arr.push(rows[i]);

    arr.sort(function (a, b) {
      var av = 0, bv = 0;

      if (key === 'like') {
        av = toNumber(a.getAttribute('data-like'));
        bv = toNumber(b.getAttribute('data-like'));
      } else if (key === 'answer') {
        av = toNumber(a.getAttribute('data-answer'));
        bv = toNumber(b.getAttribute('data-answer'));
      } else if (key === 'created') {
        av = toNumber(a.getAttribute('data-created'));
        bv = toNumber(b.getAttribute('data-created'));
      }

      if (av === bv) return 0;
      return (dir === 'asc') ? (av - bv) : (bv - av);
    });

    // headRow 다음에 body들을 재삽입
    for (var j = 0; j < arr.length; j++) {
      table.appendChild(arr[j]);
    }

    // 뷰 제한 다시 적용
    applyLimit(currentView);
  }

  function resetSortBtnStyles() {
    if (!headRow) return;
    var btns = qsa('.sort-btn', headRow);
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.remove('asc');
      btns[i].classList.remove('desc');
    }
  }

  if (headRow) {
    headRow.addEventListener('click', function (e) {
      var t = e.target;
      while (t && t !== headRow && !(t.className && String(t.className).indexOf('sort-btn') > -1)) {
        t = t.parentNode;
      }
      if (!t || t === headRow) return;

      var key = t.getAttribute('data-key');
      if (!key) return;

      // 토글
      if (sortState.key === key) {
        sortState.dir = (sortState.dir === 'asc') ? 'desc' : 'asc';
      } else {
        sortState.key = key;
        sortState.dir = 'asc';
      }

      resetSortBtnStyles();
      t.classList.add(sortState.dir);

      sortRows(sortState.key, sortState.dir);
    });
  }

  // ===== 분야 클릭 → category 쿼리 =====
  var catGrid = qs('#qnaCategoryGrid');
  if (catGrid) {
    catGrid.addEventListener('click', function (e) {
      var t = e.target;
      while (t && t !== catGrid && t.tagName !== 'A') t = t.parentNode;
      if (!t || t === catGrid) return;

      var category = t.getAttribute('data-category');
      if (!category) return;

      e.preventDefault();

      var q = getQueryObj();
      q.category = category;
      q.page = '1';
      window.location.href = window.location.pathname + buildQuery(q);
    });
  }

  // 검색 Enter submit
  var searchForm = qs('#qnaSearchForm');
  if (searchForm) {
    var input = qs('.qna-search__input', searchForm);
    if (input) {
      input.addEventListener('keydown', function (e) {
        var code = e.keyCode || e.which;
        if (code === 13) searchForm.submit();
      });
    }
  }

  // 페이징
  var pager = qs('#qnaPagination');
  if (pager) {
    var cur = parseInt(pager.getAttribute('data-page'), 10) || 1;
    var total = parseInt(pager.getAttribute('data-total'), 10) || 1;

    function moveTo(page) {
      if (page < 1) page = 1;
      if (page > total) page = total;
      var q = getQueryObj();
      q.page = String(page);
      window.location.href = window.location.pathname + buildQuery(q);
    }

    pager.addEventListener('click', function (e) {
      var t = e.target;
      while (t && t !== pager && t.tagName !== 'BUTTON') t = t.parentNode;
      if (!t || t === pager) return;

      var move = t.getAttribute('data-move');
      var pageAttr = t.getAttribute('data-page');

      if (move === 'prev') return moveTo(cur - 1);
      if (move === 'next') return moveTo(cur + 1);

      if (pageAttr) {
        var p = parseInt(pageAttr, 10);
        if (!isNaN(p)) moveTo(p);
      }
    });
  }
})();
