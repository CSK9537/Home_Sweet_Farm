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
		  	나의식물 추가
		</button>
		</c:if>
      </div>
      
      <c:choose>
        <c:when test="${empty sessionScope.loginUser}">
          <div class="myplants-empty">
            <p class="myplants-empty__title">나의 식물 관리 서비스를 이용하고 싶으신가요?</p>
            <p class="myplants-empty__desc">로그인 후 이용하실 수 있습니다.</p>

            <a class="mp-btn mp-btn--ghost" href="/user/login">
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
              <li class="plant-item">

                <!-- 썸네일 -->
                <div class="plant-item__thumb">
                  <c:choose>
                    <c:when test="${not empty p.imageUrl}">
                      <img class="plant-item__img" src="${p.imageUrl}" alt="${p.koreanName}" />
                    </c:when>
                    <c:otherwise>
                       <img class="plant-item__img" src="${pageContext.request.contextPath}/resources/image/Default_Plant.jpg" alt="기본 식물 이미지" />
                    </c:otherwise>
                  </c:choose>
                </div>

                <!-- 이름/학명 -->
                <div class="plant-item__info">
                  <div class="plant-item__names">
                    <div class="plant-item__korean">
                      <strong>${p.koreanName}식물이름</strong>
                    </div>
                    <div class="plant-item__latin">${p.latinName}식물학술명</div>
                  </div>

                  <div class="plant-item__nickname">${p.nickname}식물닉네임</div>
                </div>

                <!-- 상태 -->
                <div class="plant-item__status">
                  <div class="plant-item__status-title">식물 상태</div>

                  <div class="status-grid">
                    <div class="status">
                      <img class="status__label" src="${pageContext.request.contextPath}/resources/image/light_50x50.png" alt="light" />
                      <span class="status__value status__value--warn">${p.lux}100lux</span>
                    </div>
                    <div class="status">
                      <img class="status__label" src="${pageContext.request.contextPath}/resources/image/humidity_50x50.png" alt="humidity" />
                      <span class="status__value status__value--good">${p.humidity}100%RH</span>
                    </div>
                    <div class="status">
                      <img class="status__label" src="${pageContext.request.contextPath}/resources/image/temperature_50x50.png" alt="temperature" />
                      <span class="status__value status__value--bad">${p.temperature}100℃</span>
                    </div>
                    <div class="status">
                      <img class="status__label" src="${pageContext.request.contextPath}/resources/image/soil_50x50.png" alt="soil" />
                      <span class="status__value status__value--bad">${p.battery}100V</span>
                    </div>
                  </div>
                </div>

                <!-- 우측: 등록일 + 상세 -->
                <div class="plant-item__actions">
                  <div class="plant-item__since">
                    	등록일로부터 <strong>${p.daysSince}100</strong>일
                  </div>

                  <a class="mp-btn mp-btn--primary mp-btn--block"
                     href="${pageContext.request.contextPath}/my-plants/detail?id=${p.id}">
                    	상세 정보
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

<jsp:include page="/WEB-INF/views/myplant/MyPlantInsertModal.jsp" />

<script src="${pageContext.request.contextPath}/resources/js/myplant/MyPlantMain.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
