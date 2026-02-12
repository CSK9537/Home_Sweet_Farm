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
          <span class="category-bar__title">나의 장바구니</span>
        </div>
        <div class="category-bar__right">
          <button type="button" class="store-more__btn" id="btnRemoveAllCart" style="width: 100px; height: 28px; background: #f6a3a3;">전체 비우기</button>
        </div>
      </div>

      <!-- 장바구니 그리드 (JS에서 동적 생성) -->
      <div class="grid-4x2" id="cartListContainer">
        <div class="empty-box">목록을 불러오는 중입니다...</div>
      </div>
      
      <!-- 하단 주문 예상 영역 (간단히) -->
      <div class="empty-box" id="cartSummary" style="margin-top: 40px; background: #f9f9f9; display: none;">
        <span>총 주문 금액: </span>
        <span id="totalPrice" style="font-weight: bold; font-size: 16px;">0</span>원
        <button type="button" class="store-more__btn" style="margin-left: 20px; background: #6b7b61; color: #fff; width: 120px;" onclick="newOrder()">주문하기</button>
      </div>

    </div>
  </div>
</div>



<script src="https://js.tosspayments.com/v2/standard"></script> <!-- 토스 페이먼츠 SDK -->
<script>
 const clientKey = "test_ck_eqRGgYO1r5MaN7APmaZprQnN2Eya"; // 테스트용 클라이언트 키
 const tossPayments = TossPayments(clientKey); // 토스 페이먼츠 초기화
</script>
<script src="${pageContext.request.contextPath}/resources/js/store/StoreOrder.js"></script> <!-- 토스 페이먼츠 결제 및 주문 처리 로직 -->
<script src="${pageContext.request.contextPath}/resources/js/store/cart.js"></script> <!-- 장바구니 로직 -->
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
