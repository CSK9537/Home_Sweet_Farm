<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/community/CommunityMain.css">
<jsp:include page="/WEB-INF/views/layout/header.jsp" />

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
            <!-- data-move 임시 방지 -->
            <li class="tab-item active" data-tab="free" data-move="<c:url value='#'/>">자유게시판</li>
            <li class="tab-sep">||</li>
            <li class="tab-item" data-tab="market" data-move="<c:url value='#'/>">벼룩시장</li>
          </ul>
        </div>

        <div class="community-top__right">
          <!-- data-move 임시 방지 -->
          <button type="button" class="btn-write" id="btnWrite"
                  data-move="<c:url value='#'/>">글쓰기</button>
        </div>
      </div>

      <div class="top-divider"></div>

      <!-- ====== 메인 섹션들 ====== -->
      <div id="communityMainSections">

        <!-- 인기글 -->
        <section class="block">
          <div class="block-head">
            <div class="block-title">인기글 (좋아요가 많은 글)</div>
            <a href="javascript:void(0)" class="block-more js-more" data-more="popular">전체보기</a>
          </div>

          <div class="carousel">
            <button type="button" class="nav-btn nav-left js-nav" data-target="popular" data-dir="-1">&#8249;</button>

            <div class="rail js-rail" id="rail-popular">
              <c:forEach var="p" items="${popularPosts}">
                <div class="card js-card"
                     data-move="${p.moveUrl}"
                     data-kind="${p.postType}"
                     style="<c:if test='${p.postType eq "IMAGE"}'>background-image:url(${p.imgUrl});</c:if>">
                  <div class="blind"></div>
                  <div class="card-inner">
                    <div class="card-title">${p.title}</div>
                    <c:if test='${p.postType eq "IMAGE"}'>
                      <div class="card-sub">${p.subTitle}</div>
                    </c:if>
                    <div class="card-meta">
                      <span>댓글 ${p.replyCount}</span>
                      <span class="meta-sep">||</span>
                      <span>조회수 ${p.viewCount}</span>
                      <span class="meta-sep">||</span>
                      <span>좋아요 ${p.likeCount}</span>
                    </div>
                    <c:if test='${p.postType eq "TEXT"}'>
                      <div class="card-body">${p.content}</div>
                    </c:if>
                  </div>
                </div>
              </c:forEach>
            </div>

            <button type="button" class="nav-btn nav-right js-nav" data-target="popular" data-dir="1">&#8250;</button>
          </div>
        </section>

        <!-- HOT -->
        <section class="block">
          <div class="block-head">
            <div class="block-title">HOT (조회수가 많은 글)</div>
            <a href="javascript:void(0)" class="block-more js-more" data-more="hot">전체보기</a>
          </div>

          <div class="carousel">
            <button type="button" class="nav-btn nav-left js-nav" data-target="hot" data-dir="-1">&#8249;</button>

            <div class="rail js-rail" id="rail-hot">
              <c:forEach var="p" items="${hotPosts}">
                <div class="card js-card"
                     data-move="${p.moveUrl}"
                     data-kind="${p.postType}"
                     style="<c:if test='${p.postType eq "IMAGE"}'>background-image:url(${p.imgUrl});</c:if>">
                  <div class="blind"></div>
                  <div class="card-inner">
                    <div class="card-title">${p.title}</div>
                    <c:if test='${p.postType eq "IMAGE"}'>
                      <div class="card-sub">${p.subTitle}</div>
                    </c:if>
                    <div class="card-meta">
                      <span>댓글 ${p.replyCount}</span>
                      <span class="meta-sep">||</span>
                      <span>조회수 ${p.viewCount}</span>
                      <span class="meta-sep">||</span>
                      <span>좋아요 ${p.likeCount}</span>
                    </div>
                    <c:if test='${p.postType eq "TEXT"}'>
                      <div class="card-body">${p.content}</div>
                    </c:if>
                  </div>
                </div>
              </c:forEach>
            </div>

            <button type="button" class="nav-btn nav-right js-nav" data-target="hot" data-dir="1">&#8250;</button>
          </div>
        </section>

        <!-- 최신글 -->
        <section class="block">
          <div class="block-head">
            <div class="block-title">최신글 (오늘 작성된 글)</div>
            <a href="javascript:void(0)" class="block-more js-more" data-more="latest">전체보기</a>
          </div>

          <div class="carousel">
            <button type="button" class="nav-btn nav-left js-nav" data-target="latest" data-dir="-1">&#8249;</button>

            <div class="rail js-rail" id="rail-latest">
              <c:forEach var="p" items="${latestPosts}">
                <div class="card js-card"
                     data-move="${p.moveUrl}"
                     data-kind="${p.postType}"
                     style="<c:if test='${p.postType eq "IMAGE"}'>background-image:url(${p.imgUrl});</c:if>">
                  <div class="blind"></div>
                  <div class="card-inner">
                    <div class="card-title">${p.title}</div>
                    <c:if test='${p.postType eq "IMAGE"}'>
                      <div class="card-sub">${p.subTitle}</div>
                    </c:if>
                    <div class="card-meta">
                      <span>댓글 ${p.replyCount}</span>
                      <span class="meta-sep">||</span>
                      <span>조회수 ${p.viewCount}</span>
                      <span class="meta-sep">||</span>
                      <span>좋아요 ${p.likeCount}</span>
                    </div>
                    <c:if test='${p.postType eq "TEXT"}'>
                      <div class="card-body">${p.content}</div>
                    </c:if>
                  </div>
                </div>
              </c:forEach>
            </div>

            <button type="button" class="nav-btn nav-right js-nav" data-target="latest" data-dir="1">&#8250;</button>
          </div>
        </section>

        <!-- Q&A(카테고리 많이 물어보는 질문) -->
        <section class="block">
          <div class="block-head">
            <div class="block-title">많이 물어보는 질문(카테고리가 많은 Q&amp;A)</div>
            <!-- href 임시 방지 -->
            <a href="<c:url value='#'/>" class="block-more" id="btnQaMore">전체보기</a>
          </div>

          <div class="carousel">
            <button type="button" class="nav-btn nav-left js-nav" data-target="qa" data-dir="-1">&#8249;</button>

            <div class="rail js-rail" id="rail-qa">
              <c:forEach var="q" items="${qaPosts}">
                <div class="qcard js-card"
                     data-move="${q.moveUrl}"
                     data-kind="TEXT">
                  <div class="qcard-inner">
                    <div class="qcard-title">${q.title}</div>
                    <div class="qcard-meta">
                      <span>댓글 ${q.replyCount}</span>
                      <span class="meta-sep">||</span>
                      <span>조회수 ${q.viewCount}</span>
                      <span class="meta-sep">||</span>
                      <span>좋아요 ${q.likeCount}</span>
                    </div>
                    <div class="qcard-divider"></div>
                    <div class="qcard-body">${q.content}</div>
                  </div>
                </div>
              </c:forEach>
            </div>

            <button type="button" class="nav-btn nav-right js-nav" data-target="qa" data-dir="1">&#8250;</button>
          </div>
        </section>

      </div><!-- /#communityMainSections -->

      <!-- ====== 전체보기 패널(인기/HOT/최신) : 페이지 이동 없이 컨텐츠 영역만 교체 ====== -->
      <div id="communityMorePanel" class="more-panel hidden">
        <div class="more-head">
          <div class="more-title" id="moreTitle">전체보기</div>
          <button type="button" class="more-back" id="btnMoreBack">뒤로</button>
        </div>
        <div class="more-divider"></div>

        <div class="more-grid" id="moreGrid">
          <!-- JS로 렌더링 -->
        </div>
      </div>

      <!-- 하단 검색바(이미지처럼 자리만) -->
      <div class="bottom-search">
        <div class="search-pill">
          <span class="search-icon">Q</span>
          <input type="text" class="search-input" placeholder="" />
        </div>
      </div>

    </div>
  </section>
</div>

<script src="${pageContext.request.contextPath}/resources/js/community/CommunityMain.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
