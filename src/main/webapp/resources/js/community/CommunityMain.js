(function () {
  function qs(sel, parent) { return (parent || document).querySelector(sel); }
  function qsa(sel, parent) { return Array.prototype.slice.call((parent || document).querySelectorAll(sel)); }

  var root = qs('#communityMainSections');
  if (!root) return;

  // ====== API/기본 이미지 ======
  var MORE_API = root.getAttribute('data-more-api') || '/community/main/more';
  var DEFAULT_IMG = root.getAttribute('data-default-img') || '';

  // ====== content-card 내부 "홈뷰/전체보기뷰" ======
  var homeView = qs('#communityHomeView', root);
  var moreView = qs('#communityMoreView', root);
  var moreTitle = qs('#cmMoreTitle', root);
  var moreList = qs('#cmMoreList', root);
  var backBtn = qs('#cmMoreBackBtn', root);
  var viewBtnsWrap = qs('#cmMoreViewBtns', root);

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatHashtags(hashtags) {
    if (!hashtags) return '';
    return String(hashtags)
      .split(',')
      .map(function (t) { return t.trim(); })
      .filter(Boolean)
      .map(function (t) { return '#' + t; })
      .join(' ');
  }

  // ====== 기존 캐러셀 네비/카드 이동 유지 ======
  function initCarouselNav(scope) {
    qsa('.js-nav', scope).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-target');
        var dir = parseInt(btn.getAttribute('data-dir') || '1', 10);

        // 기존 코드 구조에 맞춰 rail id가 #rail-popular 같은 형태라면 아래를 유지
        var rail = qs('#rail-' + target, root) || qs('#' + target + 'Rail', root);
        if (!rail) return;

        var amount = Math.max(rail.clientWidth, 300) * dir;
        rail.scrollBy({ left: amount, behavior: 'smooth' });
      });
    });
  }

  function initCardMove(scope) {
    qsa('.js-card', scope).forEach(function (card) {
      card.addEventListener('click', function () {
        var url = card.getAttribute('data-move');
        if (url) location.href = url;
      });
    });
  }

  // ====== API 호출 ======
  function fetchMore(kind, limit, cb) {
    var url = MORE_API + '?kind=' + encodeURIComponent(kind) + '&limit=' + encodeURIComponent(limit || 100);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          cb(null, JSON.parse(xhr.responseText));
        } catch (e) {
          cb(e);
        }
      } else {
        cb(new Error('HTTP ' + xhr.status));
      }
    };
    xhr.send();
  }

  // ====== 전체보기 item ======
  function buildItem(post) {
    var a = document.createElement('a');
    a.className = 'cm-item';
    a.href = post.moveUrl || '#';

    var imgSrc = post.thumbSrc || DEFAULT_IMG;

    a.innerHTML =
      '<div class="cm-item__imgWrap">' +
        '<img class="cm-item__img" src="' + escapeHtml(imgSrc) + '" alt="" ' +
          'onerror="this.onerror=null; this.src=\'' + escapeHtml(DEFAULT_IMG) + '\';" />' +
        '<div class="cm-item__overlay">' +
          '<div class="cm-item__overlayTitle">' + escapeHtml(post.title || '') + '</div>' +
          '<div class="cm-item__overlayMeta"><span>' + escapeHtml(post.userId || post.author || '') + '</span></div>' +
          '<div class="cm-item__overlayStats">' +
            '<span>조회수 ' + (post.viewCount || 0) + '</span><span class="sep">|</span>' +
            '<span>좋아요 ' + (post.likeCount || 0) + '</span><span class="sep">|</span>' +
            '<span>댓글 ' + (post.replyCount || 0) + '</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="cm-item__body">' +
        '<div class="cm-item__title">' + escapeHtml(post.title || '') + '</div>' +
        '<div class="cm-item__writer">' + escapeHtml(post.userId || post.author || '') + '</div>' +
        '<div class="cm-item__meta">' +
          '<span class="value">조회수 ' + (post.viewCount || 0) + '</span>' +
          '<span class="sep">|</span>' +
          '<span class="value">좋아요 ' + (post.likeCount || 0) + '</span>' +
          '<span class="sep">|</span>' +
          '<span class="value">댓글 ' + (post.replyCount || 0) + '</span>' +
        '</div>' +
        '<div class="cm-item__tags">' + escapeHtml(formatHashtags(post.hashtags)) + '</div>' +
      '</div>';

    return a;
  }

  function setView(view) {
    if (!moreList || !viewBtnsWrap) return;

    moreList.className = moreList.className
      .replace(/\bview-card\b/g, '')
      .replace(/\bview-album\b/g, '')
      .replace(/\bview-list\b/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

    moreList.className += ' view-' + view;

    qsa('.cm-viewBtn', viewBtnsWrap).forEach(function (b) {
      var v = b.getAttribute('data-view');
      b.className = (v === view) ? 'cm-viewBtn is-active' : 'cm-viewBtn';
    });
  }

  // ====== content-card 통째로 교체 (핵심) ======
  function openMorePage(kind, titleText) {
    if (!homeView || !moreView || !moreList) return;

    if (moreTitle) moreTitle.textContent = titleText || '전체보기';

    // 홈 숨기고 전체보기 표시
    homeView.style.display = 'none';
    moreView.style.display = 'block';

    // 기본 뷰
    setView('card');

    // 로딩
    moreList.innerHTML = '<div class="cm-loading">불러오는 중...</div>';

    // 데이터
    fetchMore(kind, 100, function (err, data) {
      if (err) {
        moreList.innerHTML = '<div class="cm-loading">불러오기 실패</div>';
        return;
      }
      if (!data || data.length === 0) {
        moreList.innerHTML = '<div class="empty-panel"><div class="empty-text">게시글 없음</div></div>';
        return;
      }

      moreList.innerHTML = '';
      for (var i = 0; i < data.length; i++) {
        moreList.appendChild(buildItem(data[i]));
      }
    });

    // content-card 상단으로 스크롤(UX)
    try { root.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) {}
  }

  function closeMorePage() {
    if (!homeView || !moreView) return;
    moreView.style.display = 'none';
    homeView.style.display = 'block';
    if (moreList) moreList.innerHTML = '';
  }

  // ====== 이벤트 바인딩 ======
  function initMoreButtons() {
    qsa('.js-more', root).forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();

        var kind = btn.getAttribute('data-more-kind') || 'latest';
        var title = btn.getAttribute('data-more-title') || '전체보기';

        openMorePage(kind, title);
      });
    });
  }

  // 뒤로 버튼
  if (backBtn) backBtn.addEventListener('click', closeMorePage);

  // 보기 버튼
  if (viewBtnsWrap) {
    qsa('.cm-viewBtn', viewBtnsWrap).forEach(function (btn) {
      btn.addEventListener('click', function () {
        setView(btn.getAttribute('data-view'));
      });
    });
  }

  // 최초 바인딩
  initCarouselNav(root);
  initCardMove(root);
  initMoreButtons();
})();