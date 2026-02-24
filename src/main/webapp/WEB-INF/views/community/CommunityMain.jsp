<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/community/CommunityMain.css" />
<jsp:include page="/WEB-INF/views/layout/header.jsp" />

<c:set var="DEFAULT_POST_IMG" value="${pageContext.request.contextPath}/resources/image/Default_Plant.jpg" />

<div class="page-shell">
  <section class="content-wrap">
    <div class="content-card community-card">

      <!-- 상단 타이틀/탭/글쓰기 -->
      <div class="community-top">
        <div class="community-top__left">
          <div class="community-title">커뮤니티</div>
        </div>

        <div class="community-top__center">
          <ul class="community-tabs" id="communityTabs">
            <li class="tab-item" data-tab="free" data-move="<c:url value='#'/>">자유게시판</li>
            <li class="tab-sep">||</li>
            <li class="tab-item" data-tab="market" data-move="<c:url value='#'/>">벼룩시장</li>
          </ul>
        </div>

        <div class="community-top__right">
          <button type="button" class="btn-write" id="btnWrite" data-move="<c:url value='#'/>">글쓰기</button>
        </div>
      </div>

      <div class="top-divider"></div>

      <div id="communityMainSections"
     data-more-api="${pageContext.request.contextPath}/community/main/more">

        <!-- ===================== 인기글 ===================== -->
        <section class="block">
          <div class="block-head">
            <div class="block-title">인기글 (좋아요가 많은 글)</div>
            <a href="javascript:void(0)" class="block-more js-more" data-more="popular">전체보기</a>
          </div>

          <div class="carousel">
            <button type="button"
                    class="nav-btn nav-left js-nav"
                    data-target="popular" data-dir="-1"
                    <c:if test="${empty popularPosts}">disabled="disabled"</c:if>>
              &#8249;
            </button>

            <div class="rail" id="rail-popular">
              <c:choose>
                <c:when test="${empty popularPosts}">
                  <div class="empty-panel">
                    <div class="empty-text">게시글 없음</div>
                  </div>
                </c:when>

                <c:otherwise>
                  <div class="rail-track">
                    <c:forEach var="p" items="${popularPosts}">
                      <c:set var="thumbSrc"
                             value="${empty p.thumbUrl ? (empty p.imgUrl ? DEFAULT_POST_IMG : p.imgUrl) : p.thumbUrl}" />

                      <div class="card js-card" data-move="${p.moveUrl}">
                        <div class="card-thumb">
                          <img src="${thumbSrc}" alt=""
                               onerror="this.onerror=null; this.src='${DEFAULT_POST_IMG}';" />
                        </div>

                        <div class="card-body">
                          <div class="card-title">${p.title}</div>
                          <div class="card-author">${p.author}</div>

                          <div class="card-meta">
                            <span>댓글 ${p.replyCount}</span>
                            <span class="meta-sep">|</span>
                            <span>조회수 ${p.viewCount}</span>
                            <span class="meta-sep">|</span>
                            <span>좋아요 ${p.likeCount}</span>
                          </div>

                          <c:if test="${not empty p.hashtags}">
                            <div class="card-tags">
                              <c:forEach var="t" items="${p.hashtags}">
                                <span class="tag">#${t}</span>
                              </c:forEach>
                            </div>
                          </c:if>
                        </div>
                      </div>
                    </c:forEach>
                  </div>
                </c:otherwise>
              </c:choose>
            </div>

            <button type="button"
                    class="nav-btn nav-right js-nav"
                    data-target="popular" data-dir="1"
                    <c:if test="${empty popularPosts}">disabled="disabled"</c:if>>
              &#8250;
            </button>
          </div>
        </section>

        <!-- ===================== HOT ===================== -->
        <section class="block">
          <div class="block-head">
            <div class="block-title">HOT (조회수가 많은 글)</div>
            <a href="javascript:void(0)" class="block-more js-more" data-more="hot">전체보기</a>
          </div>

          <div class="carousel">
            <button type="button"
                    class="nav-btn nav-left js-nav"
                    data-target="hot" data-dir="-1"
                    <c:if test="${empty hotPosts}">disabled="disabled"</c:if>>
              &#8249;
            </button>

            <div class="rail" id="rail-hot">
              <c:choose>
                <c:when test="${empty hotPosts}">
                  <div class="empty-panel">
                    <div class="empty-text">게시글 없음</div>
                  </div>
                </c:when>

                <c:otherwise>
                  <div class="rail-track">
                    <c:forEach var="p" items="${hotPosts}">
                      <c:set var="thumbSrc"
                             value="${empty p.thumbUrl ? (empty p.imgUrl ? DEFAULT_POST_IMG : p.imgUrl) : p.thumbUrl}" />

                      <div class="card js-card" data-move="${p.moveUrl}">
                        <div class="card-thumb">
                          <img src="${thumbSrc}" alt=""
                               onerror="this.onerror=null; this.src='${DEFAULT_POST_IMG}';" />
                        </div>

                        <div class="card-body">
                          <div class="card-title">${p.title}</div>
                          <div class="card-author">${p.author}</div>

                          <div class="card-meta">
                            <span>댓글 ${p.replyCount}</span>
                            <span class="meta-sep">|</span>
                            <span>조회수 ${p.viewCount}</span>
                            <span class="meta-sep">|</span>
                            <span>좋아요 ${p.likeCount}</span>
                          </div>

                          <c:if test="${not empty p.hashtags}">
                            <div class="card-tags">
                              <c:forEach var="t" items="${p.hashtags}">
                                <span class="tag">#${t}</span>
                              </c:forEach>
                            </div>
                          </c:if>
                        </div>
                      </div>
                    </c:forEach>
                  </div>
                </c:otherwise>
              </c:choose>
            </div>

            <button type="button"
                    class="nav-btn nav-right js-nav"
                    data-target="hot" data-dir="1"
                    <c:if test="${empty hotPosts}">disabled="disabled"</c:if>>
              &#8250;
            </button>
          </div>
        </section>

        <!-- ===================== 최신글 ===================== -->
        <section class="block">
          <div class="block-head">
            <div class="block-title">최신글 (오늘 작성된 글)</div>
            <a href="javascript:void(0)" class="block-more js-more" data-more="latest">전체보기</a>
          </div>

          <div class="carousel">
            <button type="button"
                    class="nav-btn nav-left js-nav"
                    data-target="latest" data-dir="-1"
                    <c:if test="${empty latestPosts}">disabled="disabled"</c:if>>
              &#8249;
            </button>

            <div class="rail" id="rail-latest">
              <c:choose>
                <c:when test="${empty latestPosts}">
                  <div class="empty-panel">
                    <div class="empty-text">게시글 없음</div>
                  </div>
                </c:when>

                <c:otherwise>
                  <div class="rail-track">
                    <c:forEach var="p" items="${latestPosts}">
                      <c:set var="thumbSrc"
                             value="${empty p.thumbUrl ? (empty p.imgUrl ? DEFAULT_POST_IMG : p.imgUrl) : p.thumbUrl}" />

                      <div class="card js-card" data-move="${p.moveUrl}">
                        <div class="card-thumb">
                          <img src="${thumbSrc}" alt=""
                               onerror="this.onerror=null; this.src='${DEFAULT_POST_IMG}';" />
                        </div>

                        <div class="card-body">
                          <div class="card-title">${p.title}</div>
                          <div class="card-author">${p.author}</div>

                          <div class="card-meta">
                            <span>댓글 ${p.replyCount}</span>
                            <span class="meta-sep">|</span>
                            <span>조회수 ${p.viewCount}</span>
                            <span class="meta-sep">|</span>
                            <span>좋아요 ${p.likeCount}</span>
                          </div>

                          <c:if test="${not empty p.hashtags}">
                            <div class="card-tags">
                              <c:forEach var="t" items="${p.hashtags}">
                                <span class="tag">#${t}</span>
                              </c:forEach>
                            </div>
                          </c:if>
                        </div>
                      </div>
                    </c:forEach>
                  </div>
                </c:otherwise>
              </c:choose>
            </div>

            <button type="button"
                    class="nav-btn nav-right js-nav"
                    data-target="latest" data-dir="1"
                    <c:if test="${empty latestPosts}">disabled="disabled"</c:if>>
              &#8250;
            </button>
          </div>
        </section>

      </div><!-- /#communityMainSections -->

    </div>
  </section>
</div>

<script src="${pageContext.request.contextPath}/resources/js/community/CommunityMain.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />