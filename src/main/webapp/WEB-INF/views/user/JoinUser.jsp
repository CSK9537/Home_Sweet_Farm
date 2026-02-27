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

        <!-- LEFT: 이미지/로고 -->
        <div class="join-left" aria-label="회원가입 이미지 영역">
          <div class="join-left__inner">
            <button type="button"
                    class="join-brand"
                    id="goHomeBtn"
                    aria-label="메인으로 이동">
              	Home Sweet Farm
            </button>
          </div>
        </div>

        <!-- RIGHT: 컨텐츠 전환 -->
        <div class="join-right">
          <div class="join-right__head">
            <h2 class="join-title">회원가입</h2>
          </div>

          <!-- STEP NAV (현재 상태 표시용) -->
          <div class="step-nav" role="tablist" aria-label="회원가입 단계">
            <button type="button" class="step-nav__btn is-active" data-step-link="account" role="tab" aria-selected="true">
              	계정
            </button>
            <button type="button" class="step-nav__btn" id="verifynav" data-step-link="verify" role="tab" aria-selected="false" disabled>
              	이메일 인증
            </button>
            <button type="button" class="step-nav__btn" id="profilenav" data-step-link="profile" role="tab" aria-selected="false" disabled>
              	회원정보
            </button>
          </div>
			<c:if test="${not empty error}">
				  <div style="color:red; margin-bottom:10px;">${error}</div>
			</c:if>
          <!-- STEP 1: 계정 정보 -->
          <section class="step-panel is-active" id="step-account" data-step="account" aria-label="계정 정보">
            <form id="accountForm" autocomplete="off">
              <div class="form-col">
                <label class="form-label" for="userId">아이디</label>
                <div class="login-group">
                  <input class="form-input" type="text" id="userId" name="username"
                         placeholder="아이디 입력 (6~20자)" minlength="6" maxlength="20" required />
                  
                  <!-- 중복확인 버튼 -->
				  <button type="button" id="checkIdBtn" class="btn btn-ghost" disabled>중복확인</button>
				</div>
				  <!-- 결과 메시지-id -->
				  <div class="errMsg">
				  	<p id="idMsg"></p> 
				  </div>
              </div>

              <div class="form-col">
                <label class="form-label" for="userPw">비밀번호</label>
                <input class="form-input" type="password" id="userPw" name="password"
                       placeholder="영문 대/소문자, 숫자, 특수문자 포함 8~20자"
                       minlength="8" maxlength="20" required />
                   <!-- 결과 메시지-pw -->
                   <div class="errMsg">
	                   <p id="pwMsg"></p> 
				   </div>
              </div>

              <div class="form-col">
                <label class="form-label" for="userPw2">비밀번호 확인</label>
                <input class="form-input" type="password" id="userPw2" name="confirmPassword"
                       placeholder="비밀번호 확인" minlength="8" maxlength="20" required />
                   <!-- 결과 메시지-pw2 -->
                   <div class="errMsg">
	                   	<p id="pwMsg2"></p> 
				   </div>
              </div>

              <div class="terms-box">
                <div class="terms-row">
                  <label class="chk">
                    <input type="checkbox" id="agreeAll" />
                    <span>전체 동의</span>
                  </label>
                </div>

                <div class="terms-row">
                  <label class="chk">
                    <input type="checkbox" class="agree-item" id="agreeService" required />
                    <span><em class="req">[필수]</em> 서비스 이용약관 동의</span>
                  </label>
                  <button type="button" class="link-btn" data-modal-open="modal-service">보기</button>
                </div>

                <div class="terms-row">
                  <label class="chk">
                    <input type="checkbox" class="agree-item" id="agreePrivacy" required />
                    <span><em class="req">[필수]</em> 개인정보 처리방침 동의</span>
                  </label>
                  <button type="button" class="link-btn" data-modal-open="modal-privacy">보기</button>
                </div>

                <div class="terms-row">
                  <label class="chk">
                    <input type="checkbox" class="agree-item" id="agreeMarketing" />
                    <span>[선택] 마케팅 정보 수신 동의</span>
                  </label>
                  <button type="button" class="link-btn" data-modal-open="modal-marketing">보기</button>
                </div>

                <p class="security-note">
                 	 회원가입은 민감 정보(비밀번호/연락처/이메일)를 포함합니다. 공용 PC에서는 자동완성을 주의하세요.
                </p>
              </div>

              <div class="btn-row">
                <button type="button" class="btn btn-primary" id="toVerifyBtn" disabled>다음</button>
              </div>

              <div class="social-box" aria-label="소셜 회원가입">
                <p class="social-title">다른 서비스 계정으로 회원가입</p>
                <div class="social-row">
                  <button type="button" class="social-btn kakao">카카오톡</button>
                  <button type="button" class="social-btn naver">네이버</button>
                  <button type="button" class="social-btn google">구글</button>
                </div>
                <p class="login-guide">
             	 이미 회원가입 하셨다면?&nbsp;<a class="login-link" href="${pageContext.request.contextPath}/user/login">로그인</a>
             	 </p>
              </div>
              
            </form>
          </section>
		<body>
          <!-- STEP 2: 이메일 인증 -->
          <section class="step-panel" id="step-verify" data-step="verify" aria-label="이메일 인증">
            <div class="verify-card">
              <h3 class="verify-title">이메일 인증</h3>
              <p class="verify-desc">
               	 회원님의 개인정보 보호를 위해 <strong>이메일 인증</strong>이 필요합니다.<br/>
                	인증을 진행해주세요.
              </p>

              <div class="verify-actions">
                <button type="button" class="btn btn-outline" id="sendCode-btn" data-modal-open="modal-email">이메일 인증</button>
              </div>


              <div class="verify-status">
                <div class="status-line">
                  <span>이메일 인증</span>
                  <span class="badge" id="emailBadge">미완료</span>
                </div>
              </div>

              <div class="btn-row">
                <button type="button" class="btn btn-primary" id="toProfileBtn">다음</button>
              </div>
              <p class="verify-msg">※ 이메일 인증 완료 후 다음 단계로 이동할 수 있습니다.</p>
            </div>
          </section>
         
          <!-- STEP 3: 회원정보 입력 + 최종 가입 -->
          <section class="step-panel" id="step-profile" data-step="profile" aria-label="회원정보 입력">
            <!-- 최종 제출 폼 (서버 insert용) -->
            <form id="joinForm" method="post" action="${pageContext.request.contextPath}/user/join" autocomplete="off">
              <!-- STEP1 값들 hidden으로 전달 -->
              <input type="hidden" name="username" id="hidUserId" />
              <input type="hidden" name="password" id="hidUserPw" />
              <input type="hidden" name="confirmPassword" id="hidUserPw2" />
              <input type="hidden" name="confirm_service" id="hidAgreeService"  value="0"/>
              <input type="hidden" name="confirm_userinfo" id="hidAgreePrivacy" value="0"/>
              <input type="hidden" name="confirm_event" id="hidAgreeMarketing" value="0"/>
              <input type="hidden" id="hidVerifiedSms" />
              <input type="hidden" id="hidVerifiedEmail" />

              <div class="profile-head">
                <h3 class="profile-title">회원 정보 입력</h3>
                <p class="profile-note"><span class="req">*</span> 선택사항은 로그인 후 마이페이지에서 수정 가능</p>
              </div>

              <div class="form-grid">
                <div class="form-col">
                  <label class="form-label" for="userName">이름</label>
                  <input class="form-input" type="text" id="userName" name="name" placeholder="이름 입력" />
                </div>

                <div class="form-col">
                  <label class="form-label" for="userNick">닉네임</label>
                  <input class="form-input" type="text" id="userNick" name="nickname" placeholder="닉네임 입력" />
                </div>

                <div class="form-col">
                  <label class="form-label" for="userInterest">관심사</label>
                  <input class="form-input" type="text" name="aspectNames" id="userInterest" placeholder="다육식물, 병해충, 비료" />
                </div>

                <div class="form-col">
                  <label class="form-label">관심식물</label>
                  <div class="chips-wrap">
                    <div class="chips" id="interestChips" aria-label="선택된 관심식물"></div>
                    <button type="button" class="chip-add" data-modal-open="modal-interest">+</button>
                  </div>
                </div>

                <div class="form-col">
                  <label class="form-label" for="userBirth">생년월일</label>
                  <input class="form-input" type="date" id="userBirth" name="brith_date_js" placeholder="yyyy.mm.dd" />
                </div>

                <div class="form-col">
                  <label class="form-label" for="userPhone">휴대전화번호</label>
                  <input class="form-input" type="text" id="userPhone" name="phone" placeholder="휴대전화번호를 입력하세요.(- 포함)" />
                </div>

                <div class="form-col">
                  <label class="form-label" for="userAddr">주소</label>
                  <input class="form-input" type="text" id="userAddr" name="address" placeholder="주소 입력" />
                </div>
                
                <div class="form-col">
                  <label class="form-label" for="userEmail">이메일 주소</label>
                  <input class="form-input no-click" type="email" id="userEmail" name="email" placeholder="이메일 인증 후 자동 입력됩니다." readonly/>
                </div>

              </div>

              <div class="btn-row end">
                <button type="submit" class="btn btn-primary" id="joinSubmitBtn">회원가입</button>
              </div>
            </form>
          </section>

        </div><!-- /join-right -->
      </div><!-- /join-shell -->

      <!-- ===== MODALS ===== -->
      <div class="modal" id="modal-service" aria-hidden="true" role="dialog" aria-label="서비스 이용약관">
        <div class="modal__dim" data-modal-close></div>
        <div class="modal__card">
          <div class="modal__head">
            <h4>서비스 이용약관</h4>
            <button type="button" class="modal__x" data-modal-close aria-label="닫기">×</button>
          </div>
          <div class="modal__body"></div>
          <div class="modal__foot">
            <button type="button" class="btn btn-primary" data-modal-close>확인</button>
          </div>
        </div>
      </div>

      <div class="modal" id="modal-privacy" aria-hidden="true" role="dialog" aria-label="개인정보 처리방침">
        <div class="modal__dim" data-modal-close></div>
        <div class="modal__card">
          <div class="modal__head">
            <h4>개인정보 처리방침</h4>
            <button type="button" class="modal__x" data-modal-close aria-label="닫기">×</button>
          </div>
          <div class="modal__body"></div>
          <div class="modal__foot">
            <button type="button" class="btn btn-primary" data-modal-close>확인</button>
          </div>
        </div>
      </div>

      <div class="modal" id="modal-marketing" aria-hidden="true" role="dialog" aria-label="마케팅 정보 수신 동의">
        <div class="modal__dim" data-modal-close></div>
        <div class="modal__card">
          <div class="modal__head">
            <h4>마케팅 정보 수신 동의</h4>
            <button type="button" class="modal__x" data-modal-close aria-label="닫기">×</button>
          </div>
          <div class="modal__body">
            <p class="modal__text">
              (예시) 마케팅 수신 동의 안내. 선택 동의이며 거부해도 서비스 이용에 제한이 없어야 합니다.
            </p>
          </div>
          <div class="modal__foot">
            <button type="button" class="btn btn-primary" data-modal-close>확인</button>
          </div>
        </div>
      </div>


      <div class="modal" id="modal-email" aria-hidden="true" role="dialog" aria-label="이메일 인증">
        <div class="modal__dim" data-modal-close></div>
        <div class="modal__card">
          <div class="modal__head">
            <h4>이메일 인증</h4>
            <button type="button" class="modal__x" data-modal-close aria-label="닫기">×</button>
          </div>
          <div class="modal__body">
            <div class="modal-form">
              <label class="form-label" for="emailAddr">이메일</label>
              <input class="form-input" type="email" id="emailAddr" placeholder="plant@gmail.com" />
              <div class="modal-mini-row">
                <button type="button" class="btn btn-outline" id="emailSendBtn">
                  <span class="spinner"></span>
                  <span class="btn-text">인증메일 발송</span>
                </button>
              </div>

              <label class="form-label" for="emailCode">인증코드</label>
              <input class="form-input" type="text" id="emailCode" placeholder="인증코드 입력" />
              <div class="modal-mini-row">
                <button type="button" class="btn btn-primary" id="emailVerifyBtn">인증 완료</button>
              </div>

              <p class="hint">
                	실제 발송/검증은 서버에서 처리하세요. 여기서는 UI 흐름만 제공합니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="modal" id="modal-interest" aria-hidden="true" role="dialog" aria-label="관심식물 추가">
        <div class="modal__dim" data-modal-close></div>
        <div class="modal__card">
          <div class="modal__head">
            <h4>관심식물 추가</h4>
            <button type="button" class="modal__x" data-modal-close aria-label="닫기">×</button>
          </div>
          <div class="modal__body">
            <div class="modal-form">
              <label class="form-label" for="plantNameInput">식물명</label>
              <input class="form-input" type="text" id="plantNameInput" placeholder="예) 몬스테라" />
              <div class="modal-mini-row">
                <button type="button" class="btn btn-primary" id="addPlantBtn">추가</button>
              </div>
              <p class="hint">추가된 항목은 칩 형태로 표시되며, 클릭으로 삭제됩니다.</p>
            </div>
          </div>
        </div>
      </div>
      <!-- ===== /MODALS ===== -->

    </div>
  </div>
</div>
<div class=hiddenMsg id="serverMsg" data-msg="${msg}"></div>
<div class=hiddenMsg id="serverMsgType" data-msgType="${msgType}"></div>
</body>
<script src="/webjars/sweetalert2/11.10.7/dist/sweetalert2.all.min.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/common/SweetAlertService.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/user/JoinUser.js"></script>
</html>