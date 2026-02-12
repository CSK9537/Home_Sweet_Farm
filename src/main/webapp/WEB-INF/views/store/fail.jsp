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
    const code = urlParams.get("code");
    const message = urlParams.get("message");

    console.log(code, message);
    alert(message);
    location.href = "/store/cartPage";

});
</script><jsp:include page="/WEB-INF/views/layout/footer.jsp" />
