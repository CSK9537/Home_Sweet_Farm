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
	This is join.jsp
	</h1>
	
	<form action="${pageContext.request.contextPath}/user/join" method="post">
		<%-- <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/> --%>
		  <input name="username">
		  <input type="password" name="password" placeholder="비밀번호">
		  <input type="password" name="passwordConfirm" placeholder="비밀번호 확인">
		  <input name="email">
		  <button type="button" onclick="send(this.form)">가입</button>
	</form>
</body>
<script type="text/javascript">
	function send(f){
		
		let username = f.username.value;
		let pval1 = f.password.value;
		let pval2 = f.passwordConfirm.value;
		let email = f.email.value;
		
		if(!username){
			alert("아이디 입력하세요");
			return;
		}
		if(!pval1){
			alert("비밀번호를 입력하세요");
			return;
		}
		if(pval1 != pval2){
			alert("비밀번호가 일치하지 않습니다.");
			return;
		}
		if(!email){
			alert("이메일을 입력하세요");
			return;
		}
		f.passwordConfirm.remove();
		f.submit();
	}
</script>
</html>





