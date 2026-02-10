<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<jsp:include page="/WEB-INF/views/layout/header.jsp" />
<!-- 기존 스토어 리스트 스타일 재사용 -->
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/store/StoreList.css" />

<div class="page-shell">
  <div class="content-wrap">
    <div class="content-card store-list">
      
      <div class="category-bar">
        <div class="category-bar__left">
          <span class="category-bar__title">나의 찜목록</span>
        </div>
        <div class="category-bar__right">
          <button type="button" class="store-more__btn" id="btnRemoveAllWish" style="width: 100px; height: 28px; background: #f6a3a3;">전체 삭제</button>
        </div>
      </div>

      <!-- 찜목록 그리드 (JS에서 동적 생성) -->
      <div class="grid-4x2" id="wishListContainer">
        <div class="empty-box">목록을 불러오는 중입니다...</div>
      </div>

    </div>
  </div>
</div>



<script src="${pageContext.request.contextPath}/resources/js/store/wish.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
