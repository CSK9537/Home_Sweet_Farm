<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<jsp:include page="/WEB-INF/views/layout/header.jsp" />

<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common/SearchResult.css" />

<div class="page-shell">
  <div class="content-wrap">
    <div class="content-card search-result-card">

      <div class="search-result-header">
        <h2 class="search-result-title">
          <span class="highlight">'${keyword}'</span> 검색 결과
        </h2>
      </div>

      <div class="search-result-tabs">
        <a href="?q=${keyword}&tab=all" class="search-result-tab ${tab eq 'all' ? 'is-active' : ''}">통합 검색</a>
        <a href="?q=${keyword}&tab=plant" class="search-result-tab ${tab eq 'plant' ? 'is-active' : ''}">식물</a>
        <a href="?q=${keyword}&tab=store" class="search-result-tab ${tab eq 'store' ? 'is-active' : ''}">스토어</a>
        <a href="?q=${keyword}&tab=comm" class="search-result-tab ${tab eq 'comm' ? 'is-active' : ''}">커뮤니티</a>
        <a href="?q=${keyword}&tab=qna" class="search-result-tab ${tab eq 'qna' ? 'is-active' : ''}">Q&A</a>
      </div>

      <div class="search-result-divider"></div>

      <div class="search-result-body">

        <c:if test="${tab eq 'all' or tab eq 'plant'}">
          <section class="search-result-section">
            <div class="search-result-section__head">
              <h3 class="search-result-section__title">식물 <span class="count">${plantTotal}</span></h3>
              <c:if test="${tab eq 'all'}"><a href="?q=${keyword}&tab=plant" class="search-result-more">식물 더보기 &gt;</a></c:if>
            </div>
            <c:choose>
              <c:when test="${not empty plantResults}">
				  <div class="search-result-grid">
				    <c:forEach var="p" items="${plantResults}">
				      <div class="item-card plant-result-card">
				        
				        <div class="hover-area-wrapper">
				          <div class="hover-area hover-area--left" onclick="location.href='/plant/info/${p.plant_name}'"></div>
				          <div class="hover-area hover-area--right" onclick="location.href='/plant/guide/${p.plant_name}'"></div>
				        </div>
				        
				        <div class="item-card__link">
				          <div class="item-card__thumb">
				            <img src="/plant/image/${p.plant_image}" alt="${p.plant_name_kor}" loading="lazy" />
				            <span class="text left-text">백과사전</span>
				            <span class="text right-text">가이드</span>
				          </div>
				          <div class="item-card__body">
				            <div class="item-card__title">${p.plant_name_kor}</div>
				            <div class="item-card__sub">${p.plant_name}</div>
				          </div>
				        </div>
				        
				      </div>
				    </c:forEach>
				  </div>
				</c:when>
              <c:otherwise><div class="search-result-empty">일치하는 식물 정보가 없습니다.</div></c:otherwise>
            </c:choose>
          </section>
        </c:if>

        <c:if test="${tab eq 'all' or tab eq 'store'}">
          <section class="search-result-section">
            <div class="search-result-section__head">
              <h3 class="search-result-section__title">스토어 <span class="count">${storeTotal}</span></h3>
              <c:if test="${tab eq 'all'}"><a href="?q=${keyword}&tab=store" class="search-result-more">상품 더보기 &gt;</a></c:if>
            </div>
            <c:choose>
              <c:when test="${not empty storeResults}">
                <div class="search-result-grid"> 
                  <c:forEach var="s" items="${storeResults}">
                     <a href="${pageContext.request.contextPath}/store/product/detail?product_id=${s.product_id}" class="item-card">
                        <div class="item-card__thumb">
                            <c:choose>
                                <c:when test="${not empty s.thumbnail}"><img src="${pageContext.request.contextPath}/store/display?imgName=${s.thumbnail}" alt="${s.product_name}" /></c:when>
                                <c:otherwise><div class="item-card__dummy">상품 이미지</div></c:otherwise>
                            </c:choose>
                        </div>
                        <div class="item-card__body">
                            <div class="item-card__title"><c:out value="${s.product_name}" /></div>
                            
                            <div class="item-card__bottom">
                              <div class="item-card__price-row">
                                  <div class="item-card__price"><fmt:formatNumber value="${s.product_price}" pattern="#,###" />원</div>
                                  <c:if test="${s.product_sale ne null and s.product_sale gt 0}"><div class="item-card__sale"><c:out value="${s.product_sale}" />% OFF</div></c:if>
                              </div>
                              <div class="item-card__meta">
                                  <span class="stars">★</span>
                                  <span class="rate"><fmt:formatNumber value="${s.product_rate}" pattern="0.0"/></span> 
                                  <span class="count">(${s.review_count})</span> 
                              </div>
                            </div>
                        </div>
                     </a>
                  </c:forEach>
                </div>
              </c:when>
              <c:otherwise><div class="search-result-empty">일치하는 상품이 없습니다.</div></c:otherwise>
            </c:choose>
          </section>
        </c:if>

        <c:if test="${tab eq 'all' or tab eq 'comm'}">
          <section class="search-result-section">
            <div class="search-result-section__head">
              <h3 class="search-result-section__title">커뮤니티 <span class="count">${commTotal}</span></h3>
              <c:if test="${tab eq 'all'}"><a href="?q=${keyword}&tab=comm" class="search-result-more">게시글 더보기 &gt;</a></c:if>
            </div>
            <c:choose>
              <c:when test="${not empty commResults}">
                <div class="search-result-list">
                  <c:forEach var="c" items="${commResults}">
                    <a href="${c.moveUrl}" class="line-item">
                      <div class="line-item__left">
                        <span class="line-item__badge">📄</span>
                        <span class="line-item__title">${c.title}</span>
                        <span class="line-item__preview">${c.contentPreview}</span>
                      </div>
                      <div class="line-item__right">
                        <span>${c.writer}</span> <span class="dot">•</span>
                        <span>${c.regDate}</span> <span class="dot">•</span>
                        <span>조회 ${c.viewCount}</span> <span class="dot">•</span>
                        <span class="line-item__highlight">댓글 ${c.replyCnt}</span>
                      </div>
                    </a>
                  </c:forEach>
                </div>
              </c:when>
              <c:otherwise><div class="search-result-empty">일치하는 커뮤니티 게시글이 없습니다.</div></c:otherwise>
            </c:choose>
          </section>
        </c:if>

        <c:if test="${tab eq 'all' or tab eq 'qna'}">
          <section class="search-result-section">
            <div class="search-result-section__head">
              <h3 class="search-result-section__title">Q&A <span class="count">${qnaTotal}</span></h3>
              <c:if test="${tab eq 'all'}"><a href="?q=${keyword}&tab=qna" class="search-result-more">질문 더보기 &gt;</a></c:if>
            </div>
            <c:choose>
              <c:when test="${not empty qnaResults}">
                <div class="search-result-list">
                  <c:forEach var="q" items="${qnaResults}">
                    <a href="/qna/detail?qna_id=${q.id}" class="line-item">
                      <div class="line-item__left">
                        <span class="line-item__badge q-mark">Q.</span>
                        <span class="line-item__title">${q.title}</span>
                        <span class="line-item__preview">${q.preview}</span>
                      </div>
                      <div class="line-item__right">
                        <span>${q.writer}</span> <span class="dot">•</span>
                        <span>조회 ${q.views}</span> <span class="dot">•</span>
                        <span class="line-item__highlight">답변 ${q.answers}</span>
                      </div>
                    </a>
                  </c:forEach>
                </div>
              </c:when>
              <c:otherwise><div class="search-result-empty">일치하는 질문이 없습니다.</div></c:otherwise>
            </c:choose>
          </section>
        </c:if>

      </div> 
      
      <c:if test="${tab ne 'all' and realEnd gt 0}">
        <div class="pagination">
          <c:if test="${startPage gt 1}">
            <a href="?q=${keyword}&tab=${tab}&page=${startPage - 1}" class="pageBtn">&lsaquo; 이전</a>
          </c:if>
          <c:forEach var="i" begin="${startPage}" end="${endPage}">
            <a href="?q=${keyword}&tab=${tab}&page=${i}" class="pageNum ${i == page ? 'is-active' : ''}">${i}</a>
          </c:forEach>
          <c:if test="${endPage lt realEnd}">
            <a href="?q=${keyword}&tab=${tab}&page=${endPage + 1}" class="pageBtn">다음 &rsaquo;</a>
          </c:if>
        </div>
      </c:if>

    </div>
  </div>
</div>

<script src="${pageContext.request.contextPath}/resources/js/common/SearchResult.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />