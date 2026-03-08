<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<jsp:include page="/WEB-INF/views/layout/header.jsp" />
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/store/wishList.css" />

<div class="page-shell">
  <div class="content-wrap">
    <div class="wish-cart-container">
      
      <div class="wish-section store-list">
        <div class="category-bar category-bar--wish">
          <div class="category-bar__left">
            <span class="category-bar__title">나의 찜목록</span>
          </div>
          <div class="category-bar__right">
            <button type="button" class="btn-mini btn-mini--ghost" id="btnRemoveAllWish">전체 삭제</button>
          </div>
        </div>
        <div class="grid-2col" id="wishListContainer">
          <div class="empty-box">목록을 불러오는 중입니다...</div>
        </div>
      </div>

      <div class="cart-section store-list">
        <div class="category-bar category-bar--cart">
          <div class="category-bar__left">
            <span class="category-bar__title">나의 장바구니</span>
          </div>
          <div class="category-bar__right">
            <button type="button" class="btn-mini btn-mini--ghost" id="btnRemoveAllCart">전체 비우기</button>
          </div>
        </div>
        <div class="grid-2col" id="cartListContainer">
          <div class="empty-box">목록을 불러오는 중입니다...</div>
        </div>
      </div>

    </div>
    <div class="cart-summary" id="cartSummary">
      <div class="cart-summary__text">
        <span class="cart-summary__label">총 주문 금액: </span>
        <span class="cart-summary__price" id="totalPrice">0</span>
        <span class="cart-summary__unit">원</span>
      </div>
      <div class="cart-summary__actions">
        <button type="button" class="btn-large btn-large--primary" onclick="newOrder()">주문하기</button>
      </div>
    </div>
  </div>
</div>

<script src="https://js.tosspayments.com/v2/standard"></script>
<script>
 const clientKey = "test_ck_eqRGgYO1r5MaN7APmaZprQnN2Eya";
 const tossPayments = TossPayments(clientKey);
</script>
<script src="${pageContext.request.contextPath}/resources/js/store/StoreOrder.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/store/wishList.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
