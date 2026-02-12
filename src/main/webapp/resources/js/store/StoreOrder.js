/**
 * StoreOrder.js
 * 토스 페이먼츠 결제 및 주문 처리 로직 (Standard SDK v2 + .then() 구조)
 */

/**
 * 1. 결제 준비 및 주문 정보 저장 요청
 * @param {Object} orderInfo - 주문 정보
 * @param {Function} callback - 결제창 호출을 위한 콜백 함수
 */
function requestOrderReady(orderInfo, callback) {
    console.log("주문 준비 요청 시작", orderInfo);
    
    fetch('/store/order/ready', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderInfo)
    })
    .then(response => {
        if (!response.ok) throw new Error('주문 준비 중 서버 에러 발생');
        return response.text();
    })
    .then(orderId => {
        console.log("주문 ID 수령:", orderId);
        if (orderId && callback) {
            callback(orderId);
        } else {
            console.error("주문 ID가 없거나 콜백이 정의되지 않음");
        }
    })
    .catch(error => {
        console.error('Order Ready Error:', error);
        alert('주문 처리 중 오류가 발생했습니다.');
    });
}

/**
 * 2. 토스 결제창 호출 (Standard SDK v2 방식)
 * @param {String} method - 결제 수단 ('CARD', 'TRANSFER', 'VIRTUAL_ACCOUNT', 'MOBILE_PHONE', 'CULTURE_GIFT_CERTIFICATE', 'BOOK_GIFT_CERTIFICATE', 'GAME_GIFT_CERTIFICATE')
 * @param {Object} paymentConfig - 결제 설정 (amount, orderId, orderName)
 */
function startTossPayment(method, paymentConfig) {
    console.log("토스 결제창 호출", method, paymentConfig);
    
    // Standard SDK v2: tossPayments.payment()를 통해 결제 인스턴스 생성 후 호출
    const payment = tossPayments.payment({
        customerKey: "ANONYMOUS", // 회원 결제의 경우 매핑된 키 사용, 비회원은 ANONYMOUS 등
    });

    payment.requestPayment({
        method: method.toUpperCase(), // 'CARD', 'TRANSFER' 등
        amount: {
            currency: "KRW",
            value: paymentConfig.amount
        },
        orderId: paymentConfig.orderId,
        orderName: paymentConfig.orderName,
        successUrl: window.location.origin + "/store/order/success",
        failUrl: window.location.origin + "/store/order/fail",
        customerName: paymentConfig.customerName || "고객",
    })
    .catch(error => {
        if (error.code === 'USER_CANCEL') {
            console.log('사용자가 결제를 취소했습니다.');
        } else {
            console.error('Payment Request Error:', error);
            alert('결제 요청 중 오류가 발생했습니다: ' + error.message);
        }
    });
}

/**
 * 3. 결제 최종 승인 요청 (Success 페이지에서 호출)
 */
function confirmPayment(paymentKey, orderId, amount) {
    return fetch('/store/order/confirm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            paymentKey: paymentKey,
            orderId: orderId,
            amount: amount
        })
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        }
        throw new Error('승인 요청 실패');
    })
    .then(result => result === 'success')
    .catch(error => {
        console.error('Confirm Payment Error:', error);
        return false;
    });
}

/**
 * 공용 주문 프로세스 실행 함수
 * @param {String} method - 'CARD', 'TRANSFER' 등
 */
function processOrder(method) {
    // 1. 데이터 수집
    const orderInfo = {
        use_point: parseInt(document.getElementById('use_point')?.value || 0),
        order_amount: parseInt(document.getElementById('totalPrice')?.textContent.replace(/[^0-9]/g, '') || 0),
        accumulate_point: 0, // 필요 시 계산 로직 추가
        delivery_addr: "기본 배송지", // 실제 배송지 입력 필드가 있다면 해당 값 사용
        products: getProductListData()
    };

    if (orderInfo.products.length === 0) {
        alert('주문할 상품이 없습니다.');
        return;
    }

    // 2. 서버에 주문 준비 요청 후 결제창 호출
    requestOrderReady(orderInfo, function(orderId) {
        startTossPayment(method, {
            amount: orderInfo.order_amount,
            orderId: orderId,
            orderName: "Home Sweet Farm 상품 주문"
        });
    });
}

/**
 * 상품 리스트 수집 함수
 */
function getProductListData() {
    const products = [];
    // cart.jsp의 product-card 구조에 맞춰 데이터 수집
    document.querySelectorAll('.product-card').forEach(card => {
        // - 버튼이나 + 버튼 근처의 data-id 활용 또는 수량 element id 활용
        const btn = card.querySelector('.btn-plus-cart');
        const countText = card.querySelector('[id^="product_count_"]');
        
        if (btn && countText) {
            products.push({
                product_id: parseInt(btn.dataset.id),
                product_count: parseInt(countText.textContent)
            });
        }
    });
    return products;
}
