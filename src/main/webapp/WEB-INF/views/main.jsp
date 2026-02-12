<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/main.css">
<%@ include file="/WEB-INF/views/layout/header.jsp" %>

<div class="page-shell">
  
  <div class="content-wrap">
    <section class="content-card main-content">

      <!-- HERO -->
      <section class="hero">
        <h2 class="hero__title">
          	Home Sweet Farm 에 어서오세요.<br/>
          	식집사로 거듭나기 위한 정보들을 얻어가세요.
        </h2>

        <div class="hero__grid">
          <!-- 좌: 이미지 슬라이드 자리 -->
          <article class="hero-slide" aria-label="식물 사진 슬라이드">
            <div class="hero-slide__media">
              <img class="hero-slide__img" id="img1" src="/plant/image/default" alt="default plant1" />
              <img class="hero-slide__img" id="img2" src="" alt="default plant2" />
            </div>
            <button class="hero-slide__arrow hero-slide__arrow--prev" aria-label="이전 사진">&#10094;</button>
            <button class="hero-slide__arrow hero-slide__arrow--next" aria-label="다음 사진">&#10095;</button>
          </article>

          <!-- 우: 추천 가이드 이동 -->
          <a class="hero-cta" href="#" role="button">
		            아직 반려식물이 없으신가요?<br/>
		            추천 받으시고 키워보세요.<br/><br/>
            <span class="hero-cta__link">추천가이드로 이동</span>
          </a>
        </div>
      </section>

      <!-- SECTIONS -->
      <section class="sections">

        <!-- 인기 식물 -->
        <section class="section">
          <header class="section__header">
            <h3 class="section__title">인기 식물(많이 키우는 식물)</h3>
            <a class="section__more" href="#">전체보기</a>
          </header>

          <div class="card-grid card-grid--3">
            <%-- 데이터 없을 때 --%>
            <%-- <div class="empty-state">데이터가 없습니다.</div> --%>

            <a class="plant-card" href="#">
              <div class="plant-card__thumb" aria-hidden="true"></div>

              <div class="plant-card__body">
                <div class="plant-card__name">식물 이름</div>
                <div class="plant-card__sci">학술명</div>

                <div class="meta-row">
                  <span class="meta"><span class="meta__label">조회수</span><span class="meta__value">312</span></span>
                  <span class="meta-row__sep">|</span>
                  <span class="meta"><span class="meta__label">좋아요</span><span class="meta__value">312</span></span>
                  <span class="meta-row__sep">|</span>
                  <span class="meta"><span class="meta__label">집사수</span><span class="meta__value">48</span></span>
                </div>
              </div>
            </a>

            <a class="plant-card" href="#">
              <div class="plant-card__thumb" aria-hidden="true"></div>
              <div class="plant-card__body">
                <div class="plant-card__name">식물 이름</div>
                <div class="plant-card__sci">학술명</div>
                <div class="meta-row">
                  <span class="meta"><span class="meta__label">조회수</span><span class="meta__value">312</span></span>
                  <span class="meta-row__sep">|</span>
                  <span class="meta"><span class="meta__label">좋아요</span><span class="meta__value">312</span></span>
                  <span class="meta-row__sep">|</span>
                  <span class="meta"><span class="meta__label">집사수</span><span class="meta__value">48</span></span>
                </div>
              </div>
            </a>

            <a class="plant-card" href="#">
              <div class="plant-card__thumb" aria-hidden="true"></div>
              <div class="plant-card__body">
                <div class="plant-card__name">식물 이름</div>
                <div class="plant-card__sci">학술명</div>
                <div class="meta-row">
                  <span class="meta"><span class="meta__label">조회수</span><span class="meta__value">312</span></span>
                  <span class="meta-row__sep">|</span>
                  <span class="meta"><span class="meta__label">좋아요</span><span class="meta__value">312</span></span>
                  <span class="meta-row__sep">|</span>
                  <span class="meta"><span class="meta__label">집사수</span><span class="meta__value">48</span></span>
                </div>
              </div>
            </a>
          </div>
        </section>

        <!-- 인기 질문 -->
        <section class="section">
          <header class="section__header">
            <h3 class="section__title">많이 물어보는 질문(카테고리가 많은 Q&amp;A)</h3>
            <a class="section__more" href="#">전체보기</a>
          </header>

          <div class="card-grid card-grid--3">
            <%-- 데이터 없을 때 --%>
            <%-- <div class="empty-state">데이터가 없습니다.</div> --%>

            <a class="qa-card" href="#">
              <div class="qa-card__title">질문 제목</div>

              <div class="meta-row meta-row--between">
                <span class="meta"><span class="meta__label">답글</span><span class="meta__value">48</span></span>
                <span class="meta-row__sep">|</span>
                <span class="meta"><span class="meta__label">조회수</span><span class="meta__value">312</span></span>
                <span class="meta-row__sep">|</span>
                <span class="meta"><span class="meta__label">좋아요</span><span class="meta__value">312</span></span>
              </div>

              <p class="qa-card__excerpt">
                질문 내용 질문 내용 질문 내용 질문 내용 질문 내용…
              </p>
            </a>

            <a class="qa-card" href="#">
              <div class="qa-card__title">질문 제목</div>
              <div class="meta-row meta-row--between">
                <span class="meta"><span class="meta__label">답글</span><span class="meta__value">48</span></span>
                <span class="meta-row__sep">|</span>
                <span class="meta"><span class="meta__label">조회수</span><span class="meta__value">312</span></span>
                <span class="meta-row__sep">|</span>
                <span class="meta"><span class="meta__label">좋아요</span><span class="meta__value">312</span></span>
              </div>
              <p class="qa-card__excerpt">질문 내용…</p>
            </a>

            <a class="qa-card" href="#">
              <div class="qa-card__title">질문 제목</div>
              <div class="meta-row meta-row--between">
                <span class="meta"><span class="meta__label">답글</span><span class="meta__value">48</span></span>
                <span class="meta-row__sep">|</span>
                <span class="meta"><span class="meta__label">조회수</span><span class="meta__value">312</span></span>
                <span class="meta-row__sep">|</span>
                <span class="meta"><span class="meta__label">좋아요</span><span class="meta__value">312</span></span>
              </div>
              <p class="qa-card__excerpt">질문 내용…</p>
            </a>
          </div>
        </section>

        <!-- 인기 답변자 -->
        <section class="section">
          <header class="section__header">
            <h3 class="section__title">인기 답변자(좋아요가 많은 답변자)</h3>
            <a class="section__more" href="#">전체보기</a>
          </header>

          <div class="card-grid card-grid--3">
            <%-- 데이터 없을 때 --%>
            <%-- <div class="empty-state">데이터가 없습니다.</div> --%>

            <a class="user-card" href="#">
              <div class="user-card__thumb" aria-hidden="true"></div>

              <div class="user-card__body">
                <div class="user-card__name">Sophie Bennett</div>
                <p class="user-card__bio">A Product Designer focused on intuitive user experiences.</p>

                <div class="meta-row">
                  <span class="meta"><span class="meta__label">답변수</span><span class="meta__value">312</span></span>
                  <span class="meta-row__sep">|</span>
                  <span class="meta"><span class="meta__label">채택수</span><span class="meta__value">312</span></span>
                  <span class="meta-row__sep">|</span>
                  <span class="meta"><span class="meta__label">좋아요</span><span class="meta__value">312</span></span>
                </div>
              </div>
            </a>

            <a class="user-card" href="#">
              <div class="user-card__thumb" aria-hidden="true"></div>
              <div class="user-card__body">
                <div class="user-card__name">Sophie Bennett</div>
                <p class="user-card__bio">A Product Designer focused on intuitive user experiences.</p>
                <div class="meta-row">
                  <span class="meta"><span class="meta__label">답변수</span><span class="meta__value">312</span></span>
                  <span class="meta-row__sep">|</span>
                  <span class="meta"><span class="meta__label">채택수</span><span class="meta__value">312</span></span>
                  <span class="meta-row__sep">|</span>
                  <span class="meta"><span class="meta__label">좋아요</span><span class="meta__value">312</span></span>
                </div>
              </div>
            </a>

            <a class="user-card" href="#">
              <div class="user-card__thumb" aria-hidden="true"></div>
              <div class="user-card__body">
                <div class="user-card__name">Sophie Bennett</div>
                <p class="user-card__bio">A Product Designer focused on intuitive user experiences.</p>
                <div class="meta-row">
                  <span class="meta"><span class="meta__label">답변수</span><span class="meta__value">312</span></span>
                  <span class="meta-row__sep">|</span>
                  <span class="meta"><span class="meta__label">채택수</span><span class="meta__value">312</span></span>
                  <span class="meta-row__sep">|</span>
                  <span class="meta"><span class="meta__label">좋아요</span><span class="meta__value">312</span></span>
                </div>
              </div>
            </a>
          </div>
        </section>

      </section>
    </section>
  </div>
</div>
<%@ include file="/WEB-INF/views/layout/footer.jsp" %>
<script src="${pageContext.request.contextPath}/resources/js/main.js"></script>
