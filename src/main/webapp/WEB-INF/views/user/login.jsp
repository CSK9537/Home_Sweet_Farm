<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<jsp:include page="/WEB-INF/views/layout/header.jsp" />

<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/user/login.css">

<div class="page-shell">
  <div class="content-wrap">
    <div class="content-card">

      <div class="login-layout">

        <!-- LEFT: 이미지 + 로고 -->
        <div class="login-left" aria-label="브랜드 영역">
          <a class="brand-logo" href="${pageContext.request.contextPath}/" title="메인페이지로 이동">
            Home Sweet Farm
          </a>
        </div>

        <!-- RIGHT: 버튼(탭) + 내용 -->
        <div class="login-right">
          <div class="right-inner">

            <div class="right-tabs" role="tablist" aria-label="로그인 메뉴">
              <button type="button" class="tab-btn is-active" data-target="panel-login" role="tab" aria-selected="true">로그인</button>
              <button type="button" class="tab-btn" data-target="panel-find-id" role="tab" aria-selected="false">아이디 찾기</button>
              <button type="button" class="tab-btn" data-target="panel-find-pw" role="tab" aria-selected="false">비밀번호 찾기</button>
              <a class="tab-link" href="${pageContext.request.contextPath}/user/JoinUser" title="회원가입 페이지로 이동">회원가입</a>
            </div>

            <!-- PANEL: 로그인 -->
            <section id="panel-login" class="tab-panel is-show" role="tabpanel" aria-label="로그인">
              <h2 class="panel-title">로그인</h2>

              <form class="form-block" method="post" action="${pageContext.request.contextPath}/user/login" autocomplete="off">
                <label class="input-label" for="loginId">아이디</label>
                <input id="loginId" name="username" class="text-input" type="text" maxlength="20"
                       placeholder="아이디" autocomplete="username" />                       


                <label class="input-label" for="loginPw">비밀번호</label>
                <input id="loginPw" name="password" class="text-input" type="password" maxlength="20"
                       placeholder="비밀번호" autocomplete="current-password" />


                <div class="row-between">
                  <label class="check-wrap">
                    <input type="checkbox" id="rememberMe" name="rememberMe" />
                    <span>로그인 상태 유지</span>
                  </label>
                </div>

                <button type="submit" class="btn-primary" id="loginBtn">로그인</button>

                <div class="social-block" aria-label="소셜 로그인">
                  <button type="button" class="btn-social kakao">카카오톡 계정으로 로그인</button>
                  <button type="button" class="btn-social naver">네이버 계정으로 로그인</button>
                  <button type="button" class="btn-social google">구글 계정으로 로그인</button>
                </div>

                <div class="helper-links">
                  <button type="button" class="helper-link js-go" data-target="panel-find-id">아이디 찾기</button>
                  <span class="sep">|</span>
                  <button type="button" class="helper-link js-go" data-target="panel-find-pw">비밀번호 찾기</button>
                  <span class="sep">|</span>
                  <a class="helper-link" href="${pageContext.request.contextPath}/user/JoinUser">회원가입</a>
                </div>

                <p class="security-note">
                  로그인 페이지입니다. 아이디/비밀번호 등 민감정보 입력에 유의하세요.
                </p>
              </form>
            </section>

            <!-- PANEL: 아이디 찾기 -->
            <section id="panel-find-id" class="tab-panel" role="tabpanel" aria-label="아이디 찾기">
              <h2 class="panel-title">아이디 찾기</h2>

              <form class="form-block" method="post" action="${pageContext.request.contextPath}/user/findId" autocomplete="off">
                <label class="input-label" for="findIdName">가입자 이름</label>
                <input id="findIdName" name="name" class="text-input" type="text" placeholder="이름" />

                <label class="input-label" for="findIdPhone">전화번호 또는 본인확인용 이메일</label>
                <input id="findIdPhone" name="contact" class="text-input" type="text" placeholder="전화번호 또는 본인확인용 이메일" />

                <div class="row-between">
                  <span class="mini-hint">인증번호를 입력해 주세요</span>
                </div>

                <div class="code-boxes" aria-label="인증번호 입력">
                  <input class="code-input" type="text" maxlength="1" inputmode="numeric" />
                  <input class="code-input" type="text" maxlength="1" inputmode="numeric" />
                  <input class="code-input" type="text" maxlength="1" inputmode="numeric" />
                  <input class="code-input" type="text" maxlength="1" inputmode="numeric" />
                  <input class="code-input" type="text" maxlength="1" inputmode="numeric" />
                  <input class="code-input" type="text" maxlength="1" inputmode="numeric" />
                </div>

                <div class="row-between">
                  <span class="timer" aria-label="남은 시간"><span class="time">03:00</span></span>
                  <button type="button" class="btn-ghost">재전송</button>
                </div>

                <button type="submit" class="btn-primary">다음</button>

                <div class="helper-links">
                  <button type="button" class="helper-link js-go" data-target="panel-login">로그인하러 가기</button>
                </div>
              </form>
            </section>

            <!-- PANEL: 비밀번호 찾기 -->
            <section id="panel-find-pw" class="tab-panel" role="tabpanel" aria-label="비밀번호 찾기">
              <h2 class="panel-title">비밀번호 찾기</h2>

              <form class="form-block" method="post" action="${pageContext.request.contextPath}/user/findPw" autocomplete="off">
                <label class="input-label" for="findPwId">아이디</label>
                <input id="findPwId" name="username" class="text-input" type="text" placeholder="아이디" />

                <label class="input-label" for="findPwContact">전화번호 또는 본인확인용 이메일</label>
                <input id="findPwContact" name="contact" class="text-input" type="text" placeholder="전화번호 또는 본인확인용 이메일" />

                <div class="row-between">
                  <span class="mini-hint">인증번호를 입력해 주세요</span>
                </div>

                <div class="code-boxes" aria-label="인증번호 입력">
                  <input class="code-input" type="text" maxlength="1" inputmode="numeric" />
                  <input class="code-input" type="text" maxlength="1" inputmode="numeric" />
                  <input class="code-input" type="text" maxlength="1" inputmode="numeric" />
                  <input class="code-input" type="text" maxlength="1" inputmode="numeric" />
                  <input class="code-input" type="text" maxlength="1" inputmode="numeric" />
                  <input class="code-input" type="text" maxlength="1" inputmode="numeric" />
                </div>

                <div class="row-between">
                  <span class="timer"><span class="time">03:00</span></span>
                  <button type="button" class="btn-ghost">재전송</button>
                </div>

                <div class="row-between">
                  <button type="submit" class="btn-primary">다음</button>
                  <button type="button" class="btn-secondary js-go" data-target="panel-login">로그인하러 가기</button>
                </div>

                <p class="security-note">
                  본인확인 후 비밀번호 재설정 단계로 이동합니다. 민감정보 입력에 유의하세요.
                </p>
              </form>
            </section>

          </div>
        </div>

      </div><!-- /login-layout -->

    </div><!-- /content-card -->
  </div><!-- /content-wrap -->
</div><!-- /page-shell -->

<script src="${pageContext.request.contextPath}/resources/js/user/login.js"></script>

<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
