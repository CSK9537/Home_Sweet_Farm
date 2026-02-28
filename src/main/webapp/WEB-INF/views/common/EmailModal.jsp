<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common/EmailModal.css" />

<div class="email-auth-modal" id="emailAuthModal" data-mode="${empty param.mode ? 'signup' : param.mode}" aria-hidden="true" role="dialog" aria-label="이메일 인증">
  <div class="email-auth-modal__dim" data-email-close></div>
  <div class="email-auth-modal__card">
    
    <div class="email-auth-modal__head">
      <h4>이메일 인증</h4>
      <button type="button" class="email-auth-modal__x" data-email-close aria-label="닫기">×</button>
    </div>
    
    <div class="email-auth-modal__body">
      <div class="email-auth-form">
        <label class="email-auth-label" for="emailAuthAddrInput">이메일</label>
        <input class="email-auth-input" type="email" id="emailAuthAddrInput" placeholder="plant@gmail.com" />
        
        <div class="email-auth-row">
          <button type="button" class="email-auth-btn-outline" id="emailAuthSendBtn">
            <span class="email-auth-spinner"></span>
            <span class="email-auth-btn-text">인증메일 발송</span>
          </button>
        </div>

        <label class="email-auth-label" for="emailAuthCodeInput">인증코드</label>
        <input class="email-auth-input" type="text" id="emailAuthCodeInput" placeholder="인증코드 입력" />
        
        <div class="email-auth-row">
          <button type="button" class="email-auth-btn-primary" id="emailAuthVerifyBtn">인증 완료</button>
        </div>
      </div>
    </div>

  </div>
</div>

<script src="${pageContext.request.contextPath}/resources/js/common/EmailModal.js"></script>