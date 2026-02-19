(function () {
  function qs(sel, parent) { return (parent || document).querySelector(sel); }

  function getContextPath() {
    var hostIndex = location.href.indexOf(location.host) + location.host.length;
    return location.href.substring(hostIndex, location.href.indexOf('/', hostIndex + 1));
  }

  function parseQuery() {
    var q = {};
    var s = window.location.search;
    if (!s || s.length < 2) return q;
    var parts = s.substring(1).split('&');
    for (var i = 0; i < parts.length; i++) {
      var kv = parts[i].split('=');
      var k = decodeURIComponent(kv[0] || '');
      var v = decodeURIComponent(kv[1] || '');
      if (k) q[k] = v;
    }
    return q;
  }

  function buildUrl(params) {
    var base = location.pathname; // 현재 경로 유지
    var q = [];
    for (var k in params) {
      if (!params.hasOwnProperty(k)) continue;
      if (params[k] === null || params[k] === undefined || params[k] === '') continue;
      q.push(encodeURIComponent(k) + '=' + encodeURIComponent(params[k]));
    }
    return base + (q.length ? ('?' + q.join('&')) : '');
  }

  function attachPaging(pagingEl, pageParamName) {
    if (!pagingEl) return;

    pagingEl.addEventListener('click', function (e) {
      var t = e.target;
      while (t && t !== pagingEl && t.tagName !== 'A') t = t.parentNode;
      if (!t || t === pagingEl) return;

      e.preventDefault();

      var cur = parseInt(pagingEl.getAttribute('data-page'), 10) || 1;
      var total = parseInt(pagingEl.getAttribute('data-total'), 10) || 1;

      var move = t.getAttribute('data-move');
      var pageAttr = t.getAttribute('data-page');

      var nextPage = cur;

      if (pageAttr) nextPage = parseInt(pageAttr, 10);
      else if (move === 'first') nextPage = 1;
      else if (move === 'prev') nextPage = Math.max(1, cur - 1);
      else if (move === 'next') nextPage = Math.min(total, cur + 1);
      else if (move === 'last') nextPage = total;

      var q = parseQuery();

      // 다른 페이징 상태 유지
      q[pageParamName] = String(nextPage);

      // 정렬(답변대기)
      var sortSel = qs('#waitingSort');
      if (sortSel) q['waitingSort'] = sortSel.value;

      // 컨텍스트패스 환경에서도 pathname은 이미 포함되므로 그대로 사용
      location.href = buildUrl(q);
    });
  }

  // 2개 페이징: faqPage / waitingPage
  var faqPaging = qs('#faqPaging');
  var waitingPaging = qs('#waitingPaging');

  attachPaging(faqPaging, 'faqPage');
  attachPaging(waitingPaging, 'waitingPage');

  // 답변대기 정렬 변경 시 waitingPage=1로 이동(FAQ 페이지는 유지)
  var sortSel = qs('#waitingSort');
  if (sortSel) {
    sortSel.addEventListener('change', function () {
      var q = parseQuery();
      q['waitingSort'] = sortSel.value;
      q['waitingPage'] = '1';
      location.href = buildUrl(q);
    });
  }

  // 서브탭 active 처리(현재 URL 기반)
  var tabs = qs('#qnaSubTabs');
  if (tabs) {
    var path = location.pathname;
    var links = tabs.querySelectorAll('a.qna-subtab');
    for (var i = 0; i < links.length; i++) {
      links[i].className = links[i].className.replace(/\bactive\b/g, '').replace(/\s{2,}/g, ' ').replace(/^\s+|\s+$/g, '');
    }
    // /qna/people 포함이면 people 활성
    var peopleActive = (path.indexOf('/qna/people') !== -1);
    for (var j = 0; j < links.length; j++) {
      var tab = links[j].getAttribute('data-tab');
      if ((peopleActive && tab === 'people') || (!peopleActive && tab === 'questions')) {
        links[j].className += ' active';
      }
    }
  }
})();
