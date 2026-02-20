<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/qna/QnaList.css">
<jsp:include page="/WEB-INF/views/layout/header.jsp" />

<div class="page-shell">
  <section class="content-wrap">
    <div class="content-card qna-card">

      <div class="qna-top">
        <!-- 1줄: Q&A / 질문하기 -->
        <div class="qna-top__row1">
          <div class="qna-title">Q&amp;A</div>
          <div class="qna-top__right">
            <a class="qna-btn qna-btn--solid" href="<c:url value='/qna/ask'/>">질문하기</a>
          </div>
        </div>

        <!-- 2줄: 질문들||사람들 -->
        <div class="qna-top__row2">
          <ul class="qna-tabs" id="qnaTabs">
            <li class="qna-tab"><a href="<c:url value='/qna/QnaList'/>">질문들</a></li>
            <li class="qna-tab sep">||</li>
            <li class="qna-tab"><a href="<c:url value='/qna/people'/>">사람들</a></li>
          </ul>
        </div>

        <div class="qna-tabline"></div>
      </div>

      <!-- 분야(해시태그 Top15) -->
      <section class="qna-section qna-section--category">
        <div class="qna-cat__header">
          <div class="qna-cat__title">분야</div>
          <div class="qna-cat__today">
            <span>오늘의 새 질문 <strong>10,025</strong></span>
            <span class="dot">|</span>
            <span>오늘의 답변 <strong>29,905</strong></span>
          </div>
        </div>

        <div class="qna-cat__grid" id="qnaCategoryGrid">
          <c:set var="selectedTag" value="${param.category}" />
          <c:forEach var="t" items="${tagTop15}" varStatus="st">
            <c:if test="${st.index % 5 == 0}"><div class="qna-cat__col"></c:if>

            <a class="qna-cat__item <c:if test='${selectedTag eq t.tagName}'>is-active</c:if>"
               href="#"
               data-category="${t.tagName}">
              <span class="name"><c:out value="${t.tagName}"/></span>
              <span class="count"><fmt:formatNumber value="${t.tagCount}"/></span>
            </a>

            <c:if test="${st.index % 5 == 4 || st.last}"></div></c:if>
          </c:forEach>
        </div>
      </section>

      <!-- 질문 리스트 -->
      <section class="qna-section qna-section--list">
        <!-- ✅ (요청 1,2,3) 리스트 제목 라인: 리스트 박스 안 + 보기 버튼 이동 + 제목 크기=분야 크기 -->
        <div class="qna-listHead">
          <div class="qna-listTitle">
            <span class="qna-listTitle__value" id="qnaListTitleValue">전체보기</span>
          </div>

          <div class="qna-viewBtns" id="qnaViewBtns" aria-label="보기 방식">
            <button type="button" class="viewBtn active" data-view="list">리스트</button>
            <button type="button" class="viewBtn" data-view="album">앨범</button>
            <button type="button" class="viewBtn" data-view="card">카드</button>
          </div>
        </div>

        <div class="qna-table view-list" id="qnaTable">
          <!-- ✅ (요청 4) 정렬: 좋아요/답변/작성 -->
          <div class="qna-row qna-row--head" id="qnaHeadRow">
            <div class="cell">제목</div>
            <div class="cell">분야</div>

            <div class="cell">
              <button type="button" class="sort-btn" data-key="like" aria-label="좋아요 정렬">좋아요</button>
            </div>
            <div class="cell">
              <button type="button" class="sort-btn" data-key="answer" aria-label="답변 정렬">답변</button>
            </div>
            <div class="cell">
              <button type="button" class="sort-btn" data-key="created" aria-label="작성일 정렬">작성</button>
            </div>
          </div>

          <c:forEach var="q" items="${qnaList}">
            <a class="qna-row qna-row--body"
               data-tag="${q.tagName}"
               data-like="${q.likeCount}"
               data-answer="${q.answerCount}"
               data-created="${q.createdEpoch}"
               href="<c:url value='/qna/detail'><c:param name='qna_id' value='${q.qna_id}'/></c:url>">

              <div class="cell cell-title">
                <span class="title-text"><c:out value="${q.title}"/></span>
                <span class="preview-text"><c:out value="${q.preview}"/></span>
                <span class="meta-line">
                  <span class="meta-tag">#<c:out value="${q.tagName}"/></span>
                  <span class="meta-like">좋아요 <c:out value="${q.likeCount}"/></span>
                  <span class="meta-ans">답변 <c:out value="${q.answerCount}"/></span>
                  <span class="meta-date"><c:out value="${q.createdAtLabel}"/></span>
                </span>
              </div>

              <div class="cell cell-cat"><c:out value="${q.tagName}"/></div>
              <div class="cell cell-like"><c:out value="${q.likeCount}"/></div>
              <div class="cell cell-ans"><c:out value="${q.answerCount}"/></div>
              <div class="cell cell-date"><c:out value="${q.createdAtLabel}"/></div>
            </a>
          </c:forEach>
        </div>
      </section>

      <!-- 하단 -->
      <div class="qna-bottom">
        <c:set var="curPage" value="${pageInfo.page}" />
        <c:set var="totalPages" value="${pageInfo.totalPages}" />

        <div class="qna-pagination" id="qnaPagination"
             data-page="${curPage}" data-total="${totalPages}">
          <button type="button" class="pbtn pbtn--nav" data-move="prev">&lt;</button>
          <c:forEach var="p" begin="1" end="${totalPages}">
            <button type="button" class="pbtn <c:if test='${p eq curPage}'>active</c:if>" data-page="${p}">
              ${p}
            </button>
          </c:forEach>
          <button type="button" class="pbtn pbtn--nav" data-move="next">&gt;</button>
        </div>

        <form class="qna-search" id="qnaSearchForm" method="get" action="<c:url value='/qna/QnaList'/>">
          <span class="qna-search__icon" aria-hidden="true"></span>
          <c:if test="${not empty param.category}">
            <input type="hidden" name="category" value="${param.category}">
          </c:if>
          <input class="qna-search__input" type="text" name="q"
                 placeholder="검색어를 입력하세요"
                 value="<c:out value='${param.q}'/>" />
        </form>
      </div>

    </div>
  </section>
</div>

<script src="${pageContext.request.contextPath}/resources/js/qna/QnaList.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />