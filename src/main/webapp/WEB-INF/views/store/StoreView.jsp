<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<jsp:include page="/WEB-INF/views/layout/header.jsp" />
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/store/StoreView.css" />

<div class="page-shell">
  <div class="content-wrap">
    <div class="content-card store-detail">

      <!-- 우측 플로팅(찜/장바구니) -->
      <div class="store-floating">
        <a class="store-floating__btn store-floating__btn--wish"
           href="${pageContext.request.contextPath}/store/wish"
           title="찜목록">찜목록</a>
        <a class="store-floating__btn store-floating__btn--cart"
           href="${pageContext.request.contextPath}/store/cart"
           title="장바구니">장바구니</a>
      </div>

      <!-- 상단 영역: 좌(갤러리/리뷰) + 우(상품 정보 카드) -->
      <div class="detail-top">

        <!-- LEFT -->
        <div class="detail-left">

          <div class="gallery">
            <button type="button" class="gallery__nav gallery__nav--prev" id="btnPrev" aria-label="이전 이미지">&lt;</button>

            <div class="gallery__stage" id="galleryStage">
              <img id="mainImage" class="gallery__main"
                   src="<c:out value='${empty product.saved_name ? "" : pageContext.request.contextPath.concat("/upload/").concat(product.saved_name)}'/>"
                   alt="<c:out value='${product.product_name}'/>" />
              <c:if test="${empty product.saved_name}">
                <div class="gallery__dummy" id="mainDummy">상품 이미지</div>
              </c:if>
            </div>

            <button type="button" class="gallery__nav gallery__nav--next" id="btnNext" aria-label="다음 이미지">&gt;</button>

            <!-- 썸네일 -->
            <div class="thumbs" id="thumbs">
              <c:choose>
                <c:when test="${not empty product.image_list}">
                  <c:forEach var="img" items="${product.image_list}" varStatus="st">
                    <button type="button"
                            class="thumb <c:out value='${st.index==0 ? "thumb--active" : ""}'/>"
                            data-src="${pageContext.request.contextPath}/upload/${img}">
                      <img src="${pageContext.request.contextPath}/upload/${img}" alt="썸네일 ${st.index+1}" />
                    </button>
                  </c:forEach>
                </c:when>
                <c:otherwise>
                  <button type="button" class="thumb thumb--active" data-src="">
                    <span class="thumb__dummy">이미지 1</span>
                  </button>
                  <button type="button" class="thumb" data-src=""><span class="thumb__dummy">이미지 2</span></button>
                  <button type="button" class="thumb" data-src=""><span class="thumb__dummy">이미지 3</span></button>
                  <button type="button" class="thumb" data-src=""><span class="thumb__dummy">이미지 4</span></button>
                  <button type="button" class="thumb" data-src=""><span class="thumb__dummy">이미지 5</span></button>
                  <button type="button" class="thumb" data-src=""><span class="thumb__dummy">이미지 6</span></button>
                </c:otherwise>
              </c:choose>
            </div>

            <!-- 하단 바(제품 설명 버튼 라인) -->
            <div class="gallery__bar">
              <div class="gallery__bar-title">제품 설명</div>
              <button type="button" class="gallery__bar-btn" id="btnOpenDesc">▶</button>
            </div>

            <!-- 리뷰 영역(간단) -->
            <div class="review-box">
              <div class="review-box__title">고객 리뷰</div>

              <div class="review-box__panel">
                <div class="review-box__left">
                  <div class="review-tabs">
                    <div class="review-tab review-tab--active">댓글</div>
                  </div>

                  <div class="review-content">
                    <c:choose>
                      <c:when test="${not empty topReview}">
                        <div class="review-item">
                          <div class="review-item__head">
                            <span class="review-item__nick"><c:out value="${topReview.nickname}" /></span>
                            <span class="review-item__rate">★ <fmt:formatNumber value="${topReview.review_rate}" pattern="0.0"/></span>
                          </div>
                          <div class="review-item__body"><c:out value="${topReview.review_content}" /></div>
                        </div>
                      </c:when>
                      <c:otherwise>
                        <div class="review-empty">등록된 리뷰가 없습니다.</div>
                      </c:otherwise>
                    </c:choose>
                  </div>
                </div>

                <div class="review-box__right">
                  <div class="review-stat">
                    <div class="review-stat__label">평균 평점</div>
                    <div class="review-stat__value">★ <fmt:formatNumber value="${empty product.product_rate ? 0 : product.product_rate}" pattern="0.0"/></div>
                  </div>
                  <div class="review-stat">
                    <div class="review-stat__label">전체 리뷰</div>
                    <div class="review-stat__value"><c:out value="${empty product.review_count ? 0 : product.review_count}" /></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- RIGHT -->
        <div class="detail-right">
          <div class="info-card">
            <div class="info-card__name"><c:out value="${product.product_name}" /></div>

            <div class="info-card__price">
              <fmt:formatNumber value="${product.product_price}" pattern="#,###" />원
            </div>

            <div class="info-card__rating">
              <span class="stars">★</span>
              <span class="rate"><fmt:formatNumber value="${empty product.product_rate ? 0 : product.product_rate}" pattern="0.0"/></span>
              <span class="count">(<c:out value="${empty product.review_count ? 0 : product.review_count}" />)</span>
            </div>

            <c:if test="${not empty product.product_description_brief}">
              <div class="info-card__brief">
                <c:out value="${product.product_description_brief}" />
              </div>
            </c:if>

            <div class="info-card__actions">
              <form action="${pageContext.request.contextPath}/store/cart/add" method="post" class="action-row">
                <input type="hidden" name="product_id" value="${product.product_id}" />
                <button type="submit" class="btn btn--solid">장바구니</button>
              </form>

              <form action="${pageContext.request.contextPath}/store/wish/add" method="post" class="action-row">
                <input type="hidden" name="product_id" value="${product.product_id}" />
                <button type="submit" class="btn btn--ghost">찜하기</button>
              </form>
            </div>

          </div>
        </div>

      </div>

      <!-- 관련 제품 -->
      <c:if test="${not empty relatedProducts}">
        <div class="sub-section">
          <div class="sub-section__left">관련 제품</div>
          <div class="sub-section__right">관련 제품으로는 이런게 있어요</div>
        </div>

        <div class="h-row">
          <c:forEach var="p" items="${relatedProducts}">
            <div class="product-mini js-card"
                 data-href="${pageContext.request.contextPath}/store/product/detail?product_id=${p.product_id}">
              <div class="product-mini__thumb">
                <c:choose>
                  <c:when test="${not empty p.saved_name}">
                    <img src="${pageContext.request.contextPath}/upload/${p.saved_name}" alt="${p.product_name}" />
                  </c:when>
                  <c:when test="${not empty p.thumbnail}">
                    <img src="${pageContext.request.contextPath}/upload/${p.thumbnail}" alt="${p.product_name}" />
                  </c:when>
                  <c:otherwise>
                    <div class="mini-dummy">상품 이미지</div>
                  </c:otherwise>
                </c:choose>
              </div>
              <div class="product-mini__name"><c:out value="${p.product_name}" /></div>
              <div class="product-mini__meta">
                <span class="stars">★</span>
                <span class="rate"><fmt:formatNumber value="${empty p.product_rate ? 0 : p.product_rate}" pattern="0.0"/></span>
                <span class="count">(<c:out value="${empty p.review_count ? 0 : p.review_count}" />)</span>
              </div>
            </div>
          </c:forEach>
        </div>
      </c:if>

      <!-- 추천 제품 -->
      <c:if test="${not empty recommendProducts}">
        <div class="sub-section">
          <div class="sub-section__left">추천 제품</div>
          <div class="sub-section__right">이런 제품들을 추천드려요</div>
        </div>

        <div class="h-row">
          <c:forEach var="p" items="${recommendProducts}">
            <div class="product-mini js-card"
                 data-href="${pageContext.request.contextPath}/store/product/detail?product_id=${p.product_id}">
              <div class="product-mini__thumb">
                <c:choose>
                  <c:when test="${not empty p.saved_name}">
                    <img src="${pageContext.request.contextPath}/upload/${p.saved_name}" alt="${p.product_name}" />
                  </c:when>
                  <c:when test="${not empty p.thumbnail}">
                    <img src="${pageContext.request.contextPath}/upload/${p.thumbnail}" alt="${p.product_name}" />
                  </c:when>
                  <c:otherwise>
                    <div class="mini-dummy">상품 이미지</div>
                  </c:otherwise>
                </c:choose>
              </div>
              <div class="product-mini__name"><c:out value="${p.product_name}" /></div>
              <div class="product-mini__meta">
                <span class="stars">★</span>
                <span class="rate"><fmt:formatNumber value="${empty p.product_rate ? 0 : p.product_rate}" pattern="0.0"/></span>
                <span class="count">(<c:out value="${empty p.review_count ? 0 : p.review_count}" />)</span>
              </div>
            </div>
          </c:forEach>
        </div>
      </c:if>

      <!-- 제품설명 모달(요구사항) -->
      <div class="modal" id="descModal" aria-hidden="true">
        <div class="modal__dim" id="modalDim"></div>

        <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
          <div class="modal__header">
            <div class="modal__title" id="modalTitle"><c:out value="${product.product_name}" /></div>
            <button type="button" class="modal__close" id="btnCloseModal" aria-label="닫기">×</button>
          </div>

          <div class="modal__body">
            <div class="modal__block">
              <div class="modal__block-title">상품 상세 설명</div>
              <div class="modal__block-content">
                <c:choose>
                  <c:when test="${not empty product.product_description_detail}">
                    <c:out value="${product.product_description_detail}" escapeXml="false"/>
                  </c:when>
                  <c:otherwise>
                    	상세 설명이 없습니다.
                  </c:otherwise>
                </c:choose>
              </div>
            </div>

            <div class="modal__block">
              <div class="modal__block-title">주의사항</div>
              <div class="modal__block-content">
                <c:choose>
                  <c:when test="${not empty product.product_caution}">
                    <c:out value="${product.product_caution}" escapeXml="false"/>
                  </c:when>
                  <c:otherwise>
                    	주의사항이 없습니다.
                  </c:otherwise>
                </c:choose>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</div>

<script>
  // 리스트로 유지되는 경우 경로 보정용(선택)
  window.__CTX__ = "${pageContext.request.contextPath}";
</script>
<script src="${pageContext.request.contextPath}/resources/js/store/StoreView.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
