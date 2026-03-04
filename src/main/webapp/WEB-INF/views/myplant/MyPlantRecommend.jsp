<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/main.css">
<link rel="stylesheet" href="/resources/css/myplant/MyPlantView.css">
<%@ include file="/WEB-INF/views/layout/header.jsp" %>
<div class="sections">
    <section class="section">
        <div class="section__header">
            <h2 class="section__title">식물 추천 가이드</h2>
        </div>

        <div id="plantContainer" class="card-grid card-grid--3"></div>
    </section>
</div>

<script src="/resources/js/myplant/MyPlantRecommend.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
