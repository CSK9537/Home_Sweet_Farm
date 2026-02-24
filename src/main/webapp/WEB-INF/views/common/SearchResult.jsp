<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/main.css">
<%@ include file="/WEB-INF/views/layout/header.jsp" %>
<div class="page-shell">
	<div class="content-wrap">
		<section class="hero">
			<c:choose>
				<c:when test="${not empty q}">
					<p id="q">${q}</p>
					<div class="tmp"></div>
					<c:if test="${main == '커뮤니티'}">
						${main}
					</c:if>
					<c:if test="${main == '식물'}">
						${main}
					</c:if>
					<c:if test="${main == '스토어'}">
						${main}
					</c:if>
					<c:if test="${main == 'Q&A'}">
						${main}
					</c:if>
				</c:when>
				<c:otherwise>
					검색 결과 없음
				</c:otherwise>
			</c:choose>
		</section>
	</div>
</div>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
<script src="${pageContext.request.contextPath}/resources/js/common/SearchService.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/common/SearchResult.js"></script>