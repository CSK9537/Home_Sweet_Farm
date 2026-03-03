<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<jsp:include page="/WEB-INF/views/layout/header.jsp" />
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/store/orderList.css" />

<div class="page-shell">
  <div class="content-wrap">
    <div class="content-card order-list">

      <!-- 카테고리 바 -->
      <div class="category-bar">
        <div class="category-bar__left">
          <span class="category-bar__title">주문 목록</span>
        </div>
        <div class="category-bar__right">
          <span class="category-bar__path">
            마이페이지
            <span class="path-sep">&gt;</span>
            주문 목록
          </span>
        </div>
      </div>

      <!-- 주문 목록 컨테이너 -->
      <div id="orderListArea" class="order-list-container">
        <!-- JS에서 동적으로 생성됨 -->
        <div class="loading-box">주문 내역을 불러오는 중입니다...</div>
      </div>

    </div>
  </div>
</div>

<script src="${pageContext.request.contextPath}/resources/js/store/OrderList.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
