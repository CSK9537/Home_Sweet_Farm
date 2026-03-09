<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/community/CommunityList.css" />
<jsp:include page="/WEB-INF/views/layout/header.jsp" />

<c:set var="boardType" value="${empty type ? 'FREE' : type}" />

<div class="page-shell">
  <div class="content-wrap">
    <div class="content-card community">

      <div class="community__header">
        <div class="community__titleRow">
          <h2 class="community__title">
            <c:choose>
              <c:when test="${boardType eq 'MARKET'}">벼룩시장</c:when>
              <c:otherwise>자유게시판</c:otherwise>
            </c:choose>
          </h2>

          <a class="community__writeBtn"
             href="${pageContext.request.contextPath}/community/form?mode=insert&boardType=${writeBoardType}">
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

      <div id="communityList" class="community__list view-card">

        <c:choose>
          <c:when test="${not empty posts}">
            <c:forEach var="p" items="${posts}">
              <a class="postItem" href="${p.moveUrl}">

                <div class="postItem__imgWrap">
                  <c:choose>
                    <c:when test="${empty p.thumbSrc}">
                      <img class="postItem__img"
                           src="${pageContext.request.contextPath}/resources/image/Default_Plant.jpg"
                           alt="기본 썸네일" />
                    </c:when>
                    <c:otherwise>
                      <img class="postItem__img" src="${p.thumbSrc}" alt="게시글 썸네일" />
                    </c:otherwise>
                  </c:choose>

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

                  <div class="postItem__overlay">
                    <div class="postItem__overlayTitle">${p.title}</div>

                    <c:if test="${boardType eq 'MARKET'}">
                      <div class="marketPrice marketPrice--overlay">
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

                    <div class="postItem__overlayMeta">
                      <span>${p.writer}</span>
                      <span class="sep">|</span>
                      <span>${p.regDate}</span>
                    </div>

                    <div class="postItem__overlayStats">
                      <span>조회수 ${p.viewCount}</span><span class="sep">|</span>
                      <span>좋아요 ${p.likeCount}</span><span class="sep">|</span>
                      <span>댓글 ${p.replyCnt}</span>
                    </div>
                  </div>
                </div>

                <div class="postItem__body">
                  <div class="postItem__title">${p.title}</div>

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
                  <div class="postItem__date">${p.regDate}</div>

                  <div class="postItem__meta">
                    <span class="value">조회수 ${p.viewCount}</span>
                    <span class="sep">|</span>
                    <span class="value">좋아요 ${p.likeCount}</span>
                    <span class="sep">|</span>
                    <span class="value">댓글 ${p.replyCnt}</span>
                  </div>

                  <c:if test="${not empty p.hashtags}">
                    <div class="postItem__hashtags">
                      <c:forEach var="tag" items="${fn:split(p.hashtags, ',')}">
                        <c:if test="${not empty fn:trim(tag)}">
                          <span class="postItem__tag">#${fn:trim(tag)}</span>
                        </c:if>
                      </c:forEach>
                    </div>
                  </c:if>

                  <div class="postItem__content">${p.contentPreview}</div>
                </div>

              </a>
            </c:forEach>
          </c:when>
          <c:otherwise>
            <div class="postItem" style="justify-content:center;">검색 결과가 없습니다.</div>
          </c:otherwise>
        </c:choose>
      </div>

      <div class="community__bottom">
        <div class="pagination">
          <c:if test="${hasPrev}">
            <a class="pageBtn"
               href="${pageContext.request.contextPath}/community/list?type=${boardType}&q=${q}&page=${prevPage}&size=${size}">&lsaquo;</a>
          </c:if>

          <c:forEach var="i" begin="${startPage}" end="${endPage}">
            <a class="pageNum ${i eq page ? 'is-active' : ''}"
               href="${pageContext.request.contextPath}/community/list?type=${boardType}&q=${q}&page=${i}&size=${size}">
              ${i}
            </a>
          </c:forEach>

          <c:if test="${hasNext}">
            <a class="pageBtn"
               href="${pageContext.request.contextPath}/community/list?type=${boardType}&q=${q}&page=${nextPage}&size=${size}">&rsaquo;</a>
          </c:if>
        </div>

        <form class="searchBar" action="${pageContext.request.contextPath}/community/list" method="get">
          <input type="hidden" name="type" value="${boardType}" />
          <input type="text"
                 name="q"
                 class="searchInput"
                 placeholder="제목, 내용, 작성자, 해시태그 검색"
                 value="${q}" />
          <button type="submit" class="searchBtn">검색</button>
        </form>
      </div>

    </div>
  </div>
</div>

<script src="${pageContext.request.contextPath}/resources/js/community/CommunityList.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />