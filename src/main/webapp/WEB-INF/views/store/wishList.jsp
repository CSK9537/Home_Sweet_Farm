<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<jsp:include page="/WEB-INF/views/layout/header.jsp" />
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/store/StoreList.css" />
<style>
  /* 전체 너비 확장 및 중앙 정렬 */
  .page-shell .content-wrap {
    max-width: 1300px;
    width: 95%;
    margin: 0 auto; /* 중앙 정렬 */
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .wish-cart-container {
    display: flex;
    gap: 30px;
    justify-content: center; /* 섹션들 중앙 정렬 */
    align-items: flex-start;
    width: 100%;
  }
  
  /* 섹션 스타일 통일 및 너비 조정 */
  .wish-section, .cart-section {
    flex: 0 1 600px; /* 최대 600px까지 확장되도록 설정 */
    min-width: 350px;
    background: #fff;
    border-radius: 8px;
    border: 1px solid #d6d1c8;
    overflow: hidden;
  }
  
  /* 내부 여백 및 정렬 통일 */
  .wish-section .category-bar, 
  .cart-section .category-bar {
    margin-top: 0; 
    border-bottom: 1px solid rgba(0,0,0,0.05);
  }
  
  .wish-section .grid-2col, 
  .cart-section .grid-2col {
    padding: 20px;
    margin-top: 0;
  }

  /* 그리드 표준화 */
  .grid-2col {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  /* 카드 높이 통일 */
  .product-card {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .product-card__body {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .product-card__name {
    flex-grow: 1;
  }

  @media (max-width: 992px) {
    .wish-cart-container {
      flex-direction: column;
    }
  }
</style>

<div class="page-shell">
  <div class="content-wrap">
    <div class="wish-cart-container">
      
      <!-- 왼쪽: 찜목록 -->
      <div class="wish-section store-list">
        <div class="category-bar" style="background: #f2f084;">
          <div class="category-bar__left">
            <span class="category-bar__title">나의 찜목록</span>
          </div>
          <div class="category-bar__right">
            <button type="button" class="store-more__btn" id="btnRemoveAllWish" style="width: 80px; height: 24px; font-size: 11px; background: #eee;">전체 삭제</button>
          </div>
        </div>
        <div class="grid-2col" id="wishListContainer">
          <div class="empty-box">목록을 불러오는 중입니다...</div>
        </div>
      </div>

      <!-- 오른쪽: 장바구니 -->
      <div class="cart-section store-list">
        <div class="category-bar" style="background: #f6a3a3;">
          <div class="category-bar__left">
            <span class="category-bar__title">나의 장바구니</span>
          </div>
          <div class="category-bar__right">
            <button type="button" class="store-more__btn" id="btnRemoveAllCart" style="width: 80px; height: 24px; font-size: 11px; background: #eee;">전체 비우기</button>
          </div>
        </div>
        <div class="grid-2col" id="cartListContainer">
          <div class="empty-box">목록을 불러오는 중입니다...</div>
        </div>
      </div>

    </div> <!-- .wish-cart-container END -->

    <!-- 하단 주문 예상 영역 -->
    <div class="empty-box" id="cartSummary" style="margin-top: 30px; background: #f9f9f9; display: none; padding: 25px; border: 1px solid #d6d1c8; width: 100%; max-width: 1230px; box-sizing: border-box;">
      <div style="margin-bottom: 15px; text-align: center;">
        <span style="font-size: 14px; color: #444;">총 주문 금액: </span>
        <span id="totalPrice" style="font-weight: bold; font-size: 20px; color: #222;">0</span>
        <span style="font-size: 14px; color: #444;">원</span>
      </div>
      <div style="display: flex; justify-content: center;">
        <button type="button" class="store-more__btn" style="background: #6b7b61; color: #fff; width: 240px; height: 40px; font-size: 14px; font-weight: bold;" onclick="newOrder()">주문하기</button>
      </div>
    </div>

  </div> <!-- .content-wrap END -->
</div> <!-- .page-shell END -->

<script src="https://js.tosspayments.com/v2/standard"></script>
<script>
 const clientKey = "test_ck_eqRGgYO1r5MaN7APmaZprQnN2Eya";
 const tossPayments = TossPayments(clientKey);
</script>
<script src="${pageContext.request.contextPath}/resources/js/store/StoreOrder.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/store/wishList.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
