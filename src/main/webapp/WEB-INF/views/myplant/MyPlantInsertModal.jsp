<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
    
<div class="mpm-modal" id="addPlantModal" aria-hidden="true">
  <div class="mpm-modal__backdrop" data-insert-close></div>

  <div class="mpm-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="mpmModalTitle">
    <!-- 1. 식물 선택 -->
    <div id="mpmStep1">
      <div class="mpm-modal__header">
        <h3 class="mpm-modal__title" id="mpmModalTitle">어떤 식물인가요?</h3>
      </div>

      <div class="mpm-modal__search">
        <span class="mpm-modal__search-icon" aria-hidden="true">⌕</span>
        <input type="text" id="plantSearchInput" class="mpm-modal__search-input" placeholder="식물 검색" autocomplete="off" />
      </div>

      <input type="hidden" name="plantId" id="pickedPlantId" value="" />

      <ul class="mpm-list" id="plantPickList">
        <c:forEach var="p" items="${recommendedPlants}">
          <li class="mpm-item">
            <label class="mpm-item__row">
              <input class="mpm-item__radio" type="radio" name="pick" value="${p.plantId}" data-name="${p.koreanName}" data-latin="${p.latinName}" />
              <span class="mpm-item__thumb">
                <img src="<c:out value='${empty p.imageUrl ? (pageContext.request.contextPath.concat("/resources/image/Default_Plant.jpg")) : p.imageUrl}'/>" alt="<c:out value='${p.koreanName}'/>" />
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
        <button type="button" class="mp-btn mpm-btn--secondary" data-insert-close>취소</button>
        <button type="button" class="mp-btn mp-btn--primary mpm-btn--primary" id="btnNextStep" disabled>다음</button>
      </div>
    </div>
    
    <!-- 식물 이름 -->
    <div id="mpmStep2" style="display: none;">
      <div class="mpm-modal__header">
        <h3 class="mpm-modal__title">식물의 이름을 지어주세요</h3>
      </div>

      <div class="mpm-selected-preview">
        <div class="mpm-item__thumb" id="previewThumb"></div>
        <div class="mpm-item__text">
          <span class="mpm-item__korean" id="previewName"></span>
          <span class="mpm-item__latin" id="previewLatin"></span>
        </div>
      </div>

      <div class="mpm-modal__search" style="margin-top: 20px;">
        <input type="text" id="plantNicknameInput" name="nickname" class="mpm-modal__search-input" style="padding-left: 14px;" placeholder="예: 초록이, 몬스테라 (최대 10자)" autocomplete="off" />
      </div>

      <div class="mpm-modal__footer">
        <button type="button" class="mp-btn mpm-btn--secondary" id="btnPrevStep">이전</button>
        <button type="submit" class="mp-btn mp-btn--primary mpm-btn--primary" id="confirmAddPlant" disabled>추가 완료</button>
      </div>
    </div>

  </div>
</div>

<script src="${pageContext.request.contextPath}/resources/js/myplant/MyPlantInsertModal.js"></script>