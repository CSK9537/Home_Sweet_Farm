<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<link rel="stylesheet" href="/resources/css/myplant/MyPlantMain.css">

<jsp:include page="/WEB-INF/views/layout/header.jsp" />

<div class="page-shell">
  <section class="content-wrap">
    <div class="content-card myplants">

      <div class="myplants__header">
        <h2 class="myplants__title">나의 식물</h2>
        <c:if test="${not empty sessionScope.loginUser}">
        <button class="mp-btn mp-btn--primary" type="button" id="openAddPlantModal" data-insert-open>
		  	나의 식물 추가
		</button>
		</c:if>
      </div>
      
      <c:choose>
        <c:when test="${empty sessionScope.loginUser}">
          <div class="myplants-empty">
            <p class="myplants-empty__title">나의 식물 관리 서비스를 이용하고 싶으신가요?</p>
            <p class="myplants-empty__desc">로그인 후 이용하실 수 있습니다.</p>

            <a class="mp-btn mp-btn--ghost" href="/user/login?redirect=/myplant">
              	로그인
            </a>
          </div>
        </c:when>
        
        <c:when test="${not empty sessionScope.loginUser and empty myPlants}">
          <div class="myplants-empty">
            <p class="myplants-empty__title">아직 반려식물이 없으신가요?</p>
            <p class="myplants-empty__desc">추천 받으시고 키워보세요.</p>

            <a class="mp-btn mp-btn--ghost" href="/myplant/recommend">
              	추천가이드로 이동
            </a>
          </div>
        </c:when>

        <c:otherwise>
          <!-- List State -->
          <ul class="myplants-list">
            <c:forEach var="p" items="${myPlants}">
              <li class="plant-item" data-plant-id="${p.myplant_id}">

                <!-- 썸네일 -->
                <div class="plant-item__thumb">
                  <c:choose>
                    <c:when test="${not empty p.myplant_image}">
                      <img class="plant-item__img" src="/myplant/image/show?fileName=${p.myplant_image}" alt="${p.plant_name_kor}" />
                    </c:when>
                    <c:when test="${not empty p.plant_image}">
                      <img class="plant-item__img" src="/plant/image/${p.plant_image}" alt="${p.plant_name_kor}" />
                    </c:when>
                    <c:otherwise>
                       <img class="plant-item__img" src="${pageContext.request.contextPath}/resources/image/Default_Plant.jpg" alt="기본 식물 이미지" />
                    </c:otherwise>
                  </c:choose>
                </div>

                <!-- 이름/학명 -->
                <div class="plant-item__info">
                  
                  <div class="plant-item__nickname">${p.myplant_name}</div>
                  
                  <div class="plant-item__names">
                    <div class="plant-item__korean">
                      <strong>${p.plant_name_kor}</strong>
                    </div>
                    <div class="plant-item__latin">${p.plant_name}</div>
                  </div>

                </div>

                <!-- 상태 -->
                <div class="plant-item__status">
                  <div class="plant-item__status-title">식물 상태</div>

                  <div class="status-grid">
                    <div class="status">
                      <img class="status__label" src="${pageContext.request.contextPath}/resources/image/light_50x50.png" alt="light" />
                      <span class="status__value status__value--warn" id="realtimeLux_${p.myplant_id}">다소 낮음</span>
                    </div>
                    <div class="status">
                      <img class="status__label" src="${pageContext.request.contextPath}/resources/image/humidity_50x50.png" alt="humidity" />
                      <span class="status__value status__value--good" id="realtimeHumi_${p.myplant_id}">적정</span>
                    </div>
                    <div class="status">
                      <img class="status__label" src="${pageContext.request.contextPath}/resources/image/temperature_50x50.png" alt="temperature" />
                      <span class="status__value status__value--bad" id="realtimeTemp_${p.myplant_id}">매우 높음</span>
                    </div>
                    <div class="status">
                      <img class="status__label" src="${pageContext.request.contextPath}/resources/image/soil_50x50.png" alt="soil" />
                      <span class="status__value status__value--bad" id="realtimeSoilMoist_${p.myplant_id}">매우 낮음</span>
                    </div>
                  </div>
                </div>

                <!-- 우측: 등록일 + 상세 -->
                <div class="plant-item__actions">
                  <div class="plant-item__since">
                    	등록일로부터 <strong>${p.day_passed}</strong>일
                  </div>

                  <a class="mp-btn mp-btn--primary mp-btn--block"
                     href="${pageContext.request.contextPath}/myplant/info/${p.myplant_id}">
                    	상세 정보
                  </a>
                  
                  <p class="mp-btn mp-btn--primary mp-btn--block removeMyPlant">
                    	삭제
                  </p>
                </div>

              </li>
            </c:forEach>
          </ul>
        </c:otherwise>
      </c:choose>
    </div>
  </section>
</div>

<jsp:include page="/WEB-INF/views/myplant/MyPlantInsertModal.jsp" />

<script src="${pageContext.request.contextPath}/resources/js/myplant/MyPlantMain.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
