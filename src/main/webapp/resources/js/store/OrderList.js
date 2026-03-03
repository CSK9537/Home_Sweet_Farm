// OrderList.js
(function () {
  function qs(id) { return document.getElementById(id); }

  function escHtml(str) {
    str = (str === null || str === undefined) ? "" : String(str);
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatPrice(price) {
    if (price === null || price === undefined || isNaN(Number(price))) return "0원";
    return new Intl.NumberFormat('ko-KR').format(Number(price)) + "원";
  }

  function formatDate(timestamp) {
    if (!timestamp) return "";
    var date = new Date(timestamp);
    var y = date.getFullYear();
    var m = ("0" + (date.getMonth() + 1)).slice(-2);
    var d = ("0" + date.getDate()).slice(-2);
    return y + "-" + m + "-" + d;
  }

  function getStatusBadgeClass(status) {
    if (status === "결제완료" || status === "DONE") return "status-badge--complete";
    if (status === "CANCELED" || status === "취소됨") return "status-badge--cancel";
    return "status-badge--waiting";
  }

  function renderOrderList(list) {
    var container = qs("orderListArea");
    if (!container) return;

    if (!list || list.length === 0) {
      container.innerHTML = '<div class="empty-box">주문 내역이 없습니다.</div>';
      return;
    }

    var html = "";
    for (var i = 0; i < list.length; i++) {
        var order = list[i];
        html += '<div class="order-card" data-order-id="' + order.order_id + '">';
        html += '  <div class="order-card__header">';
        html += '    <span class="order-date">' + formatDate(order.order_date) + '</span>';
        html += '    <span class="order-id">주문번호: ' + escHtml(order.order_id) + '</span>';
        html += '  </div>';
        html += '  <div class="order-card__body">';
        
        if (order.product_list && order.product_list.length > 0) {
            for (var j = 0; j < order.product_list.length; j++) {
                var item = order.product_list[j];
                html += '    <div class="order-item">';
                html += '      <div class="order-item__thumb">';
                if (item.saved_name) {
                    html += '        <img src="/upload/' + escHtml(item.saved_name) + '" alt="' + escHtml(item.product_name) + '" />';
                } else {
                    html += '        <div class="thumb-dummy">이미지</div>';
                }
                html += '      </div>';
                html += '      <div class="order-item__info">';
                html += '        <div class="order-item__name">' + escHtml(item.product_name) + '</div>';
                html += '        <div class="order-item__price">' + formatPrice(item.product_price) + ' | ' + item.product_count + '개</div>';
                html += '      </div>';
                html += '      <div class="order-item__status">';
                html += '        <span class="status-badge ' + getStatusBadgeClass(order.status) + '">' + escHtml(order.status || "처리중") + '</span>';
                html += '      </div>';
                html += '    </div>';
            }
        }
        
        html += '  </div>';
        html += '  <div class="order-card__footer">';
        html += '    <div class="footer-left">';
        // 결제 완료 상태인 경우에만 취소 버튼 노출 (DONE, 결제완료 등)
        if (order.status === "결제완료" || order.status === "DONE") {
            html += '      <button type="button" class="btn-cancel-order" ';
            html += '              data-order-id="' + order.order_id + '" ';
            html += '              data-payment-key="' + (order.paymentkey || "") + '">주문취소</button>';
        }
        html += '    </div>';
        html += '    <div class="footer-right">';
        html += '      <span class="total-label">총 결제금액</span>';
        html += '      <span class="total-price">' + formatPrice(order.totalamount || order.order_amount) + '</span>';
        html += '    </div>';
        html += '  </div>';
        html += '</div>';
    }
    container.innerHTML = html;

    // 아이템에 클릭 이벤트 추가 (상세 모달)
    const orderItems = document.querySelectorAll(".order-card");
    orderItems.forEach(function (item) {
      item.onclick = function (e) {
        // 취소 버튼 클릭 시에는 상세 모달을 띄우지 않음
        if (e.target.classList.contains("btn-cancel-order")) return;
        
        const orderId = item.getAttribute("data-order-id");
        fetchDetail(orderId);
      };
    });

    // 주문 취소 버튼 이벤트 바인딩
    const cancelBtns = document.querySelectorAll(".btn-cancel-order");
    cancelBtns.forEach(function (btn) {
      btn.onclick = function (e) {
        e.stopPropagation(); // 카드 자체의 클릭 이벤트 방지
        var orderId = btn.getAttribute("data-order-id");
        var paymentKey = btn.getAttribute("data-payment-key");
        
        if (confirm("정말로 주문을 취소하시겠습니까?")) {
            openCancelModal(orderId, paymentKey);
        }
      };
    });
  }

  function openCancelModal(orderId, paymentKey) {
    if (!paymentKey) {
        showCustomToast("결제 키 정보가 없어 취소할 수 없습니다.", "error");
        return;
    }

    // 모달 오버레이 생성 (기존 상세 모달과 동일 클래스 활용)
    var overlay = document.createElement("div");
    overlay.id = "cancelReasonModal";
    overlay.className = "modal-overlay";
    
    var html = "";
    html += '<div class="modal-content modal-content--small">';
    html += '  <div class="modal-header">';
    html += '    <span class="modal-title">주문 취소 사유</span>';
    html += '    <span class="modal-close">&times;</span>';
    html += '  </div>';
    html += '  <div class="modal-body">';
    html += '    <p class="modal-desc">취소 사유를 입력해주세요.</p>';
    html += '    <textarea id="cancelReasonText" class="modal-textarea" placeholder="취소 사유 (예: 단순 변심)"></textarea>';
    html += '    <div class="modal-footer">';
    html += '      <button type="button" class="btn-confirm-cancel">취소 확정</button>';
    html += '      <button type="button" class="btn-close-cancel">닫기</button>';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';

    overlay.innerHTML = html;
    document.body.appendChild(overlay);
    document.body.classList.add("modal-open");

    var closeFn = function() {
        overlay.remove();
        document.body.classList.remove("modal-open");
    };

    overlay.querySelector(".modal-close").onclick = closeFn;
    overlay.querySelector(".btn-close-cancel").onclick = closeFn;
    overlay.onclick = function(e) { if (e.target === overlay) closeFn(); };

    overlay.querySelector(".btn-confirm-cancel").onclick = function() {
        var reason = qs("cancelReasonText").value.trim() || "고객 변심";
        execCancelOrder(orderId, paymentKey, reason, closeFn);
    };
  }

  function execCancelOrder(orderId, paymentKey, reason, successCallback) {
    fetch("/store/order/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            orderId: orderId,
            paymentKey: paymentKey,
            reason: reason
        })
    })
    .then(function(res) {
        if (res.ok) {
            if (window.showCustomToast) showCustomToast("주문이 취소되었습니다.", "success");
            else alert("주문이 취소되었습니다.");
            if (successCallback) successCallback();
            fetchOrderList(); // 목록 새로고침
        } else {
            throw new Error("취소 실패");
        }
    })
    .catch(function(err) {
        console.error(err);
        if (window.showCustomToast) showCustomToast("주문 취소에 실패했습니다.", "error");
        else alert("주문 취소에 실패했습니다.");
    });
  }

  function fetchDetail(orderId) {
    fetch("/store/order/getDetail/" + orderId)
    .then(function (response) {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then(function (data) {
      renderOrderDetailModal(data);
    })
    .catch(function (err) {
      console.error("Failed to fetch order detail:", err);
      if (window.showCustomToast) showCustomToast("주문 상세 정보를 불러오는데 실패했습니다.", "error");
    });
  }

  function closeOrderDetailModal() {
    var modal = qs("orderDetailModal");
    if (modal) {
      modal.remove();
      document.body.classList.remove("modal-open");
    }
  }

  // 주문 상세 정보 모달 띄우기
  function renderOrderDetailModal(order) {
    if (!order) return;

    // 모달 오버레이 생성
    var overlay = document.createElement("div");
    overlay.id = "orderDetailModal";
    overlay.className = "modal-overlay";
    
    var html = "";
    html += '<div class="modal-content">';
    html += '  <div class="modal-header">';
    html += '    <span class="modal-title">주문 상세 정보</span>';
    html += '    <span class="modal-close">&times;</span>';
    html += '  </div>';
    html += '  <div class="modal-body">';
    html += '    <div class="order-detail">';
    html += '      <div class="order-detail__item">';
    html += '        <span class="order-detail__label">주문번호</span>';
    html += '        <span class="order-detail__value">' + escHtml(order.order_id) + '</span>';
    html += '      </div>';
    
    // 주문 상품 목록 추가
    if (order.product_list && order.product_list.length > 0) {
        html += '      <div class="order-detail__products">';
        for (var k = 0; k < order.product_list.length; k++) {
            var p = order.product_list[k];
            html += '        <div class="modal-product">';
            html += '          <div class="modal-product__thumb">';
            if (p.saved_name) {
                html += '            <img src="/upload/' + escHtml(p.saved_name) + '" alt="' + escHtml(p.product_name) + '" />';
            } else {
                html += '            <div class="thumb-dummy">이미지</div>';
            }
            html += '          </div>';
            html += '          <div class="modal-product__info">';
            html += '            <div class="modal-product__name">' + escHtml(p.product_name) + '</div>';
            html += '            <div class="modal-product__count">' + p.product_count + '개</div>';
            html += '          </div>';
            html += '        </div>';
        }
        html += '      </div>';
    }

    html += '      <div class="order-detail__item">';
    html += '        <span class="order-detail__label">주문일자</span>';
    html += '        <span class="order-detail__value">' + formatDate(order.order_date) + '</span>';
    html += '      </div>';
    html += '      <div class="order-detail__item">';
    html += '        <span class="order-detail__label">주문상태</span>';
    html += '        <span class="order-detail__value">' + escHtml(order.order_status || "정보 없음") + '</span>';
    html += '      </div>';
    html += '      <div class="order-detail__item">';
    html += '        <span class="order-detail__label">결제상태</span>';
    html += '        <span class="order-detail__value">' + escHtml(order.status || "정보 없음") + '</span>';
    html += '      </div>';
    html += '      <div class="order-detail__item">';
    html += '        <span class="order-detail__label">결제수단</span>';
    html += '        <span class="order-detail__value">' + escHtml(order.method || "정보 없음") + '</span>';
    html += '      </div>';
    html += '      <div class="order-detail__item">';
    html += '        <span class="order-detail__label">배송지</span>';
    html += '        <span class="order-detail__value">' + escHtml(order.delivery_addr || "정보 없음") + '</span>';
    html += '      </div>';
    html += '      <div class="order-detail__item total-row">';
    html += '        <span class="order-detail__label">결제 예상 금액</span>';
    html += '        <span class="order-detail__value">' + formatPrice(order.order_amount) + '</span>';
    html += '      </div>';
    html += '      <div class="order-detail__item">';
    html += '        <span class="order-detail__label">사용 포인트</span>'
    html += '        <span class="order-detail__value">' + formatPrice(order.use_point) + '</span>';
    html += '      </div>';
    html += '      <div class="order-detail__item">';
    html += '        <span class="order-detail__label">적립 포인트</span>'
    html += '        <span class="order-detail__value">' + formatPrice(order.accumulate_point) + '</span>';
    html += '      </div>';
    html += '      <div class="order-detail__item">';
    html += '        <span class="order-detail__label">총 결제금액</span>';
    html += '        <span class="order-detail__value total-price">' + formatPrice(order.totalamount || order.order_amount) + '</span>';
    html += '      </div>';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';

    overlay.innerHTML = html;
    document.body.appendChild(overlay);
    document.body.classList.add("modal-open");

    // 닫기 이벤트 바인딩
    overlay.querySelector(".modal-close").onclick = closeOrderDetailModal;
    overlay.onclick = function(e) {
      if (e.target === overlay) closeOrderDetailModal();
    };
  }

  function fetchOrderList() {
    fetch("/store/order/getList")
      .then(function (response) {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then(function (data) {
        renderOrderList(data);
      })
      .catch(function (err) {
        console.error("Failed to fetch order list:", err);
        var container = qs("orderListArea");
        if (container) {
          container.innerHTML = '<div class="empty-box">주문 내역을 불러오는데 실패했습니다.</div>';
        }
      });
  }

  function init() {
    fetchOrderList();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();