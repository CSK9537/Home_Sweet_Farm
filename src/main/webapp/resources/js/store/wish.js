/**
 * wish.js
 */
let fetchWishList;
(function() {
  const container = document.getElementById("wishListContainer");

  // 초기 데이터 조회
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
        container.innerHTML = '<div class="empty-box">데이터를 불러오는 중 오류가 발생했습니다.</div>';
      });
  }

  // 찜목록 렌더링
  function renderWishList(list) {
    if (!list || list.length === 0) {
      container.innerHTML = '<div class="empty-box">찜한 상품이 없습니다.</div>';
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
              <button type="button" class="store-more__btn btn-remove-wish" 
                      data-id="${item.product_id}" style="flex:1; height: 24px; font-size: 10px; background: #eee;" onclick="removeWishItem(${item.product_id})">삭제</button>
              <button type="button" class="store-more__btn btn-add-cart" 
                      data-id="${item.product_id}" style="flex:1; height: 24px; font-size: 10px; background: #f6a3a3;" onclick="moveToCart(${item.product_id})">장바구니</button>
            </div>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  }

  document.querySelector("#btnRemoveAllWish").addEventListener("click", removeAllWish);
  // 실행
  document.addEventListener("DOMContentLoaded", fetchWishList);
})();

function removeAllWish(){
  if(!confirm("정말 찜목록을 비우시겠습니까?")) return;

  fetch(`/store/cart/removeAllWish`,{
    method:"DELETE",
    headers:{
      "Content-Type": "application/json"
    }
  })
  .then(response => {
    console.log(response.status);
    if(!response.ok) throw new Error("네트워크 응답 에러");
    return response.text();
  })
  .then(data => {
    fetchWishList();
  })
  .catch(error => {
    console.error("Wish 조회 오류:", error);
  });
}

function removeWishItem(product_id){
  if(!confirm("정말 찜목록에서 삭제하시겠습니까?")) return;

  fetch(`/store/cart/removeWish/product/${product_id}`,{
    method:"DELETE",
    headers:{
      "Content-Type": "application/json"
    }
  })
  .then(response => {
    console.log(response.status);
    if(!response.ok) throw new Error("네트워크 응답 에러");
    return response.text();
  })
  .then(data => {
    fetchWishList();
  })
  .catch(error => {
    console.error("Wish 조회 오류:", error);
  });
}

function moveToCart(product_id){

  fetch(`/store/cart/moveToCart/product/${product_id}`,{
    method:"PUT",
    headers:{
      "Content-Type": "application/json"
    }
  })
  .then(response => {
    console.log(response.status);
    if(!response.ok) throw new Error("네트워크 응답 에러");
    return response.text();
  })
  .then(data => {
    if(confirm("장바구니에 해당 상품이 추가되었습니다. 장바구니로 이동하시겠습니까?")) location.href="/store/cartPage";
    else fetchWishList();
  })
  .catch(error => {
    console.error("Wish 조회 오류:", error);
  });
}