<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/ContentLayout.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/plant-view.css">

<div class="page-shell">
  <%@ include file="/WEB-INF/views/layout/header.jsp" %>

  <main class="content-wrap">
    <section class="content-card">

      <c:if test="${empty plant}">
        <div class="pview-empty">
          <p class="pview-empty__title">식물 정보를 불러오지 못했습니다.</p>
          <a class="pview-empty__link" href="${pageContext.request.contextPath}/plants">목록으로</a>
        </div>
      </c:if>

      <c:if test="${not empty plant}">

        <!-- =========================
             HERO
        ========================= -->
        <header class="pview-hero">
          <div class="pview-hero__media">
            <c:choose>
              <c:when test="${not empty plant.plant_image}">
                <img class="pview-hero__img" src="${plant.plant_image}" alt="${plant.plant_name_kor}" loading="lazy"/>
              </c:when>
              <c:otherwise>
                <img class="pview-hero__img" src="${pageContext.request.contextPath}/resources/images/default_plant.jpg"
                     alt="default plant" loading="lazy"/>
              </c:otherwise>
            </c:choose>
          </div>

          <div class="pview-hero__head">
            <p class="pview-hero__kicker">식물 백과사전</p>

            <h1 class="pview-hero__title">
              <c:out value="${plant.plant_name_kor}" />
            </h1>

            <p class="pview-hero__subtitle">
              <c:choose>
                <c:when test="${not empty plant.plant_name}">
                  <em><c:out value="${plant.plant_name}" /></em>
                </c:when>
                <c:when test="${not empty plant.plant_species}">
                  <em><c:out value="${plant.plant_species}" /></em>
                </c:when>
                <c:otherwise>
                  <em>-</em>
                </c:otherwise>
              </c:choose>
            </p>

            <!-- chips: 값 있을 때만 -->
            <ul class="pview-chips">
              <c:if test="${not empty plant.plant_type}">
                <li class="pview-chip">종류: <c:out value="${plant.plant_type}"/></li>
              </c:if>
              <c:if test="${not empty plant.plant_lifespan}">
                <li class="pview-chip">수명: <c:out value="${plant.plant_lifespan}"/></li>
              </c:if>

              <c:if test="${plant.plant_temperature_imin ne 0 or plant.plant_temperature_imax ne 0}">
                <li class="pview-chip">적정 온도: ${plant.plant_temperature_imin}~${plant.plant_temperature_imax}°C</li>
              </c:if>

              <c:if test="${not empty plant.plant_toxicity}">
                <li class="pview-chip pview-chip--warn">독성: <c:out value="${plant.plant_toxicity}"/></li>
              </c:if>
            </ul>

            <div class="pview-hero__actions">
              <a class="pview-btn" href="${pageContext.request.contextPath}/plants">목록</a>
            </div>
          </div>
        </header>

        <!-- =========================
             TAB (섹션이 존재할 때만 탭 보여주기)
        ========================= -->
        <c:set var="hasOverview" value="${not empty plant.plant_description}" />
        <c:set var="hasClassification"
               value="${not empty plant.plant_phylum or not empty plant.plant_class or not empty plant.plant_order
                       or not empty plant.plant_family or not empty plant.plant_genus or not empty plant.plant_species}" />
        <c:set var="hasTraits"
               value="${not empty plant.plant_height or not empty plant.plant_spread or not empty plant.plant_stemcolor
                       or not empty plant.plant_leafcolor or not empty plant.plant_leaftype
                       or not empty plant.plant_flowercolor or not empty plant.plant_flowersize or not empty plant.plant_bloomtime
                       or not empty plant.plant_fruitcolor or not empty plant.plant_harvesttime}" />
        <c:set var="hasCare"
               value="${not empty plant.plant_growthseason or not empty plant.plant_growthrate or not empty plant.plant_dormancy
                       or (plant.plant_temperature_imin ne 0) or (plant.plant_temperature_imax ne 0)}" />
        <c:set var="hasCulture"
               value="${not empty plant.plant_culture_symbolism or not empty plant.plant_culture_if
                       or not empty plant.plant_culture_epv or not empty plant.plant_culture_ev
                       or not empty plant.plant_culture_biv or not empty plant.plant_culture_gu}" />
        <c:set var="hasToxicity" value="${not empty plant.plant_toxicity}" />

        <nav class="pview-tabs">
          <c:if test="${hasOverview}">
            <a class="pview-tab" href="#sec-overview">개요</a>
          </c:if>
          <c:if test="${hasClassification}">
            <a class="pview-tab" href="#sec-classification">분류</a>
          </c:if>
          <c:if test="${hasTraits}">
            <a class="pview-tab" href="#sec-traits">특징</a>
          </c:if>
          <c:if test="${hasCare}">
            <a class="pview-tab" href="#sec-care">관리</a>
          </c:if>
          <c:if test="${hasCulture}">
            <a class="pview-tab" href="#sec-culture">상징·가치</a>
          </c:if>
          <c:if test="${hasToxicity}">
            <a class="pview-tab pview-tab--warn" href="#sec-toxicity">독성</a>
          </c:if>
        </nav>

        <!-- =========================
             CONTENT GRID
        ========================= -->
        <div class="pview-grid">
          <article class="pview-main">

            <!-- 개요 -->
            <c:if test="${hasOverview}">
              <section id="sec-overview" class="pview-card">
                <h2 class="pview-card__title">개요</h2>
                <p class="pview-text"><c:out value="${plant.plant_description}"/></p>
              </section>
            </c:if>

            <!-- 분류 -->
            <c:if test="${hasClassification}">
              <section id="sec-classification" class="pview-card">
                <h2 class="pview-card__title">분류</h2>

                <dl class="pview-dl">
                  <c:if test="${not empty plant.plant_phylum}">
                    <div class="pview-dl__row"><dt>문</dt><dd><c:out value="${plant.plant_phylum}"/></dd></div>
                  </c:if>
                  <c:if test="${not empty plant.plant_class}">
                    <div class="pview-dl__row"><dt>강</dt><dd><c:out value="${plant.plant_class}"/></dd></div>
                  </c:if>
                  <c:if test="${not empty plant.plant_order}">
                    <div class="pview-dl__row"><dt>목</dt><dd><c:out value="${plant.plant_order}"/></dd></div>
                  </c:if>
                  <c:if test="${not empty plant.plant_family}">
                    <div class="pview-dl__row"><dt>과</dt><dd><c:out value="${plant.plant_family}"/></dd></div>
                  </c:if>
                  <c:if test="${not empty plant.plant_genus}">
                    <div class="pview-dl__row"><dt>속</dt><dd><c:out value="${plant.plant_genus}"/></dd></div>
                  </c:if>
                  <c:if test="${not empty plant.plant_species}">
                    <div class="pview-dl__row"><dt>종</dt><dd><c:out value="${plant.plant_species}"/></dd></div>
                  </c:if>
                </dl>
              </section>
            </c:if>

            <!-- 특징 -->
            <c:if test="${hasTraits}">
              <section id="sec-traits" class="pview-card">
                <h2 class="pview-card__title">특징</h2>

                <div class="pview-facts">
                  <c:if test="${not empty plant.plant_height}">
                    <div class="pview-fact"><span>식물 높이</span><b><c:out value="${plant.plant_height}"/></b></div>
                  </c:if>
                  <c:if test="${not empty plant.plant_spread}">
                    <div class="pview-fact"><span>꼭대기 지름</span><b><c:out value="${plant.plant_spread}"/></b></div>
                  </c:if>
                  <c:if test="${not empty plant.plant_stemcolor}">
                    <div class="pview-fact"><span>줄기 색</span><b><c:out value="${plant.plant_stemcolor}"/></b></div>
                  </c:if>
                  <c:if test="${not empty plant.plant_leafcolor}">
                    <div class="pview-fact"><span>잎 색</span><b><c:out value="${plant.plant_leafcolor}"/></b></div>
                  </c:if>
                  <c:if test="${not empty plant.plant_leaftype}">
                    <div class="pview-fact"><span>잎 종류</span><b><c:out value="${plant.plant_leaftype}"/></b></div>
                  </c:if>
                  <c:if test="${not empty plant.plant_flowercolor}">
                    <div class="pview-fact"><span>꽃 색</span><b><c:out value="${plant.plant_flowercolor}"/></b></div>
                  </c:if>
                  <c:if test="${not empty plant.plant_flowersize}">
                    <div class="pview-fact"><span>꽃 지름</span><b><c:out value="${plant.plant_flowersize}"/></b></div>
                  </c:if>
                  <c:if test="${not empty plant.plant_bloomtime}">
                    <div class="pview-fact"><span>개화 시기</span><b><c:out value="${plant.plant_bloomtime}"/></b></div>
                  </c:if>
                  <c:if test="${not empty plant.plant_fruitcolor}">
                    <div class="pview-fact"><span>과일 색</span><b><c:out value="${plant.plant_fruitcolor}"/></b></div>
                  </c:if>
                  <c:if test="${not empty plant.plant_harvesttime}">
                    <div class="pview-fact"><span>수확 시기</span><b><c:out value="${plant.plant_harvesttime}"/></b></div>
                  </c:if>
                </div>
              </section>
            </c:if>

            <!-- 관리 -->
            <c:if test="${hasCare}">
              <section id="sec-care" class="pview-card">
                <h2 class="pview-card__title">관리</h2>

                <div class="pview-care">
                  <c:if test="${not empty plant.plant_growthseason}">
                    <div class="pview-care__item"><span>성장기</span><b><c:out value="${plant.plant_growthseason}"/></b></div>
                  </c:if>
                  <c:if test="${not empty plant.plant_growthrate}">
                    <div class="pview-care__item"><span>성장률</span><b><c:out value="${plant.plant_growthrate}"/></b></div>
                  </c:if>
                  <c:if test="${not empty plant.plant_dormancy}">
                    <div class="pview-care__item"><span>휴면</span><b><c:out value="${plant.plant_dormancy}"/></b></div>
                  </c:if>

                  <c:if test="${plant.plant_temperature_imin ne 0 or plant.plant_temperature_imax ne 0}">
                    <div class="pview-care__item">
                      <span>이상적 적정 온도</span>
                      <b>${plant.plant_temperature_imin}~${plant.plant_temperature_imax}°C</b>
                    </div>
                  </c:if>
                </div>
              </section>
            </c:if>

            <!-- 상징·가치 -->
            <c:if test="${hasCulture}">
              <section id="sec-culture" class="pview-card">
                <h2 class="pview-card__title">상징·가치</h2>

                <c:if test="${not empty plant.plant_culture_symbolism}">
                  <h3 class="pview-subtitle">상징</h3>
                  <p class="pview-text"><c:out value="${plant.plant_culture_symbolism}"/></p>
                </c:if>

                <c:if test="${not empty plant.plant_culture_if}">
                  <h3 class="pview-subtitle">흥미로운 사실</h3>
                  <p class="pview-text"><c:out value="${plant.plant_culture_if}"/></p>
                </c:if>

                <div class="pview-values">
                  <c:if test="${not empty plant.plant_culture_epv}">
                    <div class="pview-value"><span>환경 보호 가치</span><p><c:out value="${plant.plant_culture_epv}"/></p></div>
                  </c:if>
                  <c:if test="${not empty plant.plant_culture_ev}">
                    <div class="pview-value"><span>경제적 가치</span><p><c:out value="${plant.plant_culture_ev}"/></p></div>
                  </c:if>
                  <c:if test="${not empty plant.plant_culture_biv}">
                    <div class="pview-value"><span>미용 개선 가치</span><p><c:out value="${plant.plant_culture_biv}"/></p></div>
                  </c:if>
                  <c:if test="${not empty plant.plant_culture_gu}">
                    <div class="pview-value"><span>정원 용도</span><p><c:out value="${plant.plant_culture_gu}"/></p></div>
                  </c:if>
                </div>
              </section>
            </c:if>

            <!-- 독성 -->
            <c:if test="${hasToxicity}">
              <section id="sec-toxicity" class="pview-card pview-card--warn">
                <h2 class="pview-card__title">독성</h2>
                <p class="pview-text"><c:out value="${plant.plant_toxicity}"/></p>
              </section>
            </c:if>

          </article>

          <!-- 오른쪽 요약: 최소 정보만 (없으면 항목 숨김) -->
          <aside class="pview-aside">
            <div class="pview-aside__box">
              <h3 class="pview-aside__title">요약</h3>

              <ul class="pview-aside__list">
                <li><span>한글명</span><b><c:out value="${plant.plant_name_kor}"/></b></li>

                <c:if test="${not empty plant.plant_name}">
                  <li><span>영문명</span><b><c:out value="${plant.plant_name}"/></b></li>
                </c:if>

                <c:if test="${not empty plant.plant_type}">
                  <li><span>종류</span><b><c:out value="${plant.plant_type}"/></b></li>
                </c:if>

                <c:if test="${not empty plant.plant_lifespan}">
                  <li><span>수명</span><b><c:out value="${plant.plant_lifespan}"/></b></li>
                </c:if>

                <c:if test="${plant.plant_temperature_imin ne 0 or plant.plant_temperature_imax ne 0}">
                  <li><span>온도</span><b>${plant.plant_temperature_imin}~${plant.plant_temperature_imax}°C</b></li>
                </c:if>
              </ul>

              <div class="pview-aside__toc">
                <c:if test="${hasOverview}"><a href="#sec-overview">개요</a></c:if>
                <c:if test="${hasClassification}"><a href="#sec-classification">분류</a></c:if>
                <c:if test="${hasTraits}"><a href="#sec-traits">특징</a></c:if>
                <c:if test="${hasCare}"><a href="#sec-care">관리</a></c:if>
                <c:if test="${hasCulture}"><a href="#sec-culture">상징·가치</a></c:if>
                <c:if test="${hasToxicity}"><a href="#sec-toxicity">독성</a></c:if>
              </div>
            </div>
          </aside>

        </div>
      </c:if>

    </section>
  </main>

  <%@ include file="/WEB-INF/views/layout/footer.jsp" %>
</div>
