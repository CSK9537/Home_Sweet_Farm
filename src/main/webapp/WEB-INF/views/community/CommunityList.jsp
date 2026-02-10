<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<%
    // ====== 뷰 확인용 더미 데이터 ======
    java.util.List<java.util.Map<String,Object>> posts = new java.util.ArrayList<>();

    for (int i = 1; i <= 12; i++) {
        java.util.Map<String,Object> p = new java.util.HashMap<>();
        p.put("id", i);
        p.put("title", "게시글 제목 " + i);
        p.put("writer", "작성자" + i);
        p.put("date", "2026.01.25");
        p.put("views", 312 + i);
        p.put("likes", 312);
        p.put("comments", 48 - (i % 10));
        p.put("content", "내용 미리보기입니다. 카드형에서는 이 영역이 조금 더 길게 보이고, 앨범형/리스트형에서는 간략화됩니다.");
        p.put("img", "https://picsum.photos/seed/community" + i + "/600/400"); // 더미 이미지
        posts.add(p);
    }
    request.setAttribute("posts", posts);
%>

<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/community/CommunityList.css" />

<jsp:include page="/WEB-INF/views/layout/header.jsp" />

<div class="page-shell">
  <div class="content-wrap">
    <div class="content-card community">

      <!-- 상단 타이틀/탭/버튼 -->
      <div class="community__header">
        <div class="community__titleRow">
          <h2 class="community__title">자유게시판</h2>

          <a class="community__writeBtn" href="${pageContext.request.contextPath}/community/write">
            	글쓰기
          </a>
        </div>

        <div class="community__subRow">
          <div class="community__tabs" role="tablist" aria-label="게시판 탭">
            <a class="community__tab is-active" href="#" role="tab" aria-selected="true">자유게시판</a>
            <span class="community__tabSep">|</span>
            <a class="community__tab" href="#" role="tab" aria-selected="false">비움시장</a>
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
          <a class="postItem" href="${pageContext.request.contextPath}/community/detail?id=${p.id}">
            <div class="postItem__imgWrap">
              <img class="postItem__img" src="${p.img}" alt="게시글 썸네일" />
              <!-- 앨범형 오버레이 텍스트 -->
              <div class="postItem__overlay">
                <div class="postItem__overlayTitle">${p.title}</div>
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
          <input type="text" name="q" class="searchInput" placeholder="검색어를 입력하세요" />
          <button type="submit" class="searchBtn">검색</button>
        </form>
      </div>

    </div>
  </div>
</div>

<script src="${pageContext.request.contextPath}/resources/js/community/CommunityList.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
