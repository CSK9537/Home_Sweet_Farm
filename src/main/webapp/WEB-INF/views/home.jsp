<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<jsp:include page="/WEB-INF/views/layout/header.jsp" />
<button class="tmp">클릭</button>
<script>
document.querySelector('.tmp').addEventListener('click', (e) => {
	GlobalProfileModal.open(632);
});
</script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />