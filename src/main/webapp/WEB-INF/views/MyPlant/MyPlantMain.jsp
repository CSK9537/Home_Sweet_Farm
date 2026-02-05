<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/MyPlantMain.css">

<jsp:include page="/WEB-INF/views/layout/header.jsp" />

<div class="page-shell">
  <section class="content-wrap">
    <div class="content-card myplants">

      <!-- 상단 타이틀 + 버튼 -->
      <div class="myplants__header">
        <h2 class="myplants__title">나의 식물</h2>

        <a class="mp-btn mp-btn--primary"
           href="${pageContext.request.contextPath}/my-plants/new">
          나의식물 추가
        </a>
      </div>

      <!-- 식물 없음 / 있음 분기 -->
      <c:choose>
        <c:when test="${empty myPlants}">
          <!-- Empty State -->
          <div class="myplants-empty">
            <p class="myplants-empty__title">아직 반려식물이 없으신가요?a</p>
            <p class="myplants-empty__desc">추천 받으시고 키워보세요.</p>

            <a class="mp-btn mp-btn--ghost"
               href="${pageContext.request.contextPath}/guide/recommend">
              	추천가이드로 이동
            </a>
          </div>
        </c:when>

        <c:otherwise>
          <!-- List State -->
          <ul class="myplants-list">
            <c:forEach var="p" items="${myPlants}">
              <li class="plant-item">

                <!-- 썸네일 -->
                <div class="plant-item__thumb">
                  <c:choose>
                    <c:when test="${not empty p.imageUrl}">
                      <img src="${p.imageUrl}" alt="${p.koreanName}" />
                    </c:when>
                    <c:otherwise>
                      <div class="plant-item__thumb-placeholder">식물 사진</div>
                    </c:otherwise>
                  </c:choose>
                </div>

                <!-- 이름/학명 -->
                <div class="plant-item__info">
                  <div class="plant-item__names">
                    <div class="plant-item__korean">
                      <strong>${p.koreanName}</strong>
                    </div>
                    <div class="plant-item__latin">${p.latinName}</div>
                  </div>

                  <div class="plant-item__nickname">${p.nickname}</div>
                </div>

                <!-- 상태 -->
                <div class="plant-item__status">
                  <div class="plant-item__status-title">식물 상태</div>

                  <div class="status-grid">
                    <div class="status">
                      <img class="status__label" src="${pageContext.request.contextPath}/resources/images/Illumination.jpg" alt="Illumination" />
                      <span class="status__value status__value--warn">${p.lux}lux</span>
                    </div>
                    <div class="status">
                      <img class="status__label" src="${pageContext.request.contextPath}/resources/images/Humidity.jpg" alt="Humidity" />
                      <span class="status__value status__value--good">${p.humidity}%RH</span>
                    </div>
                    <div class="status">
                      <img class="status__label" src="${pageContext.request.contextPath}/resources/images/Temperature.jpg" alt="Temperature" />
                      <span class="status__value status__value--bad">${p.temperature}℃</span>
                    </div>
                    <div class="status">
                      <img class="status__label" src="${pageContext.request.contextPath}/resources/images/soil.jpg" alt="soil" />
                      <span class="status__value status__value--bad">${p.battery}V</span>
                    </div>
                  </div>
                </div>

                <!-- 우측: 등록일 + 상세 -->
                <div class="plant-item__actions">
                  <div class="plant-item__since">
                    	등록일로부터 <strong>${p.daysSince}</strong>일
                  </div>

                  <a class="mp-btn mp-btn--primary mp-btn--block"
                     href="${pageContext.request.contextPath}/my-plants/detail?id=${p.id}">
                    	나의 식물 상세 정보
                  </a>
                </div>

              </li>
            </c:forEach>
          </ul>
        </c:otherwise>
      </c:choose>

    </div>
  </section>
</div>

<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
