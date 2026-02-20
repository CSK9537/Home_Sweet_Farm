<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/qna/QnaMain.css">
<jsp:include page="/WEB-INF/views/layout/header.jsp" />

<div class="page-shell">
  <section class="content-wrap">
    <div class="content-card qna-card">

      <!-- 상단 -->
      <div class="qna-topwrap">
        <!-- 1줄: Q&A / 버튼 -->
        <div class="qna-toprow">
          <div class="qna-toprow__left">
            <div class="qna-logo">Q&amp;A</div>
          </div>

          <div class="qna-toprow__right">
            <a class="btn btn--primary" href="<c:url value='/community/CommunityForm'/>">질문하기</a>
          </div>
        </div>

        <!-- 2줄: 메뉴(질문들 || 사람들) -->
        <div class="qna-menuline" id="qnaTopMenu">
          <a class="qna-menu" href="<c:url value='/qna/QnaList'/>" data-tab="questions">질문들</a>
          <span class="qna-divider">||</span>
          <a class="qna-menu" href="<c:url value='/qna/people'/>" data-tab="people">사람들</a>
        </div>

        <!-- 굵은 라인 -->
        <div class="qna-topline"></div>
      </div>

      <!-- 1) 채택왕 -->
      <section class="qna-section">
        <div class="qna-section__head">
          <div>
            <div class="qna-section__title">채택왕</div>
          </div>
          <a class="qna-section__link" href="<c:url value='/qna/people'/>">더보기</a>
        </div>

        <div class="top-users">
          <c:forEach var="u" items="${topUsers}">
            <a class="top-user"
               href="<c:url value='/mypage/profile'>
                        <c:param name='userId' value='${u.userId}'/>
                     </c:url>">
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

      <!-- 2) 많이 물어보는 QnA (TOP100 페이징) -->
      <section class="qna-section">
        <div class="qna-section__head">
          <div>
            <div class="qna-section__title">많이 물어보는 Q&amp;A</div>
          </div>
        </div>

        <div class="faq-grid">
          <c:forEach var="f" items="${faqTopList}">
            <a class="faq-item" href="<c:url value='/qna/detail'><c:param name='qnaId' value='${f.id}'/></c:url>">
              <div class="faq-item__num">${f.rank}</div>
              <div class="faq-item__body">
                <div class="faq-item__title">${f.title}</div>
                <div class="faq-item__preview">${f.preview}</div>
                <div class="faq-item__meta">
                  <span>조회 ${f.views}</span>
                  <span class="dot">•</span>
                  <span>답변 ${f.answers}</span>
                </div>
              </div>
            </a>
          </c:forEach>
        </div>

        <c:set var="fp" value="${faqPaging}" />
        <div class="paging paging--compact" id="faqPaging"
             data-target="faq"
             data-page="${fp.page}" data-start="${fp.startPage}" data-end="${fp.endPage}" data-total="${fp.totalPage}">
          <a class="pg-btn" href="#" data-move="first">«</a>
          <a class="pg-btn" href="#" data-move="prev">‹</a>

          <c:forEach var="i" begin="${fp.startPage}" end="${fp.endPage}">
            <a class="pg-num ${i == fp.page ? 'active' : ''}" href="#" data-page="${i}">${i}</a>
          </c:forEach>

          <a class="pg-btn" href="#" data-move="next">›</a>
          <a class="pg-btn" href="#" data-move="last">»</a>
        </div>
      </section>

      <!-- 3) 답변을 기다리는 질문 -->
      <section class="qna-section">
        <div class="qna-section__head">
          <div class="qna-section__title">답변을 기다리는 질문</div>
          <div class="qna-filter">
            <select id="waitingSort" class="select">
              <option value="recent">최신순</option>
              <option value="view">오래된순</option>
            </select>
          </div>
        </div>

        <div class="waiting-list">
          <div class="waiting-list__head">
            <div class="col col-title">제목</div>
            <div class="col col-cat">분류</div>
            <div class="col col-author">작성자</div>
            <div class="col col-time">좋아요</div>
            <div class="col col-ans">답변</div>
          </div>

          <c:forEach var="q" items="${waitingList}">
            <a class="waiting-row" href="<c:url value='/qna/detail'><c:param name='qnaId' value='${q.id}'/></c:url>">
              <div class="col col-title">
                <span class="title-text">${q.title}</span>
                <c:if test="${q.isNew}">
                  <span class="badge badge--new">N</span>
                </c:if>
              </div>
              <div class="col col-cat"><span class="pill pill--soft">${q.category}</span></div>
              <div class="col col-author">${q.author}</div>
              <div class="col col-time">${q.ago}</div>
              <div class="col col-ans">${q.answerCnt}</div>
            </a>
          </c:forEach>
        </div>

        <c:set var="wp" value="${waitingPaging}" />
        <div class="paging" id="waitingPaging"
             data-target="waiting"
             data-page="${wp.page}" data-start="${wp.startPage}" data-end="${wp.endPage}" data-total="${wp.totalPage}">
          <a class="pg-btn" href="#" data-move="first">«</a>
          <a class="pg-btn" href="#" data-move="prev">‹</a>

          <c:forEach var="i" begin="${wp.startPage}" end="${wp.endPage}">
            <a class="pg-num ${i == wp.page ? 'active' : ''}" href="#" data-page="${i}">${i}</a>
          </c:forEach>

          <a class="pg-btn" href="#" data-move="next">›</a>
          <a class="pg-btn" href="#" data-move="last">»</a>
        </div>
      </section>

    </div>
  </section>
</div>

<script src="${pageContext.request.contextPath}/resources/js/qna/QnaMain.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
