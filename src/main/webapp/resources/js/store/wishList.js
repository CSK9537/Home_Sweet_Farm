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
            
            <div class="product-card__qty"></div>
            
            <div class="product-card__actions">
              <button type="button" class="btn-card-action" onclick="removeWishItem(${item.product_id})">삭제</button>
              <button type="button" class="btn-card-action btn-card-action--point" onclick="moveToCart(${item.product_id})">장바구니 담기</button>
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
            
            <div class="product-card__qty">
              수량: <strong id="product_count_${item.product_id}">${item.product_count}</strong>개
            </div>
            
            <div class="product-card__actions">
              <button type="button" class="btn-card-action btn-card-action--icon" onclick="minusCartItem(${item.product_id})">-</button>
              <button type="button" class="btn-card-action btn-card-action--icon" onclick="plusCartItem(${item.product_id})">+</button>
              <button type="button" class="btn-card-action" onclick="removeCartItem(${item.product_id})">삭제</button>
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
        showCustomToast(`해당 상품이 찜목록에서 성공적으로 삭제되었습니다.`, "success");
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
  const countEL = document.querySelector(`#product_count_${product_id}`);
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
        fetchCartList();
      }
    })
    .catch(err => console.error(err));
}

function plusCartItem(product_id){
  const countEL = document.querySelector(`#product_count_${product_id}`);
  const count = parseInt(countEL.textContent);

  fetch(`/store/cart/modifyCart/product/${product_id}?type=plus`, { method: "PUT" })
    .then(res => {
      if(res.ok) return res.text();
    })
    .then(data => {
      if(data) {
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
        showCustomToast(`해당 상품을 성공적으로 장바구니에서 삭제했습니다.`, "success");
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
  document.querySelectorAll('#cartListContainer .product-card').forEach(card => {
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

  openDeliveryModal(function(deliveryAddr) {
    const orderInfo = {
      use_point: 0,
      order_amount : totalPrice,
      accumulate_point : Math.floor(totalPrice * 0.01),
      delivery_addr : deliveryAddr,
      products : products 
    };

    requestOrderReady(orderInfo, function(orderId) {
      startTossPayment('CARD', {
          amount: orderInfo.order_amount,
          orderId: orderId,
          orderName: products.length > 1 ? `${products.length}건 상품 주문` : "상품 주문"
      });
    });
  });
}

function openDeliveryModal(callback) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  
  let html = "";
  html += '<div class="modal-content modal-content--small">';
  html += '  <div class="modal-header">';
  html += '    <span class="modal-title">배송지 입력</span>';
  html += '    <span class="modal-close">&times;</span>';
  html += '  </div>';
  html += '  <div class="modal-body">';
  html += '    <p class="modal-desc">상품을 배송받으실 주소를 입력해주세요.</p>';
  html += '    <textarea id="deliveryAddrText" class="modal-textarea" placeholder="도로명 주소 또는 지번 주소를 입력해주세요."></textarea>';
  html += '    <div class="modal-footer">';
  html += '      <button type="button" class="btn-confirm-modal">결제하기</button>';
  html += '      <button type="button" class="btn-close-modal">닫기</button>';
  html += '    </div>';
  html += '  </div>';
  html += '</div>';

  overlay.innerHTML = html;
  document.body.appendChild(overlay);
  document.body.classList.add("modal-open");

  const closeFn = function() {
    overlay.remove();
    document.body.classList.remove("modal-open");
  };

  overlay.querySelector(".modal-close").onclick = closeFn;
  overlay.querySelector(".btn-close-modal").onclick = closeFn;
  overlay.onclick = function(e) { if (e.target === overlay) closeFn(); };

  overlay.querySelector(".btn-confirm-modal").onclick = function() {
    const addr = document.getElementById("deliveryAddrText").value.trim();
    if (!addr) {
      showCustomToast("배송지를 입력해주세요.", "warning");
      return;
    }
    closeFn();
    if (callback) callback(addr);
  };
}