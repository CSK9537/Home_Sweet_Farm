<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<jsp:include page="/WEB-INF/views/layout/header.jsp" />
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/plant/PlantMain.css" />

<div class="page-shell">
	<section class="content-wrap">
		<div class="content-card plant">

			<div class="plant__header">
				<h2 class="plant__title">식물</h2>
				<div class="plant__divider"></div>
			</div>

			<section class="plant-section" data-section="popular">
				<div class="plant-section__head">
					<h3 class="plant-section__title">인기 식물</h3>
				</div>

				<!-- 상단 Top3 (3열) -->
				<div class="plant-grid plant-grid--top3" id="popularTopGrid">
				  <c:forEach var="p" items="${popularPlants}" varStatus="st">
				    <c:if test="${st.count <= 3}">
				      <article class="plant-card plant-card--top" data-id="${p.plant_id}">
				        <div class="hover-area-wrapper">
                          <div class="hover-area hover-area--left" onclick="location.href='/plant/info/${p.plant_name}'"></div>
                          <div class="hover-area hover-area--right" onclick="location.href='/plant/guide/${p.plant_name}'"></div>
                        </div>
				        <div class="plant-card__link">
				          <div class="plant-card__thumb">
				            <span class="plant-card__badge plant-card__badge--rank">${st.count}위</span>
				            <img src="/plant/image/${p.plant_image}" alt="${p.plant_name_kor}" loading="lazy" />
				            <span class="text left-text">백과사전</span>
				            <span class="text right-text">가이드</span>
				          </div>
				          <div class="plant-card__body">
				            <div class="plant-card__name">${p.plant_name_kor}</div>
				            <div class="plant-card__sub">${p.plant_name}</div>
				          </div>
				        </div>
				      </article>
				    </c:if>
				  </c:forEach>
				</div>
				
				<!-- 하단 목록 (4개씩) -->
				<div class="plant-grid plant-grid--random" id="popularGrid">
				  <c:forEach var="p" items="${randomPlants}">
			        <article class="plant-card" data-id="${p.plant_id}">
			          <div class="hover-area-wrapper">
                           <div class="hover-area hover-area--left" onclick="location.href='/plant/info/${p.plant_name}'"></div>
                           <div class="hover-area hover-area--right" onclick="location.href='/plant/guide/${p.plant_name}'"></div>
                         </div>
			          <div class="plant-card__link">
			            <div class="plant-card__thumb">
			              <img src="/plant/image/${p.plant_image}" alt="${p.plant_name_kor}" loading="lazy" />
			              <span class="text left-text">백과사전</span>
			              <span class="text right-text">가이드</span>
			            </div>
			            <div class="plant-card__body">
			              <div class="plant-card__name">${p.plant_name_kor}</div>
			              <div class="plant-card__sub">${p.plant_name}</div>
			            </div>
			          </div>
			        </article>
				  </c:forEach>
				</div>
				<!-- 더보기: 하단 목록만 추가 (4개씩, 최대 5번) -->
				<div class="plant-section__more">
					<button type="button"
							class="btn-more"
							data-target="#popularGrid"
							data-section="popular"
							data-offset="${empty popularOffset ? 11 : popularOffset}"
							data-limit="4"
							data-clicks="0"
							data-max-clicks="5">
						더보기
					</button>
				</div>
			</section>

		</div>
	</section>
</div>

<script src="${pageContext.request.contextPath}/resources/js/plant/PlantMain.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
