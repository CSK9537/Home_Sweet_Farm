<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<%
    java.util.List<java.util.Map<String,Object>> dummyList = new java.util.ArrayList<>();

    java.util.Map<String,Object> p1 = new java.util.HashMap<>();
    p1.put("plant_id", 1);
    p1.put("plant_name_kr", "스킨답서스");
    p1.put("plant_name_en", "Epipremnum aureum");
    p1.put("plant_img_url", "https://picsum.photos/seed/a/600/400");

    dummyList.add(p1);

    request.setAttribute("popularPlants", dummyList);
%>


<jsp:include page="/WEB-INF/views/layout/header.jsp" />

<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/GuideMain.css" />

<div class="page-shell">
  <section class="content-wrap">
    <div class="content-card guide">

      <!-- 상단 타이틀 -->
      <div class="guide__header">
        <h2 class="guide__title">백과사전</h2>
        <div class="guide__divider"></div>
      </div>

      <!-- 인기 식물 -->
      <section class="guide-section" data-section="popular">
        <div class="guide-section__head">
          <h3 class="guide-section__title">인기 식물</h3>
        </div>

        <div class="plant-grid plant-grid--popular" id="popularGrid">
          <c:forEach var="p" items="${popularPlants}" varStatus="st">
            <article class="plant-card" data-id="${p.plant_id}">
              <a class="plant-card__link"
                 href="${pageContext.request.contextPath}/guide/detail?plant_id=${p.plant_id}">
                <div class="plant-card__thumb">
                  <c:if test="${st.count <= 3}">
                    <span class="plant-card__badge plant-card__badge--rank">${st.count}위</span>
                  </c:if>
                  <img src="${p.plant_img_url}" alt="${p.plant_name_kr}" loading="lazy" />
                </div>

                <div class="plant-card__body">
                  <div class="plant-card__name">${p.plant_name_kr}</div>
                  <div class="plant-card__sub">${p.plant_name_en}</div>
                </div>
              </a>
            </article>
          </c:forEach>

          <!-- 서버에서 인기식물 모델을 안 줬을 때도 UI 확인 가능하도록 더미 3개 (선택) -->
          <c:if test="${empty popularPlants}">
            <article class="plant-card">
              <a class="plant-card__link" href="#">
                <div class="plant-card__thumb">
                  <span class="plant-card__badge plant-card__badge--rank">1위</span>
                  <img src="https://picsum.photos/seed/plant1/600/400" alt="더미" />
                </div>
                <div class="plant-card__body">
                  <div class="plant-card__name">스킨답서스</div>
                  <div class="plant-card__sub">Epipremnum aureum</div>
                </div>
              </a>
            </article>
            <article class="plant-card">
              <a class="plant-card__link" href="#">
                <div class="plant-card__thumb">
                  <span class="plant-card__badge plant-card__badge--rank">2위</span>
                  <img src="https://picsum.photos/seed/plant2/600/400" alt="더미" />
                </div>
                <div class="plant-card__body">
                  <div class="plant-card__name">장미</div>
                  <div class="plant-card__sub">Rosa</div>
                </div>
              </a>
            </article>
            <article class="plant-card">
              <a class="plant-card__link" href="#">
                <div class="plant-card__thumb">
                  <span class="plant-card__badge plant-card__badge--rank">3위</span>
                  <img src="https://picsum.photos/seed/plant3/600/400" alt="더미" />
                </div>
                <div class="plant-card__body">
                  <div class="plant-card__name">고추</div>
                  <div class="plant-card__sub">Capsicum annuum</div>
                </div>
              </a>
            </article>
          </c:if>
        </div>

        <div class="guide-section__more">
          <button type="button"
                  class="btn-more"
                  data-target="#popularGrid"
                  data-section="popular"
                  data-offset="${empty popularOffset ? 0 : popularOffset}">
            더보기
          </button>
        </div>
      </section>

      <!-- 카테고리 섹션들 (예: 채소/꽃/나무...) -->
      <c:forEach var="sec" items="${sections}">
        <section class="guide-section" data-section="${sec.key}">
          <div class="guide-section__head">
            <h3 class="guide-section__title">${sec.title}</h3>
          </div>

          <div class="plant-grid" id="${sec.key}Grid">
            <c:forEach var="p" items="${sec.plants}">
              <article class="plant-card" data-id="${p.plant_id}">
                <a class="plant-card__link"
                   href="${pageContext.request.contextPath}/guide/detail?plant_id=${p.plant_id}">
                  <div class="plant-card__thumb">
                    <img src="${p.plant_img_url}" alt="${p.plant_name_kr}" loading="lazy" />
                  </div>
                  <div class="plant-card__body">
                    <div class="plant-card__name">${p.plant_name_kr}</div>
                    <div class="plant-card__sub">${p.plant_name_en}</div>
                  </div>
                </a>
              </article>
            </c:forEach>
          </div>

          <div class="guide-section__more">
            <button type="button"
                    class="btn-more"
                    data-target="#${sec.key}Grid"
                    data-section="${sec.key}"
                    data-offset="${empty sec.offset ? 0 : sec.offset}">
              더보기
            </button>
          </div>
        </section>
      </c:forEach>

      <!-- sections 모델이 없을 때 UI 확인용 더미 섹션 1개 (선택) -->
      <c:if test="${empty sections}">
        <section class="guide-section" data-section="dummy">
          <div class="guide-section__head">
            <h3 class="guide-section__title">채소</h3>
          </div>

          <div class="plant-grid" id="dummyGrid">
            <c:forEach begin="1" end="4" var="i">
              <article class="plant-card">
                <a class="plant-card__link" href="#">
                  <div class="plant-card__thumb">
                    <img src="https://picsum.photos/seed/veg${i}/600/400" alt="더미" loading="lazy" />
                  </div>
                  <div class="plant-card__body">
                    <div class="plant-card__name">더미 식물 ${i}</div>
                    <div class="plant-card__sub">Dummy plant ${i}</div>
                  </div>
                </a>
              </article>
            </c:forEach>
          </div>

          <div class="guide-section__more">
            <button type="button" class="btn-more" data-target="#dummyGrid" data-section="dummy" data-offset="0">
              더보기
            </button>
          </div>
        </section>
      </c:if>

    </div>
  </section>
</div>

<script defer src="${pageContext.request.contextPath}/resources/js/GuideMain.js"></script>

<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
