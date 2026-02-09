<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<jsp:include page="/WEB-INF/views/layout/header.jsp" />

<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/store/StoreMain.css" />

<div class="page-shell">
  <div class="content-wrap">
    <div class="content-card store-main">

      <!-- 배너(광고/홍보/이벤트) -->
      <c:if test="${not empty bannerImageUrl}">
        <div class="store-banner">
          <a href="${empty bannerLink ? '#' : bannerLink}" class="store-banner__link">
            <img src="${bannerImageUrl}" alt="스토어 배너" class="store-banner__img" />
          </a>
        </div>
      </c:if>
      <c:if test="${empty bannerImageUrl}">
        <div class="store-banner store-banner--dummy">
          <div class="store-banner__dummy-text">광고 / 홍보 / 이벤트 이미지</div>
        </div>
      </c:if>

      <!-- 검색바 -->
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
        </form>
      </div>

      <!-- 우측 플로팅(찜/장바구니) -->
      <div class="store-floating">
        <a class="store-floating__btn store-floating__btn--wish"
           href="${pageContext.request.contextPath}/store/wish"
           title="찜목록">찜목록</a>
        <a class="store-floating__btn store-floating__btn--cart"
           href="${pageContext.request.contextPath}/store/cart"
           title="장바구니">장바구니</a>
      </div>

      <!-- 오늘의 Hot 추천(가로 리스트) -->
      <c:if test="${not empty hotProducts}">
        <div class="store-section">
          <div class="store-section__head">
            <div class="store-section__title">오늘의 Hot 추천</div>
            <div class="store-section__desc">리뷰가 많은 인기 상품을 추천해드려요</div>
          </div>

          <div class="hot-row" id="hotRow">
            <c:forEach var="p" items="${hotProducts}">
              <div class="product-card product-card--sm js-card"
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

                <div class="product-card__name">
                  <c:out value="${p.product_name}" />
                </div>

                <div class="product-card__meta">
                  <div class="product-card__price">
                    <fmt:formatNumber value="${p.product_price}" pattern="#,###" />원
                  </div>
                  <div class="product-card__rating">
                    <span class="stars">★</span>
                    <span class="rate">
                      <fmt:formatNumber value="${p.product_rate}" pattern="0.0" />
                    </span>
                    <span class="count">(<c:out value="${p.review_count}" />)</span>
                  </div>
                </div>
              </div>
            </c:forEach>
          </div>
        </div>
      </c:if>

      <!-- 세일 Now (그리드 4*2) -->
      <c:if test="${not empty saleProducts}">
        <div class="store-section">
          <div class="store-section__head store-section__head--line">
            <div class="store-section__title">세일 Now</div>
            <div class="store-section__desc">할인 중인 상품을 모아봤어요</div>
          </div>

          <div class="grid-4x2">
            <c:forEach var="p" items="${saleProducts}">
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
                  <div class="product-card__name">
                    <c:out value="${p.product_name}" />
                  </div>

                  <div class="product-card__prices">
                    <div class="product-card__price">
                      <fmt:formatNumber value="${p.product_price}" pattern="#,###" />원
                    </div>
                    <c:if test="${p.product_sale ne null and p.product_sale gt 0}">
                      <div class="product-card__sale">
                        <c:out value="${p.product_sale}" />% OFF
                      </div>
                    </c:if>
                  </div>

                  <div class="product-card__rating">
                    <span class="stars">★</span>
                    <span class="rate">
                      <fmt:formatNumber value="${p.product_rate}" pattern="0.0" />
                    </span>
                    <span class="count">(<c:out value="${p.review_count}" />)</span>
                  </div>
                </div>
              </div>
            </c:forEach>
          </div>

          <div class="store-more">
            <a class="store-more__btn" href="${pageContext.request.contextPath}/store/sale">더 보기</a>
          </div>
        </div>
      </c:if>

      <!-- 페이지네이션(목록형 페이지에서 사용할 때) -->
      <c:if test="${not empty paging}">
        <div class="store-paging">
          <c:if test="${paging.prev}">
            <a class="pg-btn" href="${pageContext.request.contextPath}/store?currentPage=${paging.beginPage - 1}">&lt;</a>
          </c:if>

          <c:forEach var="i" begin="${paging.beginPage}" end="${paging.endPage}">
            <c:choose>
              <c:when test="${i == paging.currentPage}">
                <span class="pg-num pg-num--active"><c:out value="${i}" /></span>
              </c:when>
              <c:otherwise>
                <a class="pg-num" href="${pageContext.request.contextPath}/store?currentPage=${i}"><c:out value="${i}" /></a>
              </c:otherwise>
            </c:choose>
          </c:forEach>

          <c:if test="${paging.next}">
            <a class="pg-btn" href="${pageContext.request.contextPath}/store?currentPage=${paging.endPage + 1}">&gt;</a>
          </c:if>
        </div>
      </c:if>

    </div>
  </div>
</div>

<script src="${pageContext.request.contextPath}/resources/js/store/StoreMain.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
