(function () {
  function qs(sel, parent) { return (parent || document).querySelector(sel); }
  function qsa(sel, parent) { return Array.prototype.slice.call((parent || document).querySelectorAll(sel)); }

  var root = qs('#communityMainSections');
  if (!root) return;

  var MORE_API = root.getAttribute('data-more-api') || '/community/main/more';
  var DEFAULT_IMG = root.getAttribute('data-default-img') || '';

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
      .map(function (t) { return '<span class="tag">#' + escapeHtml(t) + '</span>'; })
      .join('');
  }

  function initCarouselNav(scope) {
    qsa('.js-nav', scope).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-target');
        var dir = parseInt(btn.getAttribute('data-dir') || '1', 10);

        var rail = qs('#rail-' + target, root) || qs('#' + target + 'Rail', root);
        if (!rail) return;

        var amount = Math.max(rail.clientWidth, 300) * dir;
        rail.scrollBy({ left: amount, behavior: 'smooth' });
      });
    });
  }

  function initRailWheelScroll(scope) {
    qsa('.rail', scope).forEach(function (rail) {
      rail.addEventListener('wheel', function (e) {
        if (e.deltaY !== 0) {
          e.preventDefault();
          rail.scrollLeft += e.deltaY;
        }
      }, { passive: false });
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

  function buildItem(post) {
    var a = document.createElement('a');
    a.className = 'cm-item';
    a.href = post.moveUrl || '#';

    var imgSrc = post.thumbSrc || DEFAULT_IMG;
    var writer = post.writer || post.userId || post.author || '';
    var regDate = post.regDate || '';
    var replyCnt = (typeof post.replyCnt !== 'undefined') ? post.replyCnt : (post.replyCount || 0);
    var contentPreview = post.contentPreview || '';

    a.innerHTML =
      '<div class="cm-item__imgWrap">' +
        '<img class="cm-item__img" src="' + escapeHtml(imgSrc) + '" alt="" ' +
          'onerror="this.onerror=null; this.src=\'' + escapeHtml(DEFAULT_IMG) + '\';" />' +
      '</div>' +
      '<div class="cm-item__body">' +
        '<div class="cm-item__title">' + escapeHtml(post.title || '') + '</div>' +
        '<div class="cm-item__writer">' + escapeHtml(writer) + '</div>' +
        '<div class="cm-item__date">' + escapeHtml(regDate) + '</div>' +
        '<div class="cm-item__meta">' +
          '<span class="cm-item__stat">조회수 ' + (post.viewCount || 0) + '</span>' +
          '<span class="sep">|</span>' +
          '<span class="cm-item__stat">좋아요 ' + (post.likeCount || 0) + '</span>' +
          '<span class="sep">|</span>' +
          '<span class="cm-item__stat">댓글 ' + replyCnt + '</span>' +
        '</div>' +
        '<div class="cm-item__tags">' + formatHashtags(post.hashtags) + '</div>' +
        '<div class="cm-item__desc">' + escapeHtml(contentPreview) + '</div>' +
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

  function openMorePage(kind, titleText) {
    if (!homeView || !moreView || !moreList) return;

    if (moreTitle) moreTitle.textContent = titleText || '전체보기';

    homeView.style.display = 'none';
    moreView.style.display = 'block';

    setView('card');
    moreList.innerHTML = '<div class="cm-loading">불러오는 중...</div>';

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

    try {
      root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (e) {}
  }

  function closeMorePage() {
    if (!homeView || !moreView) return;
    moreView.style.display = 'none';
    homeView.style.display = 'block';
    if (moreList) moreList.innerHTML = '';
  }

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

  if (backBtn) backBtn.addEventListener('click', closeMorePage);

  if (viewBtnsWrap) {
    qsa('.cm-viewBtn', viewBtnsWrap).forEach(function (btn) {
      btn.addEventListener('click', function () {
        setView(btn.getAttribute('data-view'));
      });
    });
  }

  initCarouselNav(root);
  initRailWheelScroll(root);
  initCardMove(root);
  initMoreButtons();
})();