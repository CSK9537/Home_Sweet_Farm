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

				<!-- 1) 상단 Top3 (3열) -->
				<div class="plant-grid plant-grid--top3" id="popularTopGrid">
				  <c:forEach var="p" items="${popularPlants}" varStatus="st">
				    <c:if test="${st.count <= 3}">
				      <article class="plant-card plant-card--top" data-id="${p.plant_id}">
				        <a class="plant-card__link"
				           href="${pageContext.request.contextPath}/plant/detail?plant_id=${p.plant_id}">
				          <div class="plant-card__thumb">
				            <span class="plant-card__badge plant-card__badge--rank">${st.count}위</span>
				            <img src="${p.plant_image}" alt="${p.plant_name_kor}" loading="lazy" />
				          </div>
				          <div class="plant-card__body">
				            <div class="plant-card__name">${p.plant_name_kor}</div>
				            <div class="plant-card__sub">${p.plant_name}</div>
				          </div>
				        </a>
				      </article>
				    </c:if>
				  </c:forEach>
				</div>
				
				<!-- 2) 하단 목록 (4열, 2줄 = 8개) : 4번째 ~ 11번째 -->
				<div class="plant-grid plant-grid--rank" id="popularGrid">
				  <c:forEach var="p" items="${popularPlants}" varStatus="st">
				    <c:if test="${st.count >= 4 && st.count <= 11}">
				      <article class="plant-card" data-id="${p.plant_id}">
				        <a class="plant-card__link"
				           href="${pageContext.request.contextPath}/plant/detail?plant_id=${p.plant_id}">
				          <div class="plant-card__thumb">
				            <img src="${p.plant_image}" alt="${p.plant_name_kor}" loading="lazy" />
				          </div>
				          <div class="plant-card__body">
				            <div class="plant-card__name">${p.plant_name_kor}</div>
				            <div class="plant-card__sub">${p.plant_name}</div>
				          </div>
				        </a>
				      </article>
				    </c:if>
				  </c:forEach>
				</div>
			</section>

		</div>
	</section>
</div>

<script defer src="${pageContext.request.contextPath}/resources/js/plant/PlantMain.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
