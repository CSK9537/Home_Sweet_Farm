<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<jsp:include page="/WEB-INF/views/layout/header.jsp" />

<!-- StoreOrder.js가 포함되어 있어야 함 -->
<script src="${pageContext.request.contextPath}/resources/js/store/StoreOrder.js"></script>

<script>
  //이 페이지가 로드되면 바로 결제 승인 요청을 날리도록 페이지 자체에 이벤트 걸어두기
document.addEventListener("DOMContentLoaded", function() {
    // 1. URL 파라미터 추출
    const urlParams = new URLSearchParams(window.location.search);
    const paymentKey = urlParams.get("paymentKey");
    const orderId = urlParams.get("orderId");
    const amount = urlParams.get("amount");

    if (paymentKey && orderId && amount) {
        // 2. StoreOrder.js의 confirmPayment 호출
        confirmPayment(paymentKey, orderId, parseInt(amount))
            .then(isSuccess => {
                if (isSuccess) {
                    alert("결제가 최종 승인되었습니다!");
                    // 주문 완료 페이지로 이동하거나 UI 업데이트
                    location.href = "/store/order/mainPage"; //일단은 메인페이지로 이동, 나중에 주문 내역 페이지가 생기면 그쪽으로 변경
                } else {
                    alert("결제 승인 중 오류가 발생했습니다.");
                    location.href = "/store/order/cart"; //결제 승인 실패 시 장바구니로 이동
                }
            });
    } else {
        alert("비정상적인 접근입니다.");
        location.href = "/store/order/mainPage"; //비정상적인 접근 시 메인페이지로 이동
    }
});
</script><jsp:include page="/WEB-INF/views/layout/footer.jsp" />
