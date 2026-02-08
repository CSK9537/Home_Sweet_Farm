<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/MyPlant/MyPlantMain.css">

<jsp:include page="/WEB-INF/views/layout/header.jsp" />

<div class="page-shell">
  <section class="content-wrap">
    <div class="content-card myplants">

      <!-- 상단 타이틀 + 버튼 -->
      <div class="myplants__header">
        <h2 class="myplants__title">나의 식물</h2>
        <button class="mp-btn mp-btn--primary" type="button" id="openAddPlantModal">
		  	나의식물 추가
		</button>
      </div>

      <!-- 식물 없음 / 있음 분기 -->
      <c:choose>
        <c:when test="${empty myPlants}">
          <!-- Empty State -->
          <div class="myplants-empty">
            <p class="myplants-empty__title">아직 반려식물이 없으신가요?</p>
            <p class="myplants-empty__desc">추천 받으시고 키워보세요.</p>

            <a class="mp-btn mp-btn--ghost" href="${pageContext.request.contextPath}/guide/recommend">
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

<!-- 모달영역 -->
<!-- 나의 식물 추가 모달 -->
<div class="mpm-modal" id="addPlantModal" aria-hidden="true">
  <div class="mpm-modal__backdrop" data-modal-close></div>

  <div class="mpm-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="mpmModalTitle">
    <div class="mpm-modal__header">
      <h3 class="mpm-modal__title" id="mpmModalTitle">어떤 식물인가요?</h3>
    </div>

    <!-- 검색창 -->
    <div class="mpm-modal__search">
      <span class="mpm-modal__search-icon" aria-hidden="true">⌕</span>
      <input
        type="text"
        id="plantSearchInput"
        class="mpm-modal__search-input"
        placeholder="식물 검색"
        autocomplete="off"
      />
    </div>

    <div class="mpm-modal__divider"></div>

    <!-- 선택한 식물 정보를 다음 단계로 넘길 폼(필요시 action 변경) -->
    <form id="plantPickForm" method="get" action="${pageContext.request.contextPath}/my-plants/new">
      <input type="hidden" name="plantId" id="pickedPlantId" value="" />

      <ul class="mpm-list" id="plantPickList">
        <c:forEach var="p" items="${recommendedPlants}">
          <li class="mpm-item">
            <label class="mpm-item__row">
              <input class="mpm-item__radio" type="radio" name="pick"
                     value="${p.plantId}" data-name="${p.koreanName}" data-latin="${p.latinName}" />
              <span class="mpm-item__thumb">
                <img
                  src="<c:out value='${empty p.imageUrl ? (pageContext.request.contextPath.concat("/resources/image/Default_Plant.jpg")) : p.imageUrl}'/>"
                  alt="<c:out value='${p.koreanName}'/>"
                />
              </span>
              <span class="mpm-item__text">
                <span class="mpm-item__korean"><c:out value="${p.koreanName}"/></span>
                <span class="mpm-item__latin"><c:out value="${p.latinName}"/></span>
              </span>
            </label>
          </li>
        </c:forEach>
      </ul>

      <div class="mpm-modal__footer">
        <button type="button" class="mp-btn mpm-btn--secondary" data-modal-close>취소</button>
        <button type="submit" class="mp-btn mp-btn--primary mpm-btn--primary" id="confirmAddPlant" disabled>
          	추가
        </button>
      </div>
    </form>
  </div>
</div>

<script defer src="${pageContext.request.contextPath}/resources/js/Myplant/MyPlantMainModal.js"></script>

<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
