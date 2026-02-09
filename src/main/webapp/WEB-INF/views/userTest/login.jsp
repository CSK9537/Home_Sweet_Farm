<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>
	<h1>
	This is login.jsp
	</h1>
	
	<form action="${pageContext.request.contextPath}/user/login" method="post">
		 <input name="username" placeholder="아이디">
		  <input type="password" name="password" placeholder="비밀번호">
		  <button type="submit" >로그인</button>
	</form>
</body>
</html>