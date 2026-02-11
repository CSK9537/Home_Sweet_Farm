<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/myplant/MyPlantView.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/modal/ScheduleModal.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/modal/PotoModal.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/modal/StatsModal.css">

<jsp:include page="/WEB-INF/views/layout/header.jsp" />

<div class="page-shell">
  <section class="content-wrap">
    <div class="content-card plant-detail">

      <!-- 카드 내부 컨테이너 -->
      <div class="plant-detail__card">

        <!-- 좌: 이미지 -->
        <div class="plant-detail__media">
          <div class="plant-detail__photo">
            <c:choose>
              <c:when test="${not empty plant.imageUrl}">
                <img class="plant-detail__img" src="${plant.imageUrl}" alt="${plant.koreanName}" />
              </c:when>
              <c:otherwise>
                <img class="plant-detail__img plant-detail__img--default"
                     src="${pageContext.request.contextPath}/resources/image/Default_Plant.jpg"
                     alt="기본 식물 이미지" />
              </c:otherwise>
            </c:choose>
          </div>

          <!-- 사진 등록/추가 버튼 (상세일정/통계정보와 동일 스타일 + 큰 크기 유지) -->
          <button type="button"
                  class="btn btn--photo plant-detail__photo-btn"
                  data-open-photo-modal
                  data-plant-id="${plant.id}">
            사진 등록/추가
          </button>
        </div>

        <!-- 우: 정보 -->
        <div class="plant-detail__body">

          <!-- 상단: 닉네임/등록일 -->
          <div class="plant-detail__top">
            <div class="plant-detail__nickname">${plant.nickname}식물 닉네임</div>
            <div class="plant-detail__since">등록일로부터 ${plant.daysSince}100일</div>
          </div>

          <!-- 제목/설명 -->
          <div class="plant-detail__heading">
            <div class="plant-detail__name">
              <div class="plant-detail__korean">${plant.koreanName}식물이름</div>
              <div class="plant-detail__latin">${plant.latinName}식물학술명</div>
            </div>

            <p class="plant-detail__desc">
              ${plant.description}
            </p>

            <a class="plant-detail__guide-link"
               href="${pageContext.request.contextPath}/guide/detail?name=${plant.koreanName}">
              → 관리 가이드로 이동
            </a>
          </div>

          <!-- 상태/통계 -->
          <div class="plant-detail__section">
            <div class="plant-detail__section-head">
              <div class="plant-detail__section-title">식물 상태</div>

              <!-- 통계정보 버튼 (상세일정과 동일 스타일) -->
              <button type="button"
                      class="btn btn--sm"
                      data-open-stats-modal
                      data-plant-id="${plant.id}">
                	통계 정보
              </button>
            </div>

            <div class="status-grid">
              <div class="status">
                <span class="status__icon">
                  <img src="${pageContext.request.contextPath}/resources/image/light_50x50.png" alt="빛" />
                </span>
                <span class="status__value status__value--warn">${plant.lux}lux</span>
                <span class="status__text">조금 어두워요</span>
              </div>

              <div class="status">
                <span class="status__icon">
                  <img src="${pageContext.request.contextPath}/resources/image/humidity_50x50.png" alt="습도" />
                </span>
                <span class="status__value status__value--good">${plant.humidity}%RH</span>
                <span class="status__text">적당해요</span>
              </div>

              <div class="status">
                <span class="status__icon">
                  <img src="${pageContext.request.contextPath}/resources/image/temperature_50x50.png" alt="온도" />
                </span>
                <span class="status__value status__value--bad">${plant.temperature}℃</span>
                <span class="status__text">추워요</span>
              </div>

              <div class="status">
                <span class="status__icon">
                  <img src="${pageContext.request.contextPath}/resources/image/soil_50x50.png" alt="배터리" />
                </span>
                <span class="status__value status__value--bad">${plant.battery}V</span>
                <span class="status__text">말랐어요</span>
              </div>
            </div>
          </div>

          <!-- 일정 -->
          <div class="plant-detail__section plant-detail__schedule">
            <!-- schedule-head -> section-head 로 통일 -->
            <div class="plant-detail__section-head">
              <div class="plant-detail__section-title">일정</div>

              <!-- 상세일정 버튼 (기준 버튼) -->
              <button type="button"
                      class="btn btn--sm"
                      onclick="openScheduleModal(${plant.id});">
                상세 일정
              </button>
            </div>

            <p class="plant-detail__schedule-next">
              다음 일정 - <c:out value="${empty plant.nextSchedule ? '등록된 일정이 없어요' : plant.nextSchedule}" />
            </p>
          </div>

        </div>
      </div>
    </div>
  </section>
</div>

<!-- 모달 영역 -->
<!-- ===== Schedule Modal ===== -->
<div class="cal-modal" id="calModal" aria-hidden="true">
  <div class="cal-modal__backdrop" onclick="closeScheduleModal()"></div>

  <div class="cal-modal__panel" role="dialog" aria-modal="true" aria-label="상세 일정 모달">
    <header class="cal-modal__header">
      <div class="cal-modal__title">상세 일정</div>
      <button class="cal-btn cal-btn--ghost" type="button" onclick="calCancel()">닫기</button>
    </header>

    <div class="cal-modal__body">
      <!-- LEFT: Calendar -->
      <section class="cal">
        <div class="cal__top">
          <div class="cal__month">
            <span class="cal__month-kr" id="calMonthKr"></span>
            <span class="cal__month-en" id="calMonthEn"></span>
          </div>

          <div class="cal__nav">
            <button class="cal-btn cal-btn--ghost" type="button" onclick="calPrev()">이전</button>
            <button class="cal-btn cal-btn--ghost" type="button" onclick="calToday()">오늘</button>
            <button class="cal-btn cal-btn--ghost" type="button" onclick="calNext()">다음</button>
          </div>
        </div>

        <div class="cal__dow">
          <div>일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div>토</div>
        </div>
        <div class="cal__grid" id="calGrid"></div>
      </section>

      <!-- RIGHT: Memo palette (스케줄 추가 버튼) -->
      <aside class="cal-side">
        <div class="cal-side__head">
          <div class="cal-side__head-top">
            <div class="cal-side__title">Schedule</div>

            <div class="cal-side__actions">
              <button type="button" class="cal-btn cal-btn--ghost" onclick="calCancel()">취소</button>
              <button type="button" class="cal-btn cal-btn--primary" onclick="calSave()">저장</button>
            </div>
          </div>

          <div class="cal-side__date" id="memoDate">날짜를 선택하세요</div>
        </div>

        <div class="cal-side__palette" id="memoPalette">
          <button class="memo-item memo-item--water" type="button" draggable="true" data-type="water" data-title="물주기">물주기</button>
          <button class="memo-item memo-item--nutri" type="button" draggable="true" data-type="nutri" data-title="영양제">영양제</button>
          <button class="memo-item memo-item--repot" type="button" draggable="true" data-type="repot" data-title="분갈이">분갈이</button>
        </div>

        <div class="cal-side__hint">
          1) 날짜 클릭 후 버튼 클릭하면 해당 날짜에 추가<br/>
          2) 버튼을 드래그해서 날짜 칸에 드롭하면 그 날짜에 추가
        </div>

        <div class="cal-side__list">
          <div class="cal-side__list-title">선택 날짜 일정</div>
          <ul class="cal-list" id="scheduleList"></ul>
        </div>
      </aside>
    </div>
  </div>
</div>

<!-- ===== poto Modal ===== -->
<div class="photo-modal" id="photoModal" aria-hidden="true">
  <div class="photo-modal__backdrop" data-close-photo-modal></div>

  <div class="photo-modal__panel" role="dialog" aria-modal="true" aria-label="식물 사진 등록 모달">
    <header class="photo-modal__header">
      <div class="photo-modal__title">
        <span class="photo-modal__icon" aria-hidden="true"></span>
        사진 등록/추가
      </div>
      <button class="photo-modal__close" type="button" onclick="calCancel()">닫기</button>
    </header>

    <div class="photo-modal__body">
      <form class="photo-form"
            id="photoForm"
            method="post"
            enctype="multipart/form-data"
            action="${pageContext.request.contextPath}/my-plants/photo/upload">
        <input type="hidden" name="plantId" id="photoPlantId" value="${plant.id}" />

        <div class="photo-grid" id="photoGrid">
          <label class="photo-add">
            <input type="file"
                   id="photoInput"
                   name="files"
                   accept="image/*"
                   multiple
                   hidden />
            <div class="photo-add__inner">
              <div class="photo-add__badge">+</div>
              <div class="photo-add__text">사진 추가</div>
              <div class="photo-add__sub">JPG/PNG/GIF · 최대 10MB</div>
            </div>
          </label>
        </div>

        <div class="photo-meta">
          <div class="photo-meta__left">
            <div class="photo-meta__hint">선택한 사진은 미리보기 후 전송됩니다.</div>
            <div class="photo-meta__hint2">권장: 정사각형(1:1) 또는 세로 사진</div>
          </div>

          <div class="photo-progress" aria-hidden="true">
            <div class="photo-progress__bar"><span id="photoProgressBar"></span></div>
            <div class="photo-progress__txt" id="photoProgressTxt">0%</div>
          </div>
        </div>

        <footer class="photo-modal__footer">
          <button type="button" class="mp-btn mp-btn--ghost" id="photoResetBtn">초기화</button>
          <button type="submit" class="mp-btn mp-btn--primary" id="photoSubmitBtn">전송</button>
        </footer>
      </form>
    </div>
  </div>
</div>

<!-- ===== stats Modal ===== -->
<div class="stats-modal" id="statsModal" aria-hidden="true">
  <div class="stats-modal__backdrop" data-close-stats-modal></div>

  <div class="stats-modal__panel" role="dialog" aria-modal="true" aria-label="통계 정보 모달">
    <header class="stats-modal__header">
      <div class="stats-modal__tabs" role="tablist" aria-label="통계 기간">
        <button type="button" class="stats-tab is-active" data-range="HOURLY" role="tab" aria-selected="true">시간별</button>
        <button type="button" class="stats-tab" data-range="DAILY" role="tab" aria-selected="false">일별</button>
        <button type="button" class="stats-tab" data-range="MONTHLY" role="tab" aria-selected="false">월별</button>
      </div>

      <button type="button" class="stats-modal__close" onclick="calCancel()">닫기</button>
    </header>

    <div class="stats-modal__body">
      <section class="stats-card" data-metric="illumination">
        <div class="stats-card__head">
          <h4 class="stats-card__title">조도</h4>
          <button type="button" class="stats-detail-link" data-toggle-detail="illumination">상세 정보 보기</button>
        </div>
        <div class="stats-chart-wrap">
          <canvas class="stats-chart" id="chart-illumination"></canvas>
        </div>
        <div class="stats-detail" id="detail-illumination" hidden>
          <div class="stats-detail__table">
            <div class="stats-detail__thead">
              <span>일시</span><span>데이터</span>
            </div>
            <div class="stats-detail__tbody" data-detail-body="illumination"></div>
          </div>
        </div>
      </section>

      <section class="stats-card" data-metric="temperature">
        <div class="stats-card__head">
          <h4 class="stats-card__title">온도</h4>
          <button type="button" class="stats-detail-link" data-toggle-detail="temperature">상세 정보 보기</button>
        </div>
        <div class="stats-chart-wrap">
          <canvas class="stats-chart" id="chart-temperature"></canvas>
        </div>
        <div class="stats-detail" id="detail-temperature" hidden>
          <div class="stats-detail__table">
            <div class="stats-detail__thead">
              <span>일시</span><span>데이터</span>
            </div>
            <div class="stats-detail__tbody" data-detail-body="temperature"></div>
          </div>
        </div>
      </section>

      <section class="stats-card" data-metric="humidity">
        <div class="stats-card__head">
          <h4 class="stats-card__title">습도</h4>
          <button type="button" class="stats-detail-link" data-toggle-detail="humidity">상세 정보 보기</button>
        </div>
        <div class="stats-chart-wrap">
          <canvas class="stats-chart" id="chart-humidity"></canvas>
        </div>
        <div class="stats-detail" id="detail-humidity" hidden>
          <div class="stats-detail__table">
            <div class="stats-detail__thead">
              <span>일시</span><span>데이터</span>
            </div>
            <div class="stats-detail__tbody" data-detail-body="humidity"></div>
          </div>
        </div>
      </section>

      <section class="stats-card" data-metric="soil_moisture">
        <div class="stats-card__head">
          <h4 class="stats-card__title">토양 수분</h4>
          <button type="button" class="stats-detail-link" data-toggle-detail="soil_moisture">상세 정보 보기</button>
        </div>
        <div class="stats-chart-wrap">
          <canvas class="stats-chart" id="chart-soil"></canvas>
        </div>
        <div class="stats-detail" id="detail-soil_moisture" hidden>
          <div class="stats-detail__table">
            <div class="stats-detail__thead">
              <span>일시</span><span>데이터</span>
            </div>
            <div class="stats-detail__tbody" data-detail-body="soil_moisture"></div>
          </div>
        </div>
      </section>
    </div>
  </div>
</div>

<script src="${pageContext.request.contextPath}/resources/js/modal/ScheduleModal.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/modal/PotoModal.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/modal/StatsModal.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
