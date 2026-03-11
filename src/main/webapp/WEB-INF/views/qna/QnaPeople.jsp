<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<%-- QnaPeople.jsp: QnaList의 레이아웃 + QnaMain의 프로필 스타일 --%>
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/qna/QnaList.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/qna/QnaMain.css">
<style>
  .people-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr); /* 4줄(4컬럼) */
    gap: 20px;
    padding: 20px 0;
  }
  .qna-tabs .qna-tab.active a {
    color: #2ba61c; /* 초록색 */
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
  
  /* 반응형 (원할 경우 추가) */
  @media (max-width: 1024px) {
    .people-grid { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 768px) {
    .people-grid { grid-template-columns: repeat(2, 1fr); }
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

      <!-- 상단: 답변 활동이 활발한 사람들 (채택왕 포함 상위 20) -->
      <section class="qna-section">
        <div class="qna-section__head">
          <div class="qna-section__title">답변 활동이 활발한 사람들</div>
        </div>
        <div class="people-grid">
          <c:forEach var="u" items="${topUsers}">
            <a class="top-user"
               href="<c:url value='/user/profile/${u.userId}'/>">
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

      <!-- 하단: 전체 회원 (8명씩 더보기) -->
      <section class="qna-section" style="border-top: 1px solid #f0f0f0; margin-top: 40px; padding-top: 40px;">
        <div class="qna-section__head">
          <div class="qna-section__title">전체 회원</div>
        </div>
        <div class="people-grid" id="activeUserContainer">
          <!-- AJAX로 로드됨 -->
        </div>
        <div class="people-more-wrap">
          <button type="button" id="btnLoadMore" class="people-more-btn">더보기</button>
        </div>
      </section>

    </div>
  </section>
</div>

<script>
  let currentPage = 1;

  async function loadActiveUsers() {
    try {
      const response = await fetch(`${pageContext.request.contextPath}/qna/people/list?page=` + currentPage);
      const data = await response.json();
      
      const container = document.getElementById('activeUserContainer');
      const btn = document.getElementById('btnLoadMore');
      
      if (data.list && data.list.length > 0) {
        data.list.forEach(u => {
          const item = document.createElement('a');
          item.className = 'top-user';
          item.href = `${pageContext.request.contextPath}/user/profile/` + u.userId;
          
          item.innerHTML = `
            <div class="top-user__avatar">
              <img src="\${u.img}" alt="profile">
            </div>
            <div class="top-user__name">\${u.name}</div>
            <div class="top-user__meta">
              <span class="pill">\${u.badge}</span>
            </div>
            <div class="top-user__point">
              채택 <b>\${Number(u.point).toLocaleString()}</b>
            </div>
          `;
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

  document.getElementById('btnLoadMore').addEventListener('click', loadActiveUsers);

  // 초기 로드
  document.addEventListener('DOMContentLoaded', loadActiveUsers);
</script>

<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
