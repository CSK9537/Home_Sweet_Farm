<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/community/CommunityList.css" />
<jsp:include page="/WEB-INF/views/layout/header.jsp" />

<%-- =========================================================
     게시판 타입 결정
     - 파라미터 type이 없으면 FREE로 처리
     - FREE: 자유게시판 / MARKET: 벼룩시장
   ========================================================= --%>
<c:set var="boardType" value="${empty param.type ? 'FREE' : param.type}" />

<div class="page-shell">
  <div class="content-wrap">
    <div class="content-card community">

      <!-- 상단 타이틀/탭/버튼 -->
      <div class="community__header">
        <div class="community__titleRow">
          <h2 class="community__title">
            <c:choose>
              <c:when test="${boardType eq 'MARKET'}">벼룩시장</c:when>
              <c:otherwise>자유게시판</c:otherwise>
            </c:choose>
          </h2>

          <%-- 글쓰기: 현재 타입 유지 --%>
          <a class="community__writeBtn"
             href="${pageContext.request.contextPath}/community/write?type=${boardType}">
            	글쓰기
          </a>
        </div>

        <div class="community__subRow">
          <div class="community__tabs" role="tablist" aria-label="게시판 탭">
            <a class="community__tab ${boardType ne 'MARKET' ? 'is-active' : ''}"
               href="${pageContext.request.contextPath}/community/list?type=FREE"
               role="tab"
               aria-selected="${boardType ne 'MARKET'}">자유게시판</a>
            <span class="community__tabSep">|</span>
            <a class="community__tab ${boardType eq 'MARKET' ? 'is-active' : ''}"
               href="${pageContext.request.contextPath}/community/list?type=MARKET"
               role="tab"
               aria-selected="${boardType eq 'MARKET'}">벼룩시장</a>
          </div>

          <div class="community__viewBtns" aria-label="보기 방식">
            <button type="button" class="viewBtn is-active" data-view="card">카드</button>
            <button type="button" class="viewBtn" data-view="album">앨범</button>
            <button type="button" class="viewBtn" data-view="list">리스트</button>
          </div>
        </div>

        <div class="community__divider"></div>
      </div>

      <!-- 목록 래퍼 (뷰 모드 클래스가 여기에 붙음) -->
      <div id="communityList" class="community__list view-card">

        <c:forEach var="p" items="${posts}">
          <%-- 상세보기: 현재 타입 유지 --%>
          <a class="postItem"
             href="${pageContext.request.contextPath}/community/detail?id=${p.id}&type=${boardType}">

            <div class="postItem__imgWrap">

              <%-- 썸네일: 없으면 기본 이미지 --%>
              <c:choose>
                <c:when test="${empty p.img}">
                  <img class="postItem__img"
                       src="${pageContext.request.contextPath}/resources/image/Default_Plant.jpg"
                       alt="기본 썸네일" />
                </c:when>
                <c:otherwise>
                  <img class="postItem__img" src="${p.img}" alt="게시글 썸네일" />
                </c:otherwise>
              </c:choose>

              <%-- (MARKET일 때만) 거래 상태 배지: 판매/나눔/완료 --%>
              <c:if test="${boardType eq 'MARKET'}">
                <c:choose>
                  <c:when test="${p.status eq 'sell'}">
                    <span class="marketBadge marketBadge--sell">판매</span>
                  </c:when>
                  <c:when test="${p.status eq 'share'}">
                    <span class="marketBadge marketBadge--share">나눔</span>
                  </c:when>
                  <c:otherwise>
                    <span class="marketBadge marketBadge--done">완료</span>
                  </c:otherwise>
                </c:choose>
              </c:if>

              <!-- 앨범형 오버레이 텍스트 -->
              <div class="postItem__overlay">
                <div class="postItem__overlayTitle">${p.title}</div>

                <%-- (MARKET일 때만) 오버레이 가격 --%>
                <c:if test="${boardType eq 'MARKET'}">
                  <div class="marketPrice marketPrice--overlay">
                    <c:choose>
                      <c:when test="${p.status eq 'share' || p.price == 0}">
                        	나눔
                      </c:when>
                      <c:when test="${empty p.price}">
                        <%-- 판매글인데 price가 비어있을 수 있는 상황 방어 --%>
                        	가격정보없음
                      </c:when>
                      <c:otherwise>
                        <fmt:formatNumber value="${p.price}" pattern="#,###"/>원
                      </c:otherwise>
                    </c:choose>
                  </div>
                </c:if>

                <div class="postItem__overlayMeta">
                  <span>${p.writer}</span>
                  <span class="sep">|</span>
                  <span>${p.date}</span>
                </div>

                <div class="postItem__overlayStats">
                  <span>조회수 ${p.views}</span><span class="sep">|</span>
                  <span>좋아요 ${p.likes}</span><span class="sep">|</span>
                  <span>댓글 ${p.comments}</span>
                </div>
              </div>
            </div>

            <div class="postItem__body">
              <div class="postItem__title">${p.title}</div>

              <%-- (MARKET일 때만) 본문 가격 --%>
              <c:if test="${boardType eq 'MARKET'}">
                <div class="marketPrice marketPrice--body">
                  <c:choose>
                    <c:when test="${p.status eq 'share' || p.price == 0}">
                      	나눔
                    </c:when>
                    <c:when test="${empty p.price}">
                      	가격정보없음
                    </c:when>
                    <c:otherwise>
                      <fmt:formatNumber value="${p.price}" pattern="#,###"/>원
                    </c:otherwise>
                  </c:choose>
                </div>
              </c:if>

              <div class="postItem__writer">${p.writer}</div>

              <div class="postItem__meta">
                <span class="label">등록날짜</span>
                <span class="value">${p.date}</span>
                <span class="sep">|</span>
                <span class="value">조회수 ${p.views}</span>
                <span class="sep">|</span>
                <span class="value">좋아요 ${p.likes}</span>
                <span class="sep">|</span>
                <span class="value">댓글 ${p.comments}</span>
              </div>

              <div class="postItem__content">${p.content}</div>
            </div>

          </a>
        </c:forEach>

      </div>

      <!-- 하단: 페이지네이션 + 검색 -->
      <div class="community__bottom">
        <div class="pagination">
          <button type="button" class="pageBtn">&lsaquo;</button>
          <button type="button" class="pageNum is-active">1</button>
          <button type="button" class="pageNum">2</button>
          <button type="button" class="pageNum">3</button>
          <button type="button" class="pageNum">4</button>
          <button type="button" class="pageNum">5</button>
          <button type="button" class="pageBtn">&rsaquo;</button>
        </div>

        <form class="searchBar" action="${pageContext.request.contextPath}/community/list" method="get">
          <%-- 검색 시에도 현재 타입 유지 --%>
          <input type="hidden" name="type" value="${boardType}" />
          <input type="text" name="q" class="searchInput" placeholder="검색어를 입력하세요" />
          <button type="submit" class="searchBtn">검색</button>
        </form>
      </div>

    </div>
  </div>
</div>

<script src="${pageContext.request.contextPath}/resources/js/community/CommunityList.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
