<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/main.css">
<%@ include file="/WEB-INF/views/layout/header.jsp" %>
<div class="page-shell">
	<div class="content-wrap">
		<c:choose>
			<c:when test="${not empty q}">
				${q}
				<c:if test="${not empty main}">
					${main}
				</c:if>
				<c:if test="${not empty sub}">
					${sub}
				</c:if>
			</c:when>
			<c:otherwise>
				검색 결과 없음
			</c:otherwise>
		</c:choose>
	</div>
</div>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />