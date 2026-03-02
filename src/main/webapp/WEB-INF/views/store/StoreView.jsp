<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<%-- ===============================
     ✅ (뷰 확인용) 더미 데이터
     실제 컨트롤러에서 product/topReview/reviewList 내려주면 이 블록 제거
     =============================== --%>
<%
  if (request.getAttribute("product") == null) {
    java.util.Map<String, Object> product = new java.util.HashMap<String, Object>();
    product.put("product_id", 1);
    product.put("product_name", "몬스테라 화분 세트");
    product.put("product_price", 32900);
    product.put("product_rate", 4.4);
    product.put("review_count", 18);
    product.put("product_description_brief", "초보자도 키우기 쉬운 몬스테라 화분 세트입니다.");
    product.put("product_description_detail",
        "✔ 실내 공기 정화 효과\n✔ 관리가 쉬운 인기 식물\n✔ 인테리어 효과 탁월\n\n자연 식물이므로 모양과 크기는 조금씩 다를 수 있습니다.");
    product.put("product_caution",
        "※ 직사광선을 피해주세요.\n※ 과도한 물주기는 금물입니다.\n※ 배송 중 잎 손상이 발생할 수 있습니다.");

    java.util.List<String> imageList = new java.util.ArrayList<String>();
    for(int i=1; i<=6; i++){
      imageList.add("https://picsum.photos/seed/detail_"+i+"/900/500");
    }
    product.put("image_list", imageList);
    request.setAttribute("product", product);

    java.util.Map<String, Object> topReview = new java.util.HashMap<String, Object>();
    topReview.put("nickname", "그린러버");
    topReview.put("review_rate", 4.5);
    topReview.put("review_title", "가성비 좋은듯요");
    topReview.put("review_content", "생각보다 훨씬 싱싱하고 예뻐요! 인테리어 효과 최고입니다.");
    topReview.put("review_date", new java.util.Date());
    topReview.put("verified", true);
    request.setAttribute("topReview", topReview);

    java.util.List<java.util.Map<String,Object>> reviewList = new java.util.ArrayList<java.util.Map<String,Object>>();
    for(int i=1;i<=30;i++){
      java.util.Map<String,Object> r = new java.util.HashMap<String,Object>();
      r.put("nickname", "유저"+i);
      r.put("review_rate", (i%5)+1);
      r.put("review_title", (i%3==0 ? "손잡이 조립 넘 힘듦" : "가성비 좋아요"));
      r.put("review_content", "이 제품 정말 만족합니다. 배송도 빠르고 상태도 좋았어요. ("+i+")");
      r.put("review_date", new java.util.Date(System.currentTimeMillis() - (long)(i*86400000L))); // 날짜 분산
      r.put("verified", (i%2==0));
      r.put("helpful", (i%7));

      // 일부 리뷰만 이미지 포함
      if(i%4==0){
        java.util.List<String> imgs = new java.util.ArrayList<String>();
        imgs.add("https://picsum.photos/seed/rev_"+i+"_1/200/200");
        imgs.add("https://picsum.photos/seed/rev_"+i+"_2/200/200");
        r.put("images", imgs);
      }
      reviewList.add(r);
    }
    request.setAttribute("reviewList", reviewList);

    // 관련/추천 더미
    java.util.List<java.util.Map<String,Object>> relatedProducts = new java.util.ArrayList<java.util.Map<String,Object>>();
    for(int i=1;i<=8;i++){
      java.util.Map<String,Object> p = new java.util.HashMap<String,Object>();
      p.put("product_id", 100+i);
      p.put("product_name", "관련 상품 "+i);
      p.put("product_rate", 3.8 + (i%3)*0.4);
      p.put("review_count", 5+i);
      p.put("saved_name", "https://picsum.photos/seed/rel_"+i+"/300/220");
      relatedProducts.add(p);
    }
    request.setAttribute("relatedProducts", relatedProducts);

    java.util.List<java.util.Map<String,Object>> recommendProducts = new java.util.ArrayList<java.util.Map<String,Object>>();
    for(int i=1;i<=8;i++){
      java.util.Map<String,Object> p = new java.util.HashMap<String,Object>();
      p.put("product_id", 200+i);
      p.put("product_name", "추천 상품 "+i);
      p.put("product_rate", 4.0 + (i%4)*0.3);
      p.put("review_count", 10+i);
      p.put("saved_name", "https://picsum.photos/seed/rec_"+i+"/300/220");
      recommendProducts.add(p);
    }
    request.setAttribute("recommendProducts", recommendProducts);
  }
%>

<jsp:include page="/WEB-INF/views/layout/header.jsp" />
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/store/StoreView.css" />

<script>
  // ✅ JS에서 contextPath 안전하게 쓰기 위함
  window.CTX = "${pageContext.request.contextPath}";
</script>

<div class="page-shell">
  <div class="content-wrap">
    <div class="content-card store-detail">

      <!-- 우측 플로팅(찜/장바구니) -->
      <div class="store-floating">
        <a class="store-floating__btn store-floating__btn--wish"
           href="${pageContext.request.contextPath}/store/wishListPage" title="찜목록">찜목록</a>
        <a class="store-floating__btn store-floating__btn--cart"
           href="${pageContext.request.contextPath}/store/wishListPage" title="장바구니">장바구니</a>
      </div>

      <div class="detail-top">

        <!-- LEFT -->
        <div class="detail-left">
          <div class="gallery">
            <button type="button" class="gallery__nav gallery__nav--prev" id="btnPrev" aria-label="이전 이미지">&lt;</button>

            <div class="gallery__stage" id="galleryStage">
              <c:choose>
                <c:when test="${not empty product.image_list}">
                  <c:set var="firstImg" value="${product.image_list[0]}"/>
                  <c:choose>
                    <c:when test="${fn:startsWith(firstImg,'http')}">
                      <img id="mainImage" class="gallery__main" src="${firstImg}" alt="<c:out value='${product.product_name}'/>" />
                    </c:when>
                    <c:otherwise>
                      <img id="mainImage" class="gallery__main" src="${pageContext.request.contextPath}/upload/${firstImg}" alt="<c:out value='${product.product_name}'/>" />
                    </c:otherwise>
                  </c:choose>
                </c:when>
                <c:otherwise>
                  <img id="mainImage" class="gallery__main" src="" alt="" style="display:none;" />
                  <div class="gallery__dummy" id="mainDummy">상품 이미지</div>
                </c:otherwise>
              </c:choose>
            </div>

            <button type="button" class="gallery__nav gallery__nav--next" id="btnNext" aria-label="다음 이미지">&gt;</button>

            <!-- 썸네일 -->
            <div class="thumbs" id="thumbs">
              <c:choose>
                <c:when test="${not empty product.image_list}">
                  <c:forEach var="img" items="${product.image_list}" varStatus="st">
                    <c:choose>
                      <c:when test="${fn:startsWith(img,'http')}">
                        <button type="button" class="thumb ${st.index==0 ? 'thumb--active' : ''}" data-src="${img}">
                          <img src="${img}" alt="썸네일 ${st.index+1}" />
                        </button>
                      </c:when>
                      <c:otherwise>
                        <button type="button" class="thumb ${st.index==0 ? 'thumb--active' : ''}" data-src="${pageContext.request.contextPath}/upload/${img}">
                          <img src="${pageContext.request.contextPath}/upload/${img}" alt="썸네일 ${st.index+1}" />
                        </button>
                      </c:otherwise>
                    </c:choose>
                  </c:forEach>
                </c:when>
                <c:otherwise>
                  <button type="button" class="thumb thumb--active" data-src=""><span class="thumb__dummy">이미지 1</span></button>
                  <button type="button" class="thumb" data-src=""><span class="thumb__dummy">이미지 2</span></button>
                  <button type="button" class="thumb" data-src=""><span class="thumb__dummy">이미지 3</span></button>
                  <button type="button" class="thumb" data-src=""><span class="thumb__dummy">이미지 4</span></button>
                  <button type="button" class="thumb" data-src=""><span class="thumb__dummy">이미지 5</span></button>
                  <button type="button" class="thumb" data-src=""><span class="thumb__dummy">이미지 6</span></button>
                </c:otherwise>
              </c:choose>
            </div>

            <!-- 제품설명 버튼 라인 -->
            <div class="gallery__bar">
              <div class="gallery__bar-title">제품 설명</div>
              <button type="button" class="gallery__bar-btn" id="btnOpenDesc">▶</button>
            </div>

            <!-- 고객리뷰 -->
            <div class="review-box">
              <div class="review-box__head">
                <div class="review-box__title">고객 리뷰</div>
                <button type="button" class="review-all-link" id="btnOpenReviews">리뷰 전체보기</button>
              </div>

              <div class="review-box__panel">
                <!-- LEFT: 리뷰 미리보기 -->
                <div class="review-preview">
                  <c:choose>
                    <c:when test="${not empty topReview}">
                      <div class="review-preview__inner">
                        <div class="review-preview__top">
                          <div class="review-preview__subject">리뷰 미리보기</div>
                          <div class="review-preview__rate">★ <fmt:formatNumber value="${topReview.review_rate}" pattern="0.0"/></div>
                        </div>
                        <div class="review-preview__meta">
                          <span class="review-preview__nick"><c:out value="${topReview.nickname}" /></span>
                          <c:if test="${not empty topReview.review_date}">
                            <span class="review-preview__date">· <fmt:formatDate value="${topReview.review_date}" pattern="yyyy-MM-dd"/></span>
                          </c:if>
                        </div>
                        <div class="review-preview__content"><c:out value="${topReview.review_content}" /></div>
                      </div>
                    </c:when>
                    <c:otherwise>
                      <div class="review-preview__empty">등록된 리뷰가 없습니다.</div>
                    </c:otherwise>
                  </c:choose>
                </div>

                <!-- RIGHT: 요약 -->
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
              <div class="info-card__brief"><c:out value="${product.product_description_brief}" /></div>
            </c:if>

            <div class="info-card__actions">
              <form action="${pageContext.request.contextPath}/store/cart/add" method="post" class="action-row">
                <input type="hidden" name="product_id" value="${product.product_id}" id="product_id" />
                <button type="button" class="btn btn--solid" id="addCart">장바구니</button>
              </form>

              <form action="${pageContext.request.contextPath}/store/wish/add" method="post" class="action-row">
                <input type="hidden" name="product_id" value="${product.product_id}" />
                <button type="button" class="btn btn--ghost" id="addWish">찜하기</button>
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
            <div class="product-mini js-card" data-href="${pageContext.request.contextPath}/store/product/detail?product_id=${p.product_id}">
              <div class="product-mini__thumb">
                <c:choose>
                  <c:when test="${not empty p.saved_name}">
                    <c:choose>
                      <c:when test="${fn:startsWith(p.saved_name,'http')}">
                        <img src="${p.saved_name}" alt="${p.product_name}" />
                      </c:when>
                      <c:otherwise>
                        <img src="${pageContext.request.contextPath}/upload/${p.saved_name}" alt="${p.product_name}" />
                      </c:otherwise>
                    </c:choose>
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
            <div class="product-mini js-card" data-href="${pageContext.request.contextPath}/store/product/detail?product_id=${p.product_id}">
              <div class="product-mini__thumb">
                <c:choose>
                  <c:when test="${not empty p.saved_name}">
                    <c:choose>
                      <c:when test="${fn:startsWith(p.saved_name,'http')}">
                        <img src="${p.saved_name}" alt="${p.product_name}" />
                      </c:when>
                      <c:otherwise>
                        <img src="${pageContext.request.contextPath}/upload/${p.saved_name}" alt="${p.product_name}" />
                      </c:otherwise>
                    </c:choose>
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

      <!-- 제품설명 모달 -->
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
                  <c:otherwise>상세 설명이 없습니다.</c:otherwise>
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
                  <c:otherwise>주의사항이 없습니다.</c:otherwise>
                </c:choose>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ✅ 리뷰 전체보기 모달 -->
      <div class="modal" id="reviewModal" aria-hidden="true">
        <div class="modal__dim" id="reviewModalDim"></div>

        <div class="modal__panel modal__panel--wide" role="dialog" aria-modal="true" aria-labelledby="reviewModalTitle">
          <div class="modal__header modal__header--review" id="reviewModalHeader">
            <div class="modal__title" id="reviewModalTitle">
              <c:out value="${product.product_name}" /> - 전체 리뷰
            </div>
            <button type="button" class="modal__close" id="btnCloseReviewModal" aria-label="닫기">×</button>
          </div>

          <div class="modal__body modal__body--review">
            <!-- LEFT -->
            <aside class="review-aside">
              <div class="review-aside__rate">
                <div class="review-aside__rate-num">
                  <fmt:formatNumber value="${empty product.product_rate ? 0 : product.product_rate}" pattern="0.0"/>
                </div>
                <div class="review-aside__stars">★★★★★</div>
                <div class="review-aside__count">
                  <c:out value="${empty product.review_count ? 0 : product.review_count}" />개의 리뷰
                </div>
              </div>

              <!-- ✅ JSTL step 음수 금지 대응(내림차순 출력) -->
              <div class="review-dist">
                <c:forEach var="i" begin="1" end="5" step="1">
                  <c:set var="s" value="${6 - i}" />
                  <div class="review-dist__row">
                    <span class="review-dist__star"><c:out value="${s}"/>★</span>
                    <span class="review-dist__bar">
                      <span class="review-dist__fill" style="width:${20*s}%;"></span>
                    </span>
                    <span class="review-dist__num">0</span>
                  </div>
                </c:forEach>
              </div>

              <button type="button" class="btn btn--solid review-write-btn" id="btnOpenWriteReview">상품평 쓰기</button>
            </aside>

            <!-- RIGHT -->
            <section class="review-feed">
              <!-- ✅ 드롭다운 필터/정렬 -->
              <div class="review-feed__tools">
                <div class="tool-group">
                  <label class="tool-label" for="filterRating">필터</label>
                  <select id="filterRating" class="tool-select">
                    <option value="all">평점 전체</option>
                    <option value="5">5점</option>
                    <option value="4">4점</option>
                    <option value="3">3점</option>
                    <option value="2">2점</option>
                    <option value="1">1점</option>
                  </select>

                  <select id="filterImage" class="tool-select">
                    <option value="all">이미지 전체</option>
                    <option value="hasImage">이미지 있는 리뷰</option>
                  </select>
                </div>

                <div class="tool-group">
                  <label class="tool-label" for="sortBy">정렬</label>
                  <select id="sortBy" class="tool-select">
                    <option value="latest">최신</option>
                    <option value="oldest">오래된</option>
                  </select>
                </div>
              </div>

              <!-- ✅ 리스트(무한 스크롤) -->
              <div class="review-feed__list" id="reviewFeedList"></div>
              <div class="review-feed__status" id="reviewFeedStatus" aria-live="polite"></div>

              <!-- ✅ JS가 읽을 JSON -->
              <script type="application/json" id="reviewJson">
              [
                <c:forEach var="r" items="${reviewList}" varStatus="st">
                {
                  "nickname": "<c:out value='${r.nickname}'/>",
                  "rate": "<c:out value='${r.review_rate}'/>",
                  "date": "<fmt:formatDate value='${r.review_date}' pattern='yyyy-MM-dd'/>",
                  "title": "<c:out value='${empty r.review_title ? "리뷰" : r.review_title}'/>",
                  "content": "<c:out value='${r.review_content}'/>",
                  "verified": <c:out value='${empty r.verified ? "false" : r.verified}'/>,
                  "helpful": <c:out value='${empty r.helpful ? 0 : r.helpful}'/>,
                  "images": [
                    <c:forEach var="img" items="${r.images}" varStatus="st2">
                      "<c:out value='${img}'/>"<c:if test="${!st2.last}">,</c:if>
                    </c:forEach>
                  ]
                }<c:if test="${!st.last}">,</c:if>
                </c:forEach>
              ]
              </script>
            </section>
          </div>
        </div>
      </div>

      <!-- ✅ 상품평 쓰기 모달 -->
      <div class="modal" id="writeReviewModal" aria-hidden="true">
        <div class="modal__dim" id="writeReviewModalDim"></div>

        <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="writeReviewTitle">
          <div class="modal__header">
            <div class="modal__title" id="writeReviewTitle">상품평 쓰기</div>
            <button type="button" class="modal__close" id="btnCloseWriteReview" aria-label="닫기">×</button>
          </div>

          <div class="modal__body write-body">
            <div class="form-row">
              <div class="form-label">평점 <span class="req">*</span></div>
              <div class="star-input" id="starInput" data-value="0">
                <button type="button" class="star" data-v="1">★</button>
                <button type="button" class="star" data-v="2">★</button>
                <button type="button" class="star" data-v="3">★</button>
                <button type="button" class="star" data-v="4">★</button>
                <button type="button" class="star" data-v="5">★</button>
                <span class="star-input__value" id="starValueText">0.0</span>
              </div>
              <div class="form-hint">평점은 필수입니다.</div>
            </div>

            <div class="form-row">
              <div class="form-label">이미지 업로드 (선택)</div>
              <input type="file" id="reviewImages" accept="image/*" multiple />
              <div class="img-preview" id="imgPreview"></div>
            </div>

            <div class="form-row">
              <label class="chk">
                <input type="checkbox" id="chkVerified" />
                <span>구매 인증(선택)</span>
              </label>
            </div>

            <div class="form-row">
              <label class="chk">
                <input type="checkbox" id="chkTerms" />
                <span>리뷰 작성 조항에 동의합니다.</span>
              </label>
              <div class="form-hint">조항 동의는 필수입니다.</div>
            </div>

            <div class="form-row">
              <div class="form-label">제목</div>
              <input type="text" id="reviewTitle" placeholder="예) 가성비 좋아요" />
            </div>

            <div class="form-row">
              <div class="form-label">내용</div>
              <textarea id="reviewContent" rows="5" placeholder="리뷰 내용을 작성해주세요."></textarea>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn--ghost" id="btnCancelWriteReview">취소</button>
              <button type="button" class="btn btn--solid" id="btnSubmitReview">등록</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>

<script src="${pageContext.request.contextPath}/resources/js/store/StoreView.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
