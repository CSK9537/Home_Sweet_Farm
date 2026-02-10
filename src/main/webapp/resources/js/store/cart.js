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
      fetchCartList();
    })
    .catch(error => {
      console.error("Cart 조회 오류:", error);
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
      fetchCartList();
    })
    .catch(error => {
      console.error("Cart 조회 오류:", error);
    });
}
function removeCartItem(product_id){
  if(!confirm("해당 상품을 삭제하시겠습니까?")) return;

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
      fetchCartList();
    })
    .catch(error => {
      console.error("Cart 조회 오류:", error);
    });
}

// 장바구니 전체 삭제
function removeAllCart(){
  if(!confirm("정말 장바구니를 비우시겠습니까?")) return;

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
    fetchCartList();
  })
  .catch(error => {
    console.error("Cart 조회 오류:", error);
  });
}

function newOrder(){
  console.log("주문하기 버튼 클릭");
}