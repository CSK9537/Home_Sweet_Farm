<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/qna/QnaList.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/qna/QnaMain.css">

<style>
  .people-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    padding: 20px 0;
  }

  .qna-tabs .qna-tab.active a {
    color: #2ba61c;
    font-weight: 700;
  }

  .people-more-wrap {
    text-align: center;
    padding: 30px 0;
  }

  .people-more-btn {
    padding: 10px 24px;
    border: 1px solid #ddd;
    background: #fff;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
  }

  .people-more-btn:hover {
    background: #f8fbff;
    border-color: #1a73e8;
    color: #1a73e8;
  }

  /* ===== 관심사 그래프 ===== */
  .interest-wrap {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 28px;
    align-items: center;
  }

  .interest-copy {
    min-width: 0;
  }

  .interest-copy__sub {
    font-size: 14px;
    font-weight: 700;
    color: #7a7a7a;
    margin-bottom: 18px;
  }

  .interest-copy__headline {
    font-size: 38px;
    line-height: 1.35;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #222;
  }

  .interest-copy__headline .point {
    color: #17b858;
  }

  .interest-copy__desc {
    margin-top: 18px;
    font-size: 13px;
    color: #888;
  }

  .interest-right {
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .interest-chart {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 24px;
    align-items: center;
  }

  .interest-donut {
    width: 210px;
    height: 210px;
    border-radius: 50%;
    margin: 0 auto;
    position: relative;
    background: conic-gradient(#dfe7df 0 100%);
  }

  .interest-donut::after {
    content: "";
    position: absolute;
    inset: 30px;
    background: #fff;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px #eef2ee;
  }

  .interest-donut__center {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-weight: 800;
    color: #2a2a2a;
  }

  .interest-donut__age {
    font-size: 24px;
    line-height: 1;
  }

  .interest-donut__label {
    margin-top: 6px;
    font-size: 12px;
    color: #888;
    font-weight: 600;
  }

  .interest-legend {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .interest-legend__item {
    display: grid;
    grid-template-columns: 16px 1fr auto;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid #f1f1f1;
    padding-bottom: 10px;
  }

  .interest-legend__item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .interest-legend__dot {
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }

  .interest-legend__name {
    font-size: 15px;
    color: #222;
    font-weight: 600;
  }

  .interest-legend__percent {
    font-size: 15px;
    font-weight: 800;
    color: #111;
  }

  .interest-age-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0;
    border: 1px solid #e7ece7;
    overflow: hidden;
  }

  .interest-age-tab {
    flex: 1 1 14%;
    min-width: 100px;
    height: 52px;
    border: none;
    border-right: 1px solid #e7ece7;
    background: #fff;
    cursor: pointer;
    font-size: 15px;
    font-weight: 700;
    color: #777;
    transition: all 0.2s ease;
  }

  .interest-age-tab:last-child {
    border-right: none;
  }

  .interest-age-tab:hover {
    background: #f7fbf7;
    color: #2ba61c;
  }

  .interest-age-tab.active {
    background: #f3fbf4;
    color: #17b858;
  }

  .interest-empty {
    padding: 30px 20px;
    text-align: center;
    border: 1px dashed #d8dfd8;
    border-radius: 12px;
    color: #888;
    font-size: 14px;
  }

  @media (max-width: 1024px) {
    .people-grid { grid-template-columns: repeat(3, 1fr); }
    .interest-wrap { grid-template-columns: 1fr; }
    .interest-chart { grid-template-columns: 1fr; }
  }

  @media (max-width: 768px) {
    .people-grid { grid-template-columns: repeat(2, 1fr); }
    .interest-copy__headline { font-size: 28px; }
    .interest-age-tab { min-width: 90px; font-size: 14px; }
  }
</style>

<jsp:include page="/WEB-INF/views/layout/header.jsp" />

<div class="page-shell">
  <section class="content-wrap">
    <div class="content-card qna-card">

      <div class="qna-top">
        <div class="qna-top__row1">
          <div class="qna-title">Q&amp;A</div>
          <div class="qna-top__right">
            <a class="qna-btn qna-btn--solid" href="<c:url value='/qna/ask'/>">질문하기</a>
          </div>
        </div>

        <div class="qna-top__row2">
          <ul class="qna-tabs" id="qnaTabs">
            <li class="qna-tab"><a href="<c:url value='/qna/QnaList'/>">질문들</a></li>
            <li class="qna-tab sep">||</li>
            <li class="qna-tab active"><a href="<c:url value='/qna/people'/>">사람들</a></li>
          </ul>
        </div>
        <div class="qna-tabline"></div>
      </div>

      <!-- 상단 통계 -->
      <section class="qna-section">
        <div class="qna-section__head">
          <div class="qna-section__title">데이터로 알아보는 Q&amp;A 관심사</div>
        </div>

        <div class="interest-wrap">
          <div class="interest-copy">
            <div class="interest-copy__sub">Q&amp;A 질문 해시태그 기준</div>
            <div class="interest-copy__headline" id="interestHeadline">
              관심사 통계를 불러오는 중입니다.
            </div>
            <div class="interest-copy__desc">
              상위 4개 해시태그만 100% 기준으로 표시됩니다.
            </div>
          </div>

          <div class="interest-right">
            <div class="interest-chart" id="interestChartArea">
              <div class="interest-donut" id="interestDonut">
                <div class="interest-donut__center">
                  <div class="interest-donut__age" id="interestAgeLabel">30대</div>
                  <div class="interest-donut__label">관심사</div>
                </div>
              </div>

              <div class="interest-legend" id="interestLegend"></div>
            </div>

            <div class="interest-age-tabs" id="interestAgeTabs">
              <button type="button" class="interest-age-tab" data-age="U10">10대 미만</button>
              <button type="button" class="interest-age-tab" data-age="10">10~19세</button>
              <button type="button" class="interest-age-tab" data-age="20">20대</button>
              <button type="button" class="interest-age-tab active" data-age="30">30대</button>
              <button type="button" class="interest-age-tab" data-age="40">40대</button>
              <button type="button" class="interest-age-tab" data-age="50">50대</button>
              <button type="button" class="interest-age-tab" data-age="60">60대 이상</button>
            </div>
          </div>
        </div>
      </section>

      <!-- 상단: 답변 활동이 활발한 사람들 -->
      <section class="qna-section">
        <div class="qna-section__head">
          <div class="qna-section__title">답변 활동이 활발한 사람들</div>
        </div>
        <div class="people-grid">
          <c:forEach var="u" items="${topUsers}">
            <a class="top-user"
               href="${u.userId}"
               id="topUser-${u.userId}">
              <div class="top-user__rank">${u.rank}</div>
              <div class="top-user__avatar">
                <img src="${u.img}" alt="profile">
              </div>
              <div class="top-user__name">${u.name}</div>
              <div class="top-user__meta">
                <span class="pill">${u.badge}</span>
              </div>
              <div class="top-user__point">
                채택 <b><fmt:formatNumber value="${u.point}" pattern="#,###"/></b>
              </div>
            </a>
          </c:forEach>
        </div>
      </section>

      <!-- 하단: 전체 회원 -->
      <section class="qna-section" style="border-top: 1px solid #f0f0f0; margin-top: 40px; padding-top: 40px;">
        <div class="qna-section__head">
          <div class="qna-section__title">전체 회원</div>
        </div>
        <div class="people-grid" id="activeUserContainer">
          <!-- AJAX 로드 -->
        </div>
        <div class="people-more-wrap">
          <button type="button" id="btnLoadMore" class="people-more-btn">더보기</button>
        </div>
      </section>

    </div>
  </section>
</div>

<script>
  const ctx = '${pageContext.request.contextPath}';
  let currentPage = 1;

  const chartColors = ['#14bf49', '#4768df', '#9a63e0', '#c7ccdf'];

  async function loadActiveUsers() {
    try {
      const response = await fetch(ctx + '/qna/people/list?page=' + currentPage);
      const data = await response.json();

      const container = document.getElementById('activeUserContainer');
      const btn = document.getElementById('btnLoadMore');

      if (data.list && data.list.length > 0) {
        data.list.forEach(function(u) {
          const item = document.createElement('a');
          item.className = 'top-user';
          item.href = u.userId;

          item.innerHTML =
              '<div class="top-user__avatar">' +
                '<img src="' + u.img + '" alt="profile">' +
              '</div>' +
              '<div class="top-user__name">' + escapeHtml(u.name) + '</div>' +
              '<div class="top-user__meta">' +
                '<span class="pill">' + escapeHtml(u.badge) + '</span>' +
              '</div>' +
              '<div class="top-user__point">' +
                '채택 <b>' + Number(u.point).toLocaleString() + '</b>' +
              '</div>';

          container.appendChild(item);
        });
      }

      if (!data.hasNext) {
        btn.style.display = 'none';
      }

      currentPage++;
    } catch (e) {
      console.error('유저 로드 실패:', e);
    }
  }

  async function loadInterestStats(ageGroup) {
    try {
      const response = await fetch(ctx + '/qna/people/stats?ageGroup=' + encodeURIComponent(ageGroup));
      const data = await response.json();
      renderInterestStats(data);
      setActiveAgeTab(ageGroup);
    } catch (e) {
      console.error('관심사 통계 로드 실패:', e);
      renderInterestEmpty('관심사 통계를 불러오지 못했습니다.');
    }
  }

  function renderInterestStats(data) {
    const headlineEl = document.getElementById('interestHeadline');
    const ageLabelEl = document.getElementById('interestAgeLabel');
    const legendEl = document.getElementById('interestLegend');
    const donutEl = document.getElementById('interestDonut');

    headlineEl.innerHTML = '';
    legendEl.innerHTML = '';

    if (!data || data.empty || !data.list || data.list.length === 0) {
      renderInterestEmpty('해당 연령대의 해시태그 데이터가 아직 부족합니다.');
      return;
    }

    ageLabelEl.textContent = data.ageLabel;
    headlineEl.appendChild(makeHeadlineNode(data.ageLabel, data.list[0].tagName));

    const gradients = [];
    let start = 0;

    data.list.forEach(function(item, idx) {
      const color = chartColors[idx % chartColors.length];
      const end = start + item.percent;
      gradients.push(color + ' ' + start + '% ' + end + '%');
      start = end;

      const row = document.createElement('div');
      row.className = 'interest-legend__item';
      row.innerHTML =
          '<span class="interest-legend__dot" style="background:' + color + ';"></span>' +
          '<span class="interest-legend__name">' + escapeHtml(item.tagName) + '</span>' +
          '<span class="interest-legend__percent">' + item.percent + '%</span>';
      legendEl.appendChild(row);
    });

    if (start < 100) {
      gradients.push('#dfe7df ' + start + '% 100%');
    }

    donutEl.style.background = 'conic-gradient(' + gradients.join(', ') + ')';
  }

  function renderInterestEmpty(message) {
    const headlineEl = document.getElementById('interestHeadline');
    const ageLabelEl = document.getElementById('interestAgeLabel');
    const legendEl = document.getElementById('interestLegend');
    const donutEl = document.getElementById('interestDonut');

    ageLabelEl.textContent = '-';
    headlineEl.textContent = message;
    legendEl.innerHTML = '<div class="interest-empty">' + escapeHtml(message) + '</div>';
    donutEl.style.background = 'conic-gradient(#dfe7df 0 100%)';
  }

  function makeHeadlineNode(ageLabel, topTag) {
    const wrapper = document.createElement('span');
    wrapper.innerHTML =
        '<span class="point">' + escapeHtml(ageLabel) + '</span>' +
        '의 관심 해시태그 1위는<br>' +
        '<span class="point">' + escapeHtml(topTag) + '</span>' +
        ' 입니다.';
    return wrapper;
  }

  function setActiveAgeTab(ageGroup) {
    document.querySelectorAll('.interest-age-tab').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.age === ageGroup);
    });
  }

  function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  document.getElementById('btnLoadMore').addEventListener('click', loadActiveUsers);

  document.addEventListener('DOMContentLoaded', function() {
    loadActiveUsers();
    loadInterestStats('30');

    document.getElementById('interestAgeTabs').addEventListener('click', function(e) {
      const btn = e.target.closest('.interest-age-tab');
      if (!btn) return;
      loadInterestStats(btn.dataset.age);
    });

    document.addEventListener('click', function(e) {
      const topUser = e.target.closest('.top-user');
      if (topUser) {
        e.preventDefault();
        const userId = topUser.getAttribute('href');
        if (userId) {
          GlobalProfileModal.open(userId);
        }
      }
    });
  });
</script>

<jsp:include page="/WEB-INF/views/layout/footer.jsp" />