<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/main.css">

<%@ include file="/WEB-INF/views/layout/header.jsp" %>
<div class="page-shell">
	
  <div class="content-wrap">
    <section class="content-card main-content">

      <!-- HERO -->
        <c:choose>
        <c:when test="${empty sessionScope.loginUser}">
        <section class="hero">
        <h2 class="hero__title">
          	Home Sweet Farm 에 어서오세요.<br/>
          	식물집사로 거듭나기 위한 정보들을 얻어가세요.
        </h2>
        
        <div class="hero__grid">
          <article class="hero-slide" aria-label="식물 사진 슬라이드">
            <div class="hero-slide__media">
              <img class="hero-slide__img" src="${pageContext.request.contextPath}/resources/image/Default_Plant.jpg" alt="default plant" />
            </div>
          </article>

          <a class="hero-cta" href="/myplant/recommend" role="button">
		            아직 반려식물이 없으신가요?<br/>
		            추천 받으시고 키워보세요.<br/><br/>
            <span class="hero-cta__link">추천가이드로 이동</span>
          </a>
        </div>
        </section>
        </c:when>
        <c:otherwise>
        <section class="hero">
		  <h2 class="hero__title">
			반갑습니다, ${sessionScope.loginUser.username}님!<br/>
	      </h2>
	      <div class="hero__grid">
          <article class="hero-slide" aria-label="식물 사진 슬라이드">
            <div class="hero-slide__media">
              <img class="hero-slide__img" src="${pageContext.request.contextPath}/resources/image/Default_Plant.jpg" alt="default plant" />
            </div>
          </article>
	      <a class="hero-cta" href="/myplant" role="button">
	                   곧 어떤 식물의 일정이 다가올지<br/>
	                   내 식물들의 대략적인 상태 출력<br/><br/>
	        <span class="hero-cta__link">나의 식물 관리하기</span>
	      </a>
	      </div>
	    </section>
	    </c:otherwise>
        </c:choose>
      

      <!-- SECTIONS -->
      <section class="sections">

        <!-- 인기 식물 -->
        <section class="section">
          <header class="section__header">
            <h3 class="section__title">인기 식물</h3>
            <a class="section__more" href="/plant">전체보기</a>
          </header>

          <div class="card-grid card-grid--3">
          <c:choose>
            <c:when test="${empty popularPlants}">
            	<div class="empty-state">데이터가 없습니다.</div>
            </c:when>
            <c:otherwise>
            	<c:forEach items="${popularPlants}" var="p">
	            	<a class="plant-card" href="/plant/info/${p.plant_name}">
		              <div class="plant-card__thumb">
		              	<img src="/plant/image/${p.plant_image}" alt="${p.plant_name_kor}" loading="lazy" />
		              </div>
		              <div class="plant-card__body">
		                <div class="plant-card__name">${p.plant_name_kor}</div>
		                <div class="plant-card__sci">${p.plant_name}</div>
	              	  </div>
	                </a>
                </c:forEach>
             </c:otherwise>
             </c:choose>
          </div>
        </section>

        <!-- 인기 질문 -->
        <section class="section">
          <header class="section__header">
            <h3 class="section__title">인기 질문</h3>
            <a class="section__more" href="qna/QnaList">전체보기</a>
          </header>

          <div class="card-grid card-grid--3">
            <c:choose>
            <c:when test="${empty popularQuestions}">
            	<div class="empty-state">데이터가 없습니다.</div>
            </c:when>
            <c:otherwise>
            	<c:forEach items="${popularQuestions}" var="q">
	            	<a class="qa-card" href="/qna/detail?qna_id=${q.id}">
		              <div class="qa-card__title">${q.title}</div>
		                <p class="qa-card__excerpt">${q.preview}</p>
		                <div class="meta-row">
		                  <span class="meta"><span class="meta__label">답글수</span><span class="meta__value">${q.answers}</span></span>
		                  <span class="meta-row__sep">|</span>
		                  <span class="meta"><span class="meta__label">조회수</span><span class="meta__value">${q.views}</span></span>
		                  <span class="meta-row__sep">|</span>
		                  <span class="meta"><span class="meta__label">좋아요</span><span class="meta__value">${q.likes}</span></span>
		                </div>
	                </a>
                </c:forEach>
             </c:otherwise>
             </c:choose>
	       </div>
	       </section>

        <!-- 인기 답변자 -->
        <section class="section">
          <header class="section__header">
            <h3 class="section__title">인기 답변자</h3>
            <a class="section__more" href="/qna/people">전체보기</a>
          </header>

          <div class="card-grid card-grid--3">
            <c:choose>
            <c:when test="${empty popularPlants}">
            	<div class="empty-state">데이터가 없습니다.</div>
            </c:when>
            <c:otherwise>
            	<c:forEach items="${popularPeople}" var="h">
	            	<a class="user-card" href="javascript:void(0);" data-user-id="${h.user_id}" onclick="handleUserClick(this)">
		              <div class="user-card__thumb">
		              	<img src="/user/getProfile?fileName=${h.profile}" loading="lazy" />
		              </div>
		              <div class="user-card__body">
		                <c:choose>
		                  <c:when test="${not empty h.nickname}">
		                    <div class="user-card__name">${h.nickname}</div>
		               	  </c:when>
		              	  <c:otherwise>
		                    <div class="user-card__name">${h.username}</div>
		              	  </c:otherwise>
		                </c:choose>
		                <p class="user-card__bio">${h.intro}</p>
		                <div class="meta-row">
		                  <span class="meta"><span class="meta__label">답변수</span><span class="meta__value">${h.totalAnswers}</span></span>
		                  <span class="meta-row__sep">|</span>
		                  <span class="meta"><span class="meta__label">채택수</span><span class="meta__value">${h.acceptedAnswers}</span></span>
		                  <span class="meta-row__sep">|</span>
		                  <span class="meta"><span class="meta__label">좋아요</span><span class="meta__value">${h.totalAnswerLikes}</span></span>
		                </div>
	              	  </div>
	                </a>
                </c:forEach>
             </c:otherwise>
             </c:choose>
          </div>
      </section>
    </section>
    </section>
</div>
</div>
<%@ include file="/WEB-INF/views/layout/footer.jsp" %>
<script> window.plantImages = ${plantImages != null ? plantImages : '[]'}; </script>
<script src="${pageContext.request.contextPath}/resources/js/main.js"></script>