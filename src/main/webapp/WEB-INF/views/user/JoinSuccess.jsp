<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Home Sweet Farm</title>
<link rel="stylesheet" href="/webjars/sweetalert2/11.10.7/dist/sweetalert2.min.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/layout/globals.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/layout/ContentLayout.css" />
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/user/JoinUser.css" />
</head>
<body>

<div class="page-shell">
  <div class="content-wrap">
    <div class="content-card">

      <div class="join-shell" id="joinShell">

        <div class="join-left" aria-label="회원가입 이미지 영역">
          <div class="join-left__inner">
            <button type="button"
                    class="join-brand"
                    onclick="location.href='${pageContext.request.contextPath}/'"
                    aria-label="메인으로 이동">
              Home Sweet Farm
            </button>
          </div>
        </div>

        <div class="join-right" style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 40px 20px;">
          
          <div class="join-right__head" style="margin-bottom: 30px;">
            <h2 class="join-title">회원가입 완료</h2>
          </div>

          <div class="success-message" style="margin-bottom: 40px;">
            <h3 style="font-size: 24px; font-weight: 600; margin-bottom: 15px;">환영합니다!</h3>
            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              <strong>Home Sweet Farm</strong>의 회원이 되신 것을 축하합니다.<br/>
              지금 바로 로그인하여 다양한 서비스를 이용해 보세요.
            </p>
          </div>

          <div class="btn-row" style="display: flex; gap: 10px; justify-content: center; width: 100%; max-width: 300px;">
            <button type="button" 
                    class="btn btn-ghost" 
                    style="flex: 1;"
                    onclick="location.href='${pageContext.request.contextPath}/'">
              메인으로
            </button>
            <button type="button" 
                    class="btn btn-primary" 
                    style="flex: 1;"
                    onclick="location.href='${pageContext.request.contextPath}/user/login'">
              로그인
            </button>
          </div>

        </div></div></div>
  </div>
</div>
<div class=hiddenMsg id="serverMsg" data-msg="${msg}"></div>
<div class=hiddenMsg id="serverMsgType" data-msgType="${msgType}"></div>
</body>
<script src="/webjars/sweetalert2/11.10.7/dist/sweetalert2.all.min.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/common/SweetAlertService.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/user/JoinUser.js"></script>
</html>