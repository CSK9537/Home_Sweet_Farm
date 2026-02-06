<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/PlantMain.css">

<div class="page-shell">
  <%@ include file="/WEB-INF/views/layout/header.jsp" %>

  <div class="content-wrap">
    <section class="content-card">

      <!-- ===== 여기부터 식물 목록 UI ===== -->
      <section class="plant-section">

        <div id="plantContainer" class="plant-grid">
          <c:choose>
            <c:when test="${empty plantList}">
              <p style="margin:0;">표시할 식물이 없습니다.</p>
            </c:when>
           <c:otherwise>
              <c:forEach var="plant" items="${plantList}">
                <article class="plant-card" data-id="${plant.plant_id}">
                  <a href="${pageContext.request.contextPath}/plants/${plant.plant_id}">
                    <div class="plant-card__img-wrap">
                      <img
                        src="${plant.plant_image}"
                        alt="${plant.plant_name_kor}"
                        class="plant-card__img"
                      />
                    </div>
                    <div class="plant-card__info">
                      <h3 class="plant-card__name">${plant.plant_name_kor}</h3>
                    </div>
                  </a>
                </article>
              </c:forEach>
            </c:otherwise>
          </c:choose>
        </div>

        <div class="plant-more">
          <button id="loadMoreBtn" class="plant-more__btn" type="button">
            	더보기
          </button>
        </div>
      </section>
    </section>
  </div>
  <%@ include file="/WEB-INF/views/layout/footer.jsp" %>
</div>
<script src="${pageContext.request.contextPath}/resources/js/PlantMain.js"></script>
