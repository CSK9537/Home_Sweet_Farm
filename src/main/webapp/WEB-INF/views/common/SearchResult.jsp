<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<%-- =========================================================
     ✅ (뷰 확인용) 더미 데이터 생성 영역
     실제 컨트롤러 연동 시 이 스크립틀릿(<%...%>) 블록은 삭제하세요.
========================================================= --%>
<%
  String keyword = request.getParameter("keyword");
  if (keyword == null || keyword.trim().isEmpty()) keyword = "몬스테라";
  request.setAttribute("keyword", keyword);

  // 1. 식물 더미
  java.util.List<java.util.Map<String,Object>> plantResults = new java.util.ArrayList<>();
  for(int i=1; i<=4; i++){
    java.util.Map<String,Object> p = new java.util.HashMap<>();
    p.put("id", i); p.put("name_kor", keyword + " " + i); p.put("name", "Monstera deliciosa " + i);
    p.put("img", "https://picsum.photos/seed/plant"+i+"/400/300");
    plantResults.add(p);
  }
  request.setAttribute("plantResults", plantResults);

  // 2. 스토어 더미
  java.util.List<java.util.Map<String,Object>> storeResults = new java.util.ArrayList<>();
  for(int i=1; i<=4; i++){
    java.util.Map<String,Object> s = new java.util.HashMap<>();
    s.put("id", i); s.put("name", "무늬 " + keyword + " 화분 세트"); s.put("price", 15000 * i);
    s.put("rate", 4.5); s.put("review", 12 * i);
    s.put("img", "https://picsum.photos/seed/store"+i+"/400/400");
    storeResults.add(s);
  }
  request.setAttribute("storeResults", storeResults);

  // 3. 커뮤니티 더미
  java.util.List<java.util.Map<String,Object>> commResults = new java.util.ArrayList<>();
  for(int i=1; i<=3; i++){
    java.util.Map<String,Object> c = new java.util.HashMap<>();
    c.put("id", i); c.put("title", keyword + " 잎이 노랗게 변했어요 ㅠㅠ");
    c.put("content", "최근에 물을 많이 준 것 같은데, " + keyword + " 상태가 이상하네요. 어떻게 해야 할까요?");
    c.put("writer", "식집사" + i); c.put("date", "2026.03.0" + i); c.put("views", 102); c.put("comments", 5);
    commResults.add(c);
  }
  request.setAttribute("commResults", commResults);

  // 4. Q&A 더미
  java.util.List<java.util.Map<String,Object>> qnaResults = new java.util.ArrayList<>();
  for(int i=1; i<=3; i++){
    java.util.Map<String,Object> q = new java.util.HashMap<>();
    q.put("id", i); q.put("title", keyword + " 분갈이 흙 비율 질문합니다.");
    q.put("content", keyword + " 분갈이 하려고 하는데 상토랑 펄라이트 비율을 어떻게 하는 게 좋을까요?");
    q.put("writer", "초보가드너"); q.put("date", "2026.03.0" + i); q.put("status", i%2==0 ? "답변완료" : "대기중");
    qnaResults.add(q);
  }
  request.setAttribute("qnaResults", qnaResults);
%>

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

      <div class="search-result-tabs" id="searchResultTabs">
        <button type="button" class="search-result-tab is-active" data-target="all">통합 검색</button>
        <button type="button" class="search-result-tab" data-target="sec-plant">식물</button>
        <button type="button" class="search-result-tab" data-target="sec-store">스토어</button>
        <button type="button" class="search-result-tab" data-target="sec-comm">커뮤니티</button>
        <button type="button" class="search-result-tab" data-target="sec-qna">Q&A</button>
      </div>

      <div class="search-result-divider"></div>

      <div class="search-result-body" id="searchResultBody">

        <section class="search-result-section" id="sec-plant">
          <div class="search-result-section__head">
            <h3 class="search-result-section__title">식물 <span class="count">${fn:length(plantResults)}</span></h3>
            <a href="#" class="search-result-more">식물 더보기 &gt;</a>
          </div>
          <c:choose>
            <c:when test="${not empty plantResults}">
              <div class="search-result-grid grid-4">
                <c:forEach var="p" items="${plantResults}">
                  <a href="#" class="plant-card">
                    <div class="plant-card__thumb">
                      <img src="${p.img}" alt="${p.name_kor}" />
                    </div>
                    <div class="plant-card__body">
                      <div class="plant-card__name">${p.name_kor}</div>
                      <div class="plant-card__sub">${p.name}</div>
                    </div>
                  </a>
                </c:forEach>
              </div>
            </c:when>
            <c:otherwise>
              <div class="search-result-empty">일치하는 식물 정보가 없습니다.</div>
            </c:otherwise>
          </c:choose>
        </section>

        <section class="search-result-section" id="sec-store">
          <div class="search-result-section__head">
            <h3 class="search-result-section__title">스토어 <span class="count">${fn:length(storeResults)}</span></h3>
            <a href="#" class="search-result-more">상품 더보기 &gt;</a>
          </div>
          <c:choose>
            <c:when test="${not empty storeResults}">
              <div class="search-result-grid grid-4">
                <c:forEach var="s" items="${storeResults}">
                  <a href="#" class="product-card">
                    <div class="product-card__thumb">
                      <img src="${s.img}" alt="${s.name}" />
                    </div>
                    <div class="product-card__body">
                      <div class="product-card__name">${s.name}</div>
                      <div class="product-card__prices">
                        <div class="product-card__price"><fmt:formatNumber value="${s.price}" pattern="#,###" />원</div>
                      </div>
                      <div class="product-card__rating">
                        <span class="stars">★</span> <span class="rate">${s.rate}</span> <span class="count">(${s.review})</span>
                      </div>
                    </div>
                  </a>
                </c:forEach>
              </div>
            </c:when>
            <c:otherwise>
              <div class="search-result-empty">일치하는 상품이 없습니다.</div>
            </c:otherwise>
          </c:choose>
        </section>

        <section class="search-result-section" id="sec-comm">
          <div class="search-result-section__head">
            <h3 class="search-result-section__title">커뮤니티 <span class="count">${fn:length(commResults)}</span></h3>
            <a href="#" class="search-result-more">게시글 더보기 &gt;</a>
          </div>
          <c:choose>
            <c:when test="${not empty commResults}">
              <div class="search-result-list">
                <c:forEach var="c" items="${commResults}">
                  <a href="#" class="list-item">
                    <div class="list-item__body">
                      <div class="list-item__title">${c.title}</div>
                      <div class="list-item__content">${c.content}</div>
                      <div class="list-item__meta">
                        <span>${c.writer}</span> <span class="sep">|</span> <span>${c.date}</span> <span class="sep">|</span>
                        <span>조회 ${c.views}</span> <span class="sep">|</span> <span>댓글 ${c.comments}</span>
                      </div>
                    </div>
                  </a>
                </c:forEach>
              </div>
            </c:when>
            <c:otherwise>
              <div class="search-result-empty">일치하는 커뮤니티 게시글이 없습니다.</div>
            </c:otherwise>
          </c:choose>
        </section>

        <section class="search-result-section" id="sec-qna">
          <div class="search-result-section__head">
            <h3 class="search-result-section__title">Q&A <span class="count">${fn:length(qnaResults)}</span></h3>
            <a href="#" class="search-result-more">질문 더보기 &gt;</a>
          </div>
          <c:choose>
            <c:when test="${not empty qnaResults}">
              <div class="search-result-list">
                <c:forEach var="q" items="${qnaResults}">
                  <a href="#" class="list-item">
                    <div class="list-item__badge ${q.status eq '답변완료' ? 'is-done' : ''}">${q.status}</div>
                    <div class="list-item__body">
                      <div class="list-item__title"><span class="q-mark">Q.</span> ${q.title}</div>
                      <div class="list-item__content">${q.content}</div>
                      <div class="list-item__meta">
                        <span>${q.writer}</span> <span class="sep">|</span> <span>${q.date}</span>
                      </div>
                    </div>
                  </a>
                </c:forEach>
              </div>
            </c:when>
            <c:otherwise>
              <div class="search-result-empty">일치하는 질문이 없습니다.</div>
            </c:otherwise>
          </c:choose>
        </section>

      </div> </div>
  </div>
</div>

<script src="${pageContext.request.contextPath}/resources/js/common/SearchResult.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />