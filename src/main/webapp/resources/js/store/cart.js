/**
 * cart.js
 */
let fetchCartList;
(function() {
  const container = document.getElementById("cartListContainer");
  const summaryBox = document.getElementById("cartSummary");
  const totalPriceEl = document.getElementById("totalPrice");

  // 초기 데이터 조회
  fetchCartList = function() {
    fetch(`/store/cart/getCart`)
      .then(response => {
        if (!response.ok) throw new Error("네트워크 응답 에러");
        return response.json();
      })
      .then(data => {
        renderCartList(data);
      })
      .catch(error => {
        console.error("Cart 조회 오류:", error);
        container.innerHTML = '<div class="empty-box">데이터를 불러오는 중 오류가 발생했습니다.</div>';
      });
  }

  // 장바구니 렌더링
  function renderCartList(list) {
    if (!list || list.length === 0) {
      container.innerHTML = '<div class="empty-box">장바구니가 비어있습니다.</div>';
      summaryBox.style.display = "none";
      return;
    }

    let html = "";
    let total = 0;

    list.forEach(item => {
      const imgPath = item.thumbnail ? `/upload/${item.thumbnail}` : "";
      const price = item.product_price;
      const subtotal = price * item.product_count;
      total += subtotal;

      html += `
        <div class="product-card">
          <div class="product-card__thumb" onclick="location.href='/store/product/detail?product_id=${item.product_id}'">
            ${item.thumbnail ? `<img src="${imgPath}" alt="${item.product_name}">` : '<div class="thumb-dummy">이미지 없음</div>'}
          </div>
          <div class="product-card__body">
            <div class="product-card__name">${item.product_name}</div>
            <div class="product-card__prices">
              <div class="product-card__price">${new Intl.NumberFormat().format(price)}원</div>
            </div>
            <div style="margin-top: 8px; font-size: 11px; color: #666;">
              수량: <strong id="product_count_${item.product_id}">${item.product_count}</strong>개
            </div>
            <div style="margin-top: 10px; display: flex; gap: 4px;">
              <button type="button" class="store-more__btn btn-minus-cart" data-id="${item.product_id}" style="width:24px; height: 24px; padding:0;" onclick="minusCartItem(${item.product_id})">-</button>
              <button type="button" class="store-more__btn btn-plus-cart" data-id="${item.product_id}" style="width:24px; height: 24px; padding:0;" onclick="plusCartItem(${item.product_id})">+</button>
              <button type="button" class="store-more__btn btn-remove-cart" data-id="${item.product_id}" style="flex:1; height: 24px; font-size: 10px; background: #eee;" onclick="removeCartItem(${item.product_id})">삭제</button>
            </div>
          </div>
        </div>
      `;
    });
    
    container.innerHTML = html;
    totalPriceEl.textContent = new Intl.NumberFormat().format(total); //쉼표 찍기
    summaryBox.style.display = "block";
  }

  // 장바구니 전체 삭제 이벤트 걸기
  document.querySelector("#btnRemoveAllCart").addEventListener("click", removeAllCart);
  // 실행
  document.addEventListener("DOMContentLoaded", fetchCartList);
})();

function minusCartItem(product_id){
  // 상품 수량 체크
  const countEL= document.querySelector(`#product_count_${product_id}`);
  const count = parseInt(countEL.textContent);
  if(count <= 1){
    alert("상품의 최소 수량은 1개입니다.");
    return;
  }
  
  fetch(`/store/cart/modifyCart/product/${product_id}?type=minus`,{
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => {
      if (!response.ok) throw new Error("네트워크 응답 에러");
      return response.text();
    })
    .then(data => {
      showCustomToast(`상품 수량이 변경되었습니다. ${data} : ${count}`)
      fetchCartList();
    })
    .catch(error => {
      console.error("Cart 조회 오류:", error);
      showCustomToast("상품 수량 변경에 실패했습니다.","error");
    });
}
function plusCartItem(product_id){
  fetch(`/store/cart/modifyCart/product/${product_id}?type=plus`,{
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => {
      if (!response.ok) throw new Error("네트워크 응답 에러");
      return response.text();
    })
    .then(data => {
      showCustomToast(`상품 수량이 변경되었습니다. ${data} : ${count}`);
      fetchCartList();
    })
    .catch(error => {
      console.error("Cart 조회 오류:", error);
      showCustomToast("상품 수량 변경에 실패했습니다.","error");
    });
}
function removeCartItem(product_id){
  fetch(`/store/cart/removeCart/product/${product_id}`,{
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => {
      if (!response.ok) throw new Error("네트워크 응답 에러");
      return response.text();
    })
    .then(data => {
      showCustomToast(`해당 상품을 성공적으로 장바구니에서 삭제했습니다. : ${data}` , "success");
      fetchCartList();
    })
    .catch(error => {
      console.error("Cart 조회 오류:", error);
    });
}

// 장바구니 전체 삭제
function removeAllCart(){
  fetch(`/store/cart/removeAllCart`, {
    headers: {
      "Content-Type": "application/json"
    },
    method: "DELETE"
  })
  .then(response => {
    if (!response.ok) throw new Error("네트워크 응답 에러");
    return response.text();
  })
  .then(data => {
    showCustomToast("성공적으로 장바구니를 비웠습니다.", "success");
    fetchCartList();
  })
  .catch(error => {
    console.error("Cart 조회 오류:", error);
  });
}

function newOrder(){
  // 1. 현재 장바구니의 데이터 수집
  const totalPriceEl = document.getElementById("totalPrice");
  const totalPrice = totalPriceEl ? parseInt(totalPriceEl.textContent.replace(/[^0-9]/g, '')) : 0;
  
  const products = [];
  document.querySelectorAll('.product-card').forEach(card => {
    // btn-plus-cart 버튼에서 product_id를 가져옴
    const plusBtn = card.querySelector('.btn-plus-cart');
    if (plusBtn) {
      const productId = plusBtn.dataset.id;
      const countEl = document.querySelector(`#product_count_${productId}`);
      const count = countEl ? parseInt(countEl.textContent) : 0;
      
      products.push({
        product_id: parseInt(productId),
        product_count: count
      });
    }
  });

  if(products.length === 0){
    showCustomToast("장바구니가 비어있습니다." , "error");
    return;
  }

  // 2. 배송지 입력 (테스트용 알림/프롬프트)
  // 추후 프롬프트를 모달로로 변경하는 편이 좋아보임 -> 모달에서 포인트 사용 여부 등의 추가적인 기능 추가 가능...
  const deliveryAddr = prompt("배송지를 입력해주세요.", "서울시 강남구 테헤란로...");
  if (!deliveryAddr) {
    showCustomToast("배송지 입력이 취소 되었습니다." , "error");
    return;
  }

  const orderInfo = {
   use_point: 0,
   order_amount : totalPrice,
   accumulate_point : Math.floor(totalPrice * 0.01), // 예: 1% 적립
   delivery_addr : deliveryAddr,
   products : products 
  }

  // 2. 주문 준비 요청 및 성공 시 결제창(카드 기준) 호출
  requestOrderReady(orderInfo, function(orderId) {
    startTossPayment('CARD', {
        amount: orderInfo.order_amount,
        orderId: orderId,
        orderName: products.length > 1 ? `${products.length}건 상품 주문` : "상품 주문"
    });
  });
}