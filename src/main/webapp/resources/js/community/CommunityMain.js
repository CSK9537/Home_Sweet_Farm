(function () {
  function qs(sel, parent) { return (parent || document).querySelector(sel); }
  function qsa(sel, parent) { return (parent || document).querySelectorAll(sel); }

  var root = qs('#communityMainSections');
  if (!root) return;

  var moreBtn = qs('#moreBtn', root);
  var moreWrap = qs('#moreWrap', root);
  var moreGrid = qs('#moreGrid', root);
  var moreTitle = qs('#moreTitle', root);
  var closeMoreBtn = qs('#closeMoreBtn', root);

  // 레일(기존 구조 유지)
  var railPopular = qs('#popularRail', root);
  var railHot = qs('#hotRail', root);
  var railLatest = qs('#latestRail', root);
  var railQa = qs('#qaRail', root);

  // 현재 선택 kind 상태
  var currentKind = 'latest';

  // ---------- 카드 DOM 생성 ----------
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
    // API는 "태그1,태그2" 형태로 줄 수 있으니 "#태그1 #태그2"로 표시
    if (!hashtags) return '';
    var arr = String(hashtags).split(',');
    var out = [];
    for (var i = 0; i < arr.length; i++) {
      var t = arr[i].trim();
      if (t) out.push('#' + t);
    }
    return out.join(' ');
  }

  function buildCard(post) {
    // post: { title, moveUrl, thumbSrc, viewCount, likeCount, replyCount, hashtags, username/author... }
    var a = document.createElement('a');
    a.className = 'post-card';
    a.href = post.moveUrl || '#';

    var img = document.createElement('img');
    img.className = 'post-thumb';
    img.alt = 'thumbnail';
    img.src = post.thumbSrc || (window.DEFAULT_POST_IMG || '');
    a.appendChild(img);

    var body = document.createElement('div');
    body.className = 'post-body';

    var title = document.createElement('div');
    title.className = 'post-title';
    title.innerHTML = escapeHtml(post.title || '');
    body.appendChild(title);

    // 작성자(프로젝트 정책에 맞춰 필드명 선택)
    // - DTO에 username을 넣었다면 username 사용
    // - author를 쓰는 구조면 author 사용
    var writer = document.createElement('div');
    writer.className = 'post-writer';
    writer.innerHTML = escapeHtml(post.username || post.author || '');
    body.appendChild(writer);

    var meta = document.createElement('div');
    meta.className = 'post-meta';
    meta.innerHTML =
      '<span>조회 ' + (post.viewCount || 0) + '</span>' +
      '<span>좋아요 ' + (post.likeCount || 0) + '</span>' +
      '<span>댓글 ' + (post.replyCount || 0) + '</span>';
    body.appendChild(meta);

    var tags = document.createElement('div');
    tags.className = 'post-tags';
    tags.innerHTML = escapeHtml(formatHashtags(post.hashtags));
    body.appendChild(tags);

    a.appendChild(body);
    return a;
  }

  // ---------- API 호출 ----------
  function fetchMore(kind, limit, cb) {
    // contextPath 안전 처리: moveUrl/thumbSrc는 서버에서 완성해 내려오므로 여기선 그대로 사용
    var url = root.getAttribute('data-more-api') || (root.getAttribute('data-context') || '') + '/community/main/more';
    url += '?kind=' + encodeURIComponent(kind) + '&limit=' + encodeURIComponent(limit);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          var data = JSON.parse(xhr.responseText);
          cb(null, data);
        } catch (e) {
          cb(e);
        }
      } else {
        cb(new Error('HTTP ' + xhr.status));
      }
    };
    xhr.send();
  }

  function openMore(kind, titleText) {
    currentKind = kind;
    if (moreTitle) moreTitle.textContent = titleText || '전체보기';

    if (moreGrid) moreGrid.innerHTML = '';
    if (moreWrap) moreWrap.style.display = 'block';

    // ✅ 서버에서 최대 100개 가져오기
    fetchMore(kind, 100, function (err, list) {
      if (err) {
        // 실패 시 폴백: 기존 레일 복제(최소한 동작 보장)
        renderMoreFromRailFallback(kind);
        return;
      }
      if (!list || !list.length) return;

      for (var i = 0; i < list.length; i++) {
        moreGrid.appendChild(buildCard(list[i]));
      }
    });
  }

  // ---------- 폴백: 기존 레일 복제(에러 시 최소 동작) ----------
  function renderMoreFromRailFallback(kind) {
    var rail = null;
    if (kind === 'popular') rail = railPopular;
    else if (kind === 'hot') rail = railHot;
    else if (kind === 'latest') rail = railLatest;
    else if (kind === 'qa') rail = railQa;

    if (!rail || !moreGrid) return;

    moreGrid.innerHTML = '';
    var items = qsa('.post-card', rail);
    var max = items.length > 100 ? 100 : items.length;

    for (var i = 0; i < max; i++) {
      moreGrid.appendChild(items[i].cloneNode(true));
    }
  }

  function closeMore() {
    if (moreWrap) moreWrap.style.display = 'none';
    if (moreGrid) moreGrid.innerHTML = '';
  }

  // ---------- 이벤트 바인딩 ----------
  if (closeMoreBtn) closeMoreBtn.addEventListener('click', closeMore);

  // “전체보기” 버튼이 1개이고, 내부에서 현재 탭(kind)을 결정하는 구조라면
  // 여기서는 data-kind를 버튼에 넣는 방식을 권장
  if (moreBtn) {
    moreBtn.addEventListener('click', function () {
      // 버튼에 data-kind가 있으면 그걸 쓰고, 없으면 latest
      var kind = moreBtn.getAttribute('data-kind') || currentKind || 'latest';
      openMore(kind, '전체보기');
    });
  }

  // 레일별 “전체보기”를 각각 두는 구조라면, 버튼들에 data-kind 걸어서 처리
  var moreBtns = qsa('[data-more-kind]', root);
  for (var i = 0; i < moreBtns.length; i++) {
    (function (btn) {
      btn.addEventListener('click', function () {
        var kind = btn.getAttribute('data-more-kind') || 'latest';
        var titleText = btn.getAttribute('data-more-title') || '전체보기';
        openMore(kind, titleText);
      });
    })(moreBtns[i]);
  }
})();