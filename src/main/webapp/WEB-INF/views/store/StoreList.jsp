<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<jsp:include page="/WEB-INF/views/layout/header.jsp" />
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/store/StoreList.css" />

<div class="page-shell">
  <div class="content-wrap">
    <div class="content-card store-list">

      <!-- 상단 검색바 -->
      <div class="store-search">
        <form id="storeSearchForm" action="${pageContext.request.contextPath}/store/search" method="get" class="store-search__form">
          <span class="store-search__icon" aria-hidden="true"></span>
          <input
            type="text"
            name="keyword"
            id="storeKeyword"
            class="store-search__input"
            value="${param.keyword}"
            placeholder="상품을 검색해보세요"
            autocomplete="off"
          />
          <!-- 카테고리 유지 필요 시 -->
          <c:if test="${not empty param.categoryId}">
            <input type="hidden" name="categoryId" value="${param.categoryId}" />
          </c:if>
          <c:if test="${not empty param.category_id}">
            <input type="hidden" name="categoryId" value="${param.category_id}" />
          </c:if>
        </form>
      </div>

      <!-- 우측 플로팅(찜/장바구니) -->
      <div class="store-floating">
        <a class="store-floating__btn store-floating__btn--wish"
           href="${pageContext.request.contextPath}/store/wishPage"
           title="찜목록">찜목록</a>
        <a class="store-floating__btn store-floating__btn--cart"
           href="${pageContext.request.contextPath}/store/cartPage"
           title="장바구니">장바구니</a>
      </div>

      <!-- 카테고리 바(이미지의 회색 바) -->
      <c:if test="${not empty categoryName}">
        <div class="category-bar">
          <div class="category-bar__left">
            <span class="category-bar__title"><c:out value="${categoryName}" /></span>
          </div>
          <div class="category-bar__right">
            <span class="category-bar__path">
              <c:out value="${empty parentCategoryName ? '상위 카테고리' : parentCategoryName}" />
              <span class="path-sep">&gt;</span>
              <c:out value="${categoryName}" />
            </span>
          </div>
        </div>
      </c:if>

      <!-- 상품 그리드 -->
      <c:if test="${not empty products}">
        <div class="grid-4x2">
          <c:forEach var="p" items="${products}">
            <div class="product-card js-card"
                 data-href="${pageContext.request.contextPath}/store/product/detail?product_id=${p.product_id}">
              <div class="product-card__thumb">
                <c:choose>
                  <c:when test="${not empty p.thumbnail}">
                    <img src="${pageContext.request.contextPath}/upload/${p.thumbnail}" alt="${p.product_name}" />
                  </c:when>
                  <c:otherwise>
                    <div class="thumb-dummy">상품 이미지</div>
                  </c:otherwise>
                </c:choose>
              </div>

              <div class="product-card__body">
                <div class="product-card__name"><c:out value="${p.product_name}" /></div>

                <div class="product-card__prices">
                  <div class="product-card__price">
                    <fmt:formatNumber value="${p.product_price}" pattern="#,###" />원
                  </div>
                  <c:if test="${p.product_sale ne null and p.product_sale gt 0}">
                    <div class="product-card__sale"><c:out value="${p.product_sale}" />% OFF</div>
                  </c:if>
                </div>

                <div class="product-card__rating">
                  <span class="stars">★</span>
                  <span class="rate"><fmt:formatNumber value="${p.product_rate}" pattern="0.0" /></span>
                  <span class="count">(<c:out value="${p.review_count}" />)</span>
                </div>
              </div>
            </div>
          </c:forEach>
        </div>

        <!-- 더 보기 (선택: 무한스크롤/추가로딩 형태가 필요할 때) -->
        <c:if test="${hasMore eq true}">
          <div class="store-more">
            <button type="button" class="store-more__btn" id="btnMore"
                    data-nextpage="${nextPage}">
              더 보기
            </button>
          </div>
        </c:if>
      </c:if>

      <!-- 목록이 비었을 때 -->
      <c:if test="${empty products}">
        <div class="empty-box">
          표시할 상품이 없습니다.
        </div>
      </c:if>

      <!-- 페이지네이션(이미지 하단) -->
      <c:if test="${not empty paging}">
        <div class="store-paging">
          <c:if test="${paging.prev}">
            <c:url var="prevUrl" value="/store/search">
              <c:if test="${not empty param.categoryId}"><c:param name="categoryId" value="${param.categoryId}" /></c:if>
              <c:if test="${not empty param.keyword}"><c:param name="keyword" value="${param.keyword}" /></c:if>
              <c:param name="currentPage" value="${paging.beginPage - 1}" />
            </c:url>
            <a class="pg-btn" href="${prevUrl}">&lt;</a>
          </c:if>

          <c:forEach var="i" begin="${paging.beginPage}" end="${paging.endPage}">
            <c:choose>
              <c:when test="${i == paging.currentPage}">
                <span class="pg-num pg-num--active"><c:out value="${i}" /></span>
              </c:when>
              <c:otherwise>
                <c:url var="pageUrl" value="/store/search">
                  <c:if test="${not empty param.categoryId}"><c:param name="categoryId" value="${param.categoryId}" /></c:if>
                  <c:if test="${not empty param.keyword}"><c:param name="keyword" value="${param.keyword}" /></c:if>
                  <c:param name="currentPage" value="${i}" />
                </c:url>
                <a class="pg-num" href="${pageUrl}">
                  <c:out value="${i}" />
                </a>
              </c:otherwise>
            </c:choose>
          </c:forEach>

          <c:if test="${paging.next}">
            <c:url var="nextUrl" value="/store/search">
              <c:if test="${not empty param.categoryId}"><c:param name="categoryId" value="${param.categoryId}" /></c:if>
              <c:if test="${not empty param.keyword}"><c:param name="keyword" value="${param.keyword}" /></c:if>
              <c:param name="currentPage" value="${paging.endPage + 1}" />
            </c:url>
            <a class="pg-btn" href="${nextUrl}">&gt;</a>
          </c:if>
        </div>
      </c:if>

    </div>
  </div>
</div>

<script src="${pageContext.request.contextPath}/resources/js/store/StoreList.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
