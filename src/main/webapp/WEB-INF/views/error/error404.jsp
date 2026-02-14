<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>
<h1>404</h1>
<c:if test="${not empty msg}">
    <p>${msg}</p>
</c:if>
<c:if test="${empty msg}">
    <p>요청하신 페이지를 찾을 수 없습니다.</p>
</c:if>

<a href="/">메인 페이지로 이동</a>
</body>
</html>