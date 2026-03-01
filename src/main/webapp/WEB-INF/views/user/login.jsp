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
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/user/login.css">
</head>
<body>

<div class="page-shell">
  <div class="content-wrap">
    <div class="content-card">

      <div class="login-shell" id="loginShell">

        <!-- LEFT: 이미지/로고 -->
        <div class="login-left" aria-label="브랜드 영역">
          <div class="login-left__inner">
            <a class="login-brand" href="${pageContext.request.contextPath}/" title="메인페이지로 이동">
              Home Sweet Farm
            </a>
          </div>
        </div>

        <!-- RIGHT: 컨텐츠 전환 -->
        <div class="login-right">
          <div class="login-right__head">
            <h2 class="login-title">환영합니다</h2>
            <p class="login-subtitle">Home Sweet Farm에 오신 것을 환영합니다.</p>
          </div>

          <div class="step-nav" role="tablist" aria-label="로그인 메뉴">
            <button type="button" class="step-nav__btn tab-btn is-active" data-target="panel-login" role="tab" aria-selected="true">로그인</button>
            <button type="button" class="step-nav__btn tab-btn" data-target="panel-find-id" role="tab" aria-selected="false">아이디 찾기</button>
            <button type="button" class="step-nav__btn tab-btn" data-target="panel-find-id-result" role="tab" aria-selected="false" style="display:none;">아이디 찾기 결과</button>
            <button type="button" class="step-nav__btn tab-btn" data-target="panel-find-pw" role="tab" aria-selected="false">비밀번호 찾기</button>
            <button type="button" class="step-nav__btn tab-btn" data-target="panel-find-pw-result" role="tab" aria-selected="false" style="display:none;">비밀번호 찾기 결과</button>
          </div>

          <section id="panel-login" class="step-panel tab-panel is-show" role="tabpanel" aria-label="로그인">
            <form id="loginForm" autocomplete="off">
              
              <div class="form-col">
                <label class="form-label" for="loginId">아이디</label>
                <input id="loginId" name="username" class="form-input" type="text" maxlength="20" placeholder="아이디 입력" autocomplete="username" />
                <div class="errMsg"><p id="idMsg"></p></div>
              </div>

              <div class="form-col">
                <label class="form-label" for="loginPw">비밀번호</label>
                <input id="loginPw" name="password" class="form-input" type="password" maxlength="20" placeholder="비밀번호 입력" autocomplete="current-password" />
                <div class="errMsg"><p id="pwMsg"></p></div>
              </div>

              <div class="terms-row" style="margin-top: 0;">
                <input type="hidden" id="rememberHidden" name="rememberMe" value="N"/>
                <label class="chk">
                  <input type="checkbox" id="rememberMe" name="rememberMe" value="Y"/>
                  <span>로그인 상태 유지</span>
                </label>
              </div>

              <div class="btn-row">
                <button type="button" class="btn btn-primary" id="loginBtn" style="width: 100%;">로그인</button>
              </div>

              <div class="social-box" aria-label="소셜 로그인">
                <p class="social-title">다른 서비스 계정으로 로그인</p>
                <div class="social-row">
                  <button type="button" class="social-btn kakao">카카오톡</button>
                  <button type="button" class="social-btn naver">네이버</button>
                  <button type="button" class="social-btn google">구글</button>
                </div>
                <p class="login-guide">
                  아직 계정이 없으신가요?&nbsp;<a class="login-link" href="${pageContext.request.contextPath}/user/join">회원가입</a>
                </p>
              </div>
            </form>
          </section>

          <section id="panel-find-id" class="step-panel tab-panel" role="tabpanel" aria-label="아이디 찾기">
            <div class="verify-card">
              <h3 class="verify-title">이메일 인증</h3>
              <p class="verify-desc">
               	 회원님의 개인정보 보호를 위해 <strong>이메일 인증</strong>이 필요합니다.<br/>
               	 등록된 이메일을 통해 인증을 진행해주세요.
              </p>

              <div class="verify-actions">
                <button type="button" class="btn btn-outline" id="sendCode-btn1" data-email-open data-mode="findId">이메일 인증</button>
              </div>
            </div>
          </section>
            
          <section id="panel-find-id-result" class="step-panel tab-panel" >
            <div class="verify-card">
              <h3 class="verify-title">아이디 찾기 결과</h3>
              <p class="verify-desc" style="font-size: 16px; margin: 20px 0;">
                회원님의 아이디는 <br/>
                <strong id="resultIdText" style="color:#2f3b2a; font-size:20px;"></strong> 입니다.
              </p>
              <div class="btn-row">
                <button type="button" id="findIdToFindPw" class="btn btn-primary js-go" data-target="panel-find-pw" style="width:100%;">비밀번호 찾기</button>
              </div>
              <div class="btn-row">
                <button type="button" class="btn btn-primary js-go" data-target="panel-login" style="width:100%;">로그인하러 가기</button>
              </div>
            </div>
          </section>

          <section id="panel-find-pw" class="step-panel tab-panel" role="tabpanel" aria-label="비밀번호 찾기">
            <form id="findPwForm" method="post" action="${pageContext.request.contextPath}/user/findPw" autocomplete="off">
              
              <div class="form-col">
                <label class="form-label" for="findPwId">아이디</label>
                <input id="findPwById" name="username" class="form-input" type="text" placeholder="아이디 입력" />
                <div class="errMsg"><p id="idMsg2"></p></div>
              </div>

              <div class="verify-card">
                <h3 class="verify-title">이메일 인증</h3>
                <p class="verify-desc">
                 	 회원님의 개인정보 보호를 위해 <strong>이메일 인증</strong>이 필요합니다.<br/>
                 	 등록된 이메일을 통해 인증을 진행해주세요.
                </p>

                <div class="verify-actions">
                  <button type="button" class="btn btn-outline" id="sendCode-btn2" data-email-open data-mode="findPw" disabled>이메일 인증</button>
                </div>
              </div>

            </form>
          </section>
            
          <section id="panel-find-pw-result" class="step-panel tab-panel">
            <div class="verify-card">
              <h3 class="verify-title">비밀번호 재설정</h3>
              
              <form id="modifyPwForm" autocomplete="off">
                <div class="form-col">
                  <label class="form-label" for="loginPw">비밀번호</label>
                  <input id="modifyPw" name="password" class="form-input" type="password" maxlength="20" placeholder="영문 대/소문자, 숫자, 특수문자 포함 8~20자" />
                  <div class="errMsg"><p id="pwMsg2"></p></div>
                </div>
                
                <div class="form-col">
                  <label class="form-label" for="loginPw">비밀번호 확인</label>
                  <input id="modifyPw2" name="confirmPassword" class="form-input" type="password" maxlength="20" placeholder="비밀번호 확인" />
                  <div class="errMsg"><p id="pwMsg3"></p></div>
                </div>
                
                <div class="btn-row">
                  <button type="button" id="pwModifyBtn" class="btn btn-primary" style="width:100%;" disabled>재설정</button>
                </div>
              </form>
            </div>
          </section>

        </div></div></div>
  </div>
</div>
<jsp:include page="/WEB-INF/views/common/EmailModal.jsp">
	<jsp:param name="mode" value="find" />
</jsp:include>
<div class="hiddenMsg" id="serverMsg" data-msg="${msg}"></div>
<div class="hiddenMsg" id="serverMsgType" data-msgType="${msgType}"></div>
</body>
<script src="/webjars/sweetalert2/11.10.7/dist/sweetalert2.all.min.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/common/SweetAlertService.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/user/login.js"></script>
</html>