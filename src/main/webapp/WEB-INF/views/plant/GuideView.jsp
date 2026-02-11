<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<jsp:include page="/WEB-INF/views/layout/header.jsp" />

<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/plant/GuideView.css" />

<c:set var="g" value="${guideInfo}" />

<div class="page-shell">
  <div class="content-wrap">
    <div class="content-card guide">

      <!-- 상단 헤더 -->
      <section class="guide-hero">
        <div class="guide-hero__titlebox">
          <h1 class="guide-hero__title">
            <c:choose>
              <c:when test="${not empty plantName}">${plantName}</c:when>
              <c:otherwise>식물 관리 가이드</c:otherwise>
            </c:choose>
          </h1>

          <c:if test="${not empty subtitle}">
            <p class="guide-hero__subtitle">${subtitle}</p>
          </c:if>
        </div>

        <c:if test="${not empty heroImageUrl}">
          <figure class="guide-hero__figure">
            <img class="guide-hero__img" src="${heroImageUrl}" alt="식물 이미지">
          </figure>
        </c:if>
      </section>

      <!-- 요약 카드(한 줄 정보들) -->
      <section class="guide-summary js-empty-scan">
        <h2 class="guide-section__title">기본 정보</h2>

        <div class="summary-grid">
          <c:if test="${not empty g.guide_carelevel}">
            <div class="summary-item">
              <span class="summary-item__label">관리 수준</span>
              <span class="summary-item__value">${g.guide_carelevel}</span>
            </div>
          </c:if>

          <c:if test="${not empty g.guide_caredifficulty}">
            <div class="summary-item">
              <span class="summary-item__label">관리 난이도</span>
              <span class="summary-item__value">${g.guide_caredifficulty}</span>
            </div>
          </c:if>

          <c:if test="${not empty g.guide_toughness}">
            <div class="summary-item">
              <span class="summary-item__label">강도(인성)</span>
              <span class="summary-item__value">${g.guide_toughness}</span>
            </div>
          </c:if>

          <c:if test="${not empty g.guide_lifespan}">
            <div class="summary-item">
              <span class="summary-item__label">수명</span>
              <span class="summary-item__value">${g.guide_lifespan}</span>
            </div>
          </c:if>

          <c:if test="${not empty g.guide_hardinesszone}">
            <div class="summary-item">
              <span class="summary-item__label">내한성 구역</span>
              <span class="summary-item__value">${g.guide_hardinesszone}</span>
            </div>
          </c:if>

          <c:if test="${not empty g.guide_toxicity}">
            <div class="summary-item">
              <span class="summary-item__label">독성</span>
              <span class="summary-item__value">${g.guide_toxicity}</span>
            </div>
          </c:if>
        </div>
      </section>

      <!-- 관리 팁 -->
      <c:if test="${not empty g.guide_caretip}">
        <section class="guide-section js-empty-scan">
          <div class="guide-section__head">
            <h2 class="guide-section__title">관리 팁</h2>
          </div>
          <article class="guide-article">
            <p class="guide-text">${g.guide_caretip}</p>
          </article>
        </section>
      </c:if>

      	<!-- 급수 -->
		<c:if test="${not empty g.guide_watering_schedule 
		             or not empty g.guide_watering_humiditylevel 
		             or not empty g.guide_watering_content}">
		             
		  <section class="guide-section js-empty-scan">
		    <div class="guide-section__head">
		      <h2 class="guide-section__title">급수 방법</h2>
		    </div>
		
		    <div class="guide-kv">
		
		      <c:if test="${not empty g.guide_watering_schedule}">
		        <div class="guide-kv__row">
		          <span class="guide-kv__label">급수 일정(주기)</span>
		          <span class="guide-kv__value">
		            ${g.guide_watering_schedule}
		          </span>
		        </div>
		      </c:if>
		
		      <c:if test="${not empty g.guide_watering_humiditylevel}">
		        <div class="guide-kv__row">
		          <span class="guide-kv__label">급수 습도 수준</span>
		          <span class="guide-kv__value">
		            ${g.guide_watering_humiditylevel}
		          </span>
		        </div>
		      </c:if>
		
		    </div>
		
		    <c:if test="${not empty g.guide_watering_content}">
		      <article class="guide-article">
		        <p class="guide-text">
		          ${g.guide_watering_content}
		        </p>
		      </article>
		    </c:if>
		
		  </section>
		</c:if>


      <!-- 햇빛 -->
      <c:if test="${not empty g.guide_sunlight_requirements or not empty g.guide_sunlight_tolerance or not empty g.guide_sunlight_content}">
        <section class="guide-section js-empty-scan">
          <div class="guide-section__head">
            <h2 class="guide-section__title">햇빛(일조량)</h2>
          </div>

          <div class="guide-kv">
            <c:if test="${not empty g.guide_sunlight_requirements}">
              <div class="guide-kv__row">
                <span class="guide-kv__label">햇빛 요건</span>
                <span class="guide-kv__value">${g.guide_sunlight_requirements}</span>
              </div>
            </c:if>

            <c:if test="${not empty g.guide_sunlight_tolerance}">
              <div class="guide-kv__row">
                <span class="guide-kv__label">일조량 허용 오차</span>
                <span class="guide-kv__value">${g.guide_sunlight_tolerance}</span>
              </div>
            </c:if>
          </div>

          <c:if test="${not empty g.guide_sunlight_content}">
            <article class="guide-article">
              <p class="guide-text">${g.guide_sunlight_content}</p>
            </article>
          </c:if>
        </section>
      </c:if>

      <!-- 온도 -->
      <c:if test="${g.guide_temperature_imin ne 0 or g.guide_temperature_imax ne 0 or g.guide_temperature_tmin ne 0 or g.guide_temperature_tmax ne 0 or not empty g.guide_temperature_content}">
        <section class="guide-section js-empty-scan">
          <div class="guide-section__head">
            <h2 class="guide-section__title">온도</h2>
          </div>

          <div class="temp-grid">
            <c:if test="${g.guide_temperature_imin ne 0 or g.guide_temperature_imax ne 0}">
              <div class="temp-card">
                <h3 class="temp-card__title">이상적 범위</h3>
                <p class="temp-card__value">
                  <c:choose>
                    <c:when test="${g.guide_temperature_imin ne 0 and g.guide_temperature_imax ne 0}">
                      ${g.guide_temperature_imin} ~ ${g.guide_temperature_imax}℃
                    </c:when>
                    <c:when test="${g.guide_temperature_imin ne 0}">
                      최저 ${g.guide_temperature_imin}℃
                    </c:when>
                    <c:otherwise>
                      최고 ${g.guide_temperature_imax}℃
                    </c:otherwise>
                  </c:choose>
                </p>
              </div>
            </c:if>

            <c:if test="${g.guide_temperature_tmin ne 0 or g.guide_temperature_tmax ne 0}">
              <div class="temp-card">
                <h3 class="temp-card__title">허용 오차 범위</h3>
                <p class="temp-card__value">
                  <c:choose>
                    <c:when test="${g.guide_temperature_tmin ne 0 and g.guide_temperature_tmax ne 0}">
                      ${g.guide_temperature_tmin} ~ ${g.guide_temperature_tmax}℃
                    </c:when>
                    <c:when test="${g.guide_temperature_tmin ne 0}">
                      최저 ${g.guide_temperature_tmin}℃
                    </c:when>
                    <c:otherwise>
                      최고 ${g.guide_temperature_tmax}℃
                    </c:otherwise>
                  </c:choose>
                </p>
              </div>
            </c:if>
          </div>

          <c:if test="${not empty g.guide_temperature_content}">
            <article class="guide-article">
              <p class="guide-text">${g.guide_temperature_content}</p>
            </article>
          </c:if>
        </section>
      </c:if>

      <!-- 토양 -->
      <c:if test="${not empty g.guide_soil_type or not empty g.guide_soil_ph or not empty g.guide_soil_composition or not empty g.guide_soil_content}">
        <section class="guide-section js-empty-scan">
          <div class="guide-section__head">
            <h2 class="guide-section__title">토양</h2>
          </div>

          <div class="guide-kv">
            <c:if test="${not empty g.guide_soil_type}">
              <div class="guide-kv__row">
                <span class="guide-kv__label">토양 종류</span>
                <span class="guide-kv__value">${g.guide_soil_type}</span>
              </div>
            </c:if>

            <c:if test="${not empty g.guide_soil_ph}">
              <div class="guide-kv__row">
                <span class="guide-kv__label">토양 pH</span>
                <span class="guide-kv__value">${g.guide_soil_ph}</span>
              </div>
            </c:if>

            <c:if test="${not empty g.guide_soil_composition}">
              <div class="guide-kv__row">
                <span class="guide-kv__label">토양 구성</span>
                <span class="guide-kv__value">${g.guide_soil_composition}</span>
              </div>
            </c:if>
          </div>

          <c:if test="${not empty g.guide_soil_content}">
            <article class="guide-article">
              <p class="guide-text">${g.guide_soil_content}</p>
            </article>
          </c:if>
        </section>
      </c:if>

      <!-- 비료 -->
      <c:if test="${not empty g.guide_fertilizing_content}">
        <section class="guide-section js-empty-scan">
          <div class="guide-section__head">
            <h2 class="guide-section__title">비료</h2>
          </div>
          <article class="guide-article">
            <p class="guide-text">${g.guide_fertilizing_content}</p>
          </article>
        </section>
      </c:if>

      <!-- 가지치기 -->
      <c:if test="${not empty g.guide_pruning_time or not empty g.guide_pruning_benefits or not empty g.guide_pruning_content}">
        <section class="guide-section js-empty-scan">
          <div class="guide-section__head">
            <h2 class="guide-section__title">가지치기</h2>
          </div>

          <div class="guide-kv">
            <c:if test="${not empty g.guide_pruning_time}">
              <div class="guide-kv__row">
                <span class="guide-kv__label">가지치기 시기</span>
                <span class="guide-kv__value">${g.guide_pruning_time}</span>
              </div>
            </c:if>

            <c:if test="${not empty g.guide_pruning_benefits}">
              <div class="guide-kv__row">
                <span class="guide-kv__label">가지치기 장점</span>
                <span class="guide-kv__value">${g.guide_pruning_benefits}</span>
              </div>
            </c:if>
          </div>

          <c:if test="${not empty g.guide_pruning_content}">
            <article class="guide-article">
              <p class="guide-text">${g.guide_pruning_content}</p>
            </article>
          </c:if>
        </section>
      </c:if>

      <!-- 번식 -->
      <c:if test="${not empty g.guide_propagation_time or not empty g.guide_propagation_type or not empty g.guide_propagation_content}">
        <section class="guide-section js-empty-scan">
          <div class="guide-section__head">
            <h2 class="guide-section__title">번식</h2>
          </div>

          <div class="guide-kv">
            <c:if test="${not empty g.guide_propagation_time}">
              <div class="guide-kv__row">
                <span class="guide-kv__label">번식 시기</span>
                <span class="guide-kv__value">${g.guide_propagation_time}</span>
              </div>
            </c:if>

            <c:if test="${not empty g.guide_propagation_type}">
              <div class="guide-kv__row">
                <span class="guide-kv__label">번식 유형</span>
                <span class="guide-kv__value">${g.guide_propagation_type}</span>
              </div>
            </c:if>
          </div>

          <c:if test="${not empty g.guide_propagation_content}">
            <article class="guide-article">
              <p class="guide-text">${g.guide_propagation_content}</p>
            </article>
          </c:if>
        </section>
      </c:if>

      <!-- 옮겨심기 -->
      <c:if test="${not empty g.guide_transplanting_time or not empty g.guide_transplanting_content}">
        <section class="guide-section js-empty-scan">
          <div class="guide-section__head">
            <h2 class="guide-section__title">옮겨심기</h2>
          </div>

          <c:if test="${not empty g.guide_transplanting_time}">
            <div class="guide-kv">
              <div class="guide-kv__row">
                <span class="guide-kv__label">옮겨심기 시기</span>
                <span class="guide-kv__value">${g.guide_transplanting_time}</span>
              </div>
            </div>
          </c:if>

          <c:if test="${not empty g.guide_transplanting_content}">
            <article class="guide-article">
              <p class="guide-text">${g.guide_transplanting_content}</p>
            </article>
          </c:if>
        </section>
      </c:if>

      <!-- 심기 -->
      <c:if test="${not empty g.guide_planting_time or not empty g.guide_planting_content}">
        <section class="guide-section js-empty-scan">
          <div class="guide-section__head">
            <h2 class="guide-section__title">심기</h2>
          </div>

          <c:if test="${not empty g.guide_planting_time}">
            <div class="guide-kv">
              <div class="guide-kv__row">
                <span class="guide-kv__label">심는 시기</span>
                <span class="guide-kv__value">${g.guide_planting_time}</span>
              </div>
            </div>
          </c:if>

          <c:if test="${not empty g.guide_planting_content}">
            <article class="guide-article">
              <p class="guide-text">${g.guide_planting_content}</p>
            </article>
          </c:if>
        </section>
      </c:if>

      <!-- 분갈이 -->
      <c:if test="${not empty g.guide_repotting_schedule or not empty g.guide_repotting_content}">
        <section class="guide-section js-empty-scan">
          <div class="guide-section__head">
            <h2 class="guide-section__title">분갈이</h2>
          </div>

          <c:if test="${not empty g.guide_repotting_schedule}">
            <div class="guide-kv">
              <div class="guide-kv__row">
                <span class="guide-kv__label">분갈이 일정</span>
                <span class="guide-kv__value">${g.guide_repotting_schedule}</span>
              </div>
            </div>
          </c:if>

          <c:if test="${not empty g.guide_repotting_content}">
            <article class="guide-article">
              <p class="guide-text">${g.guide_repotting_content}</p>
            </article>
          </c:if>
        </section>
      </c:if>

      <!-- 수확 -->
      <c:if test="${not empty g.guide_harvest_time or not empty g.guide_harvest_content}">
        <section class="guide-section js-empty-scan">
          <div class="guide-section__head">
            <h2 class="guide-section__title">수확</h2>
          </div>

          <c:if test="${not empty g.guide_harvest_time}">
            <div class="guide-kv">
              <div class="guide-kv__row">
                <span class="guide-kv__label">수확 시기</span>
                <span class="guide-kv__value">${g.guide_harvest_time}</span>
              </div>
            </div>
          </c:if>

          <c:if test="${not empty g.guide_harvest_content}">
            <article class="guide-article">
              <p class="guide-text">${g.guide_harvest_content}</p>
            </article>
          </c:if>
        </section>
      </c:if>

      <!-- 아무 데이터도 없을 때 -->
      <c:if test="${empty g}">
        <section class="guide-empty">
          <h2 class="guide-empty__title">가이드 데이터가 없습니다</h2>
          <p class="guide-empty__desc">관리 정보가 등록되면 이 화면에 표시됩니다.</p>
        </section>
      </c:if>

    </div>
  </div>
</div>

<script defer src="${pageContext.request.contextPath}/resources/js/GuideView.js"></script>

<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
