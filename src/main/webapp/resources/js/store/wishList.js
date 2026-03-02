/**
 * wishList.js
 * 찜목록과 장바구니 기능을 통합한 스크립트
 */

let fetchWishList;
let fetchCartList;

(function() {
  const wishContainer = document.getElementById("wishListContainer");
  const cartContainer = document.getElementById("cartListContainer");
  const summaryBox = document.getElementById("cartSummary");
  const totalPriceEl = document.getElementById("totalPrice");

  // --- 찜목록 관련 함수 ---
  fetchWishList = function() {
    fetch(`/store/cart/getWish`)
      .then(response => {
        if (!response.ok) throw new Error("네트워크 응답 에러");
        return response.json();
      })
      .then(data => {
        renderWishList(data);
      })
      .catch(error => {
        console.error("Wish 조회 오류:", error);
        wishContainer.innerHTML = '<div class="empty-box">데이터를 불러오는 중 오류가 발생했습니다.</div>';
      });
  }

  function renderWishList(list) {
    if (!list || list.length === 0) {
      wishContainer.innerHTML = '<div class="empty-box">찜한 상품이 없습니다.</div>';
      return;
    }

    let html = "";
    list.forEach(item => {
      const imgPath = item.thumbnail ? `/upload/${item.thumbnail}` : "";
      const price = new Intl.NumberFormat().format(item.product_price);

      html += `
        <div class="product-card">
          <div class="product-card__thumb" onclick="location.href='/store/product/detail?product_id=${item.product_id}'">
            ${item.thumbnail ? `<img src="${imgPath}" alt="${item.product_name}">` : '<div class="thumb-dummy">이미지 없음</div>'}
          </div>
          <div class="product-card__body">
            <div class="product-card__name">${item.product_name}</div>
            <div class="product-card__prices">
              <div class="product-card__price">${price}원</div>
            </div>
            <div style="margin-top: 10px; display: flex; gap: 4px;">
              <button type="button" class="store-more__btn" 
                      style="flex:1; height: 24px; font-size: 10px; background: #eee;" onclick="removeWishItem(${item.product_id})">삭제</button>
              <button type="button" class="store-more__btn" 
                      style="flex:1; height: 24px; font-size: 10px; background: #f2f084;" onclick="moveToCart(${item.product_id})">장바구니</button>
            </div>
          </div>
        </div>
      `;
    });
    wishContainer.innerHTML = html;
  }

  // --- 장바구니 관련 함수 ---
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
        cartContainer.innerHTML = '<div class="empty-box">데이터를 불러오는 중 오류가 발생했습니다.</div>';
      });
  }

  function renderCartList(list) {
    if (!list || list.length === 0) {
      cartContainer.innerHTML = '<div class="empty-box">장바구니가 비어있습니다.</div>';
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
              <button type="button" class="store-more__btn" style="width:24px; height: 24px; padding:0;" onclick="minusCartItem(${item.product_id})">-</button>
              <button type="button" class="store-more__btn" style="width:24px; height: 24px; padding:0;" onclick="plusCartItem(${item.product_id})">+</button>
              <button type="button" class="store-more__btn" style="flex:1; height: 24px; font-size: 10px; background: #eee;" onclick="removeCartItem(${item.product_id})">삭제</button>
            </div>
          </div>
        </div>
      `;
    });
    
    cartContainer.innerHTML = html;
    totalPriceEl.textContent = new Intl.NumberFormat().format(total);
    summaryBox.style.display = "block";
  }

  // 초기 로드
  document.addEventListener("DOMContentLoaded", function() {
    fetchWishList();
    fetchCartList();

    document.getElementById("btnRemoveAllWish").addEventListener("click", removeAllWish);
    document.getElementById("btnRemoveAllCart").addEventListener("click", removeAllCart);
  });

})();

// --- 글로벌 함수들 (onclick 이벤트용) ---

function removeAllWish(){
  fetch(`/store/cart/removeAllWish`, { method: "DELETE" })
    .then(res => {
      if(res.ok) {
        showCustomToast("성공적으로 찜목록을 비웠습니다.", "success");
        fetchWishList();
      }
    })
    .catch(err => console.error(err));
}

function removeWishItem(product_id){
  fetch(`/store/cart/removeWish/product/${product_id}`, { method: "DELETE" })
    .then(res => {
      if(res.ok) return res.text();
    })
    .then(data => {
      if(data) {
        showCustomToast(`해당 상품이 찜목록에서 성공적으로 삭제되었습니다. : ${data}`, "success");
        fetchWishList();
      }
    })
    .catch(err => console.error(err));
}

function moveToCart(product_id){
  fetch(`/store/cart/moveToCart/product/${product_id}`, { method: "PUT" })
    .then(res => {
      if(res.ok) {
        showCustomToast("상품이 장바구니에 추가되었습니다.", "success");
        fetchWishList();
        fetchCartList(); // 장바구니도 갱신
      }
    })
    .catch(err => console.error(err));
}

function minusCartItem(product_id){
  const countEL= document.querySelector(`#product_count_${product_id}`);
  const count = parseInt(countEL.textContent);
  if(count <= 1) {
    showCustomToast("최소 수량은 1개입니다.", "warning");
    return;
  }
  
  fetch(`/store/cart/modifyCart/product/${product_id}?type=minus`, { method: "PUT" })
    .then(res => {
      if(res.ok) return res.text();
    })
    .then(data => {
      if(data) {
        showCustomToast(`상품 수량이 변경되었습니다. ${data} : ${count - 1}`, "info");
        fetchCartList();
      }
    })
    .catch(err => console.error(err));
}

function plusCartItem(product_id){
  const countEL= document.querySelector(`#product_count_${product_id}`);
  const count = parseInt(countEL.textContent);

  fetch(`/store/cart/modifyCart/product/${product_id}?type=plus`, { method: "PUT" })
    .then(res => {
      if(res.ok) return res.text();
    })
    .then(data => {
      if(data) {
        showCustomToast(`상품 수량이 변경되었습니다. ${data} : ${count + 1}`, "info");
        fetchCartList();
      }
    })
    .catch(err => console.error(err));
}

function removeCartItem(product_id){
  fetch(`/store/cart/removeCart/product/${product_id}`, { method: "DELETE" })
    .then(res => {
      if(res.ok) return res.text();
    })
    .then(data => {
      if(data) {
        showCustomToast(`해당 상품을 성공적으로 장바구니에서 삭제했습니다. : ${data}`, "success");
        fetchCartList();
      }
    })
    .catch(err => console.error(err));
}

function removeAllCart(){
  fetch(`/store/cart/removeAllCart`, { method: "DELETE" })
    .then(res => {
      if(res.ok) {
        showCustomToast("장바구니를 모두 비웠습니다.", "success");
        fetchCartList();
      }
    })
    .catch(err => console.error(err));
}

function newOrder(){
  const totalPriceEl = document.getElementById("totalPrice");
  const totalPrice = totalPriceEl ? parseInt(totalPriceEl.textContent.replace(/[^0-9]/g, '')) : 0;
  
  const products = [];
  // wishContainer나 cartContainer 내부의 요소를 구분해야 함
  document.querySelectorAll('#cartListContainer .product-card').forEach(card => {
    // 수량 조절 버튼(+ 또는 -)을 통해 product_id를 유추하거나 id 구조 사용
    const countEl = card.querySelector('strong[id^="product_count_"]');
    if (countEl) {
      const productId = countEl.id.replace('product_count_', '');
      const count = parseInt(countEl.textContent);
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

  const deliveryAddr = prompt("배송지를 입력해주세요.", "서울시 장안구...");
  if (!deliveryAddr) return;

  const orderInfo = {
   use_point: 0,
   order_amount : totalPrice,
   accumulate_point : Math.floor(totalPrice * 0.01),
   delivery_addr : deliveryAddr,
   products : products 
  }

  requestOrderReady(orderInfo, function(orderId) {
    startTossPayment('CARD', {
        amount: orderInfo.order_amount,
        orderId: orderId,
        orderName: products.length > 1 ? `${products.length}건 상품 주문` : "상품 주문"
    });
  });
}
