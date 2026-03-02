<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
    
<!-- 나의 식물 추가 모달 -->
<div class="mpm-modal" id="addPlantModal" aria-hidden="true">
  <div class="mpm-modal__backdrop" data-insert-close></div>

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
    <!-- <form id="plantPickForm" method="get" action="${pageContext.request.contextPath}/my-plants/new"> -->  
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
		<div class="mpm-modal__nickname">
      <div class="mpm-modal__footer">
        <button type="button" class="mp-btn mpm-btn--secondary" data-modal-close>취소</button>
        <button type="submit" class="mp-btn mp-btn--primary mpm-btn--primary" id="confirmAddPlant" disabled>
          	추가
        </button>
      </div>
    <!-- </form> -->
  </div>
  </div>
</div>

<script src="${pageContext.request.contextPath}/resources/js/myplant/MyPlantInsertModal.js"></script>