<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<%
    // ✅ DTO 없이: List<Map> 더미 생성
    java.util.List popularPosts = (java.util.List) request.getAttribute("popularPosts");
    java.util.List hotPosts     = (java.util.List) request.getAttribute("hotPosts");
    java.util.List latestPosts  = (java.util.List) request.getAttribute("latestPosts");

    if (popularPosts == null || popularPosts.isEmpty()) {

        popularPosts = new java.util.ArrayList();
        hotPosts     = new java.util.ArrayList();
        latestPosts  = new java.util.ArrayList();

        String defaultImg = request.getContextPath() + "/resources/image/Default_Plant.jpg";

        for (int i = 1; i <= 8; i++) {
            java.util.Map p = new java.util.HashMap();

            p.put("boardId", i);
            p.put("title", "더미 게시글 제목 " + i);
            p.put("author", "테스트유저" + i);

            // ✅ JSP/JS 공통 키로 맞춤
            p.put("thumbSrc", defaultImg);

            p.put("viewCount", 100 * i);
            p.put("likeCount", 20 * i);
            p.put("replyCount", 3 * i);

            // ✅ 문자열(콤마구분) 유지 → JSP에서 fn:split로 처리
            p.put("hashtags", "텃밭,농사,식물");

            p.put("moveUrl", "#");

            popularPosts.add(p);
            hotPosts.add(p);
            latestPosts.add(p);
        }

        request.setAttribute("popularPosts", popularPosts);
        request.setAttribute("hotPosts", hotPosts);
        request.setAttribute("latestPosts", latestPosts);
    }
%>

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
           data-more-api="${pageContext.request.contextPath}/community/main/more"
           data-default-img="${DEFAULT_POST_IMG}">

        <!-- =================================================
             ✅ 홈 화면(기존 3블록) : content-card의 기본 화면
        ================================================== -->
        <div id="communityHomeView">

          <!-- ===================== 인기글 ===================== -->
          <section class="block">
            <div class="block-head">
              <div class="block-title">인기글 (좋아요가 많은 글)</div>
              <button type="button" class="block-more js-more"
                      data-more-kind="popular"
                      data-more-title="인기글 전체보기">전체보기</button>
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
                        <!-- ✅ thumbSrc(더미/실데이터 공통 호환) -->
                        <c:set var="thumbSrc"
                               value="${not empty p.thumbSrc ? p.thumbSrc : (not empty p.thumbUrl ? p.thumbUrl : (not empty p.imgUrl ? p.imgUrl : DEFAULT_POST_IMG))}" />

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
                                <c:forEach var="t" items="${fn:split(p.hashtags, ',')}">
                                  <span class="tag">#${fn:trim(t)}</span>
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
              <button type="button" class="block-more js-more"
                      data-more-kind="hot"
                      data-more-title="HOT 전체보기">전체보기</button>
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
                               value="${not empty p.thumbSrc ? p.thumbSrc : (not empty p.thumbUrl ? p.thumbUrl : (not empty p.imgUrl ? p.imgUrl : DEFAULT_POST_IMG))}" />

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
                                <c:forEach var="t" items="${fn:split(p.hashtags, ',')}">
                                  <span class="tag">#${fn:trim(t)}</span>
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
              <button type="button" class="block-more js-more"
                      data-more-kind="latest"
                      data-more-title="최신글 전체보기">전체보기</button>
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
                               value="${not empty p.thumbSrc ? p.thumbSrc : (not empty p.thumbUrl ? p.thumbUrl : (not empty p.imgUrl ? p.imgUrl : DEFAULT_POST_IMG))}" />

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
                                <c:forEach var="t" items="${fn:split(p.hashtags, ',')}">
                                  <span class="tag">#${fn:trim(t)}</span>
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

        </div><!-- /#communityHomeView -->

        <!-- =================================================
             ✅ 전체보기 화면 : content-card "통째로" 바뀌는 영역
        ================================================== -->
        <div id="communityMoreView" style="display:none;">
          <div class="cm-more-pageHead">
            <div class="cm-more-pageTitle" id="cmMoreTitle">전체보기</div>

            <div class="cm-more-pageTools">
              <div class="cm-viewBtns" id="cmMoreViewBtns" aria-label="보기 방식">
                <button type="button" class="cm-viewBtn is-active" data-view="card">카드</button>
                <button type="button" class="cm-viewBtn" data-view="album">앨범</button>
                <button type="button" class="cm-viewBtn" data-view="list">리스트</button>
              </div>

              <button type="button" class="community__backBtn" id="cmMoreBackBtn">뒤로</button>
            </div>
          </div>

          <div class="cm-more__divider"></div>

          <div class="cm-list view-card" id="cmMoreList"></div>
        </div><!-- /#communityMoreView -->

      </div><!-- /#communityMainSections -->

    </div>
  </section>
</div>

<script src="${pageContext.request.contextPath}/resources/js/community/CommunityMain.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />