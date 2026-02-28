// 화면 에러 메시지
function setMsg(msgEl, text, color){
	if(!msgEl) return;
	msgEl.innerText = text || "";
	msgEl.style.color = color || (text ? "red" : "");
}

// 탭 전환 
function setActiveTab(targetId) {
  // 패널 전환
  const panels = document.querySelectorAll('.tab-panel');
  panels.forEach(p => {
    if (p.id === targetId) {
      p.classList.add('is-show');
    } else {
      p.classList.remove('is-show');
    }
  });
  
  // 탭 이동 시 기존에 띄워져 있던 결과 화면 숨기기
  const resultPanels = document.querySelectorAll('[id$="-result"]');
  resultPanels.forEach(p => p.style.display = 'none');
  
  // 탭 버튼 상태 변경
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(t => {
    const isOn = (t.getAttribute('data-target') === targetId);
    if (isOn) {
      t.classList.add('is-active');
      t.setAttribute('aria-selected', 'true');
    } else {
      t.classList.remove('is-active');
      t.setAttribute('aria-selected', 'false');
    }
  });
}

document.addEventListener("click", function (e) {
  // data-target 속성을 가진 버튼(.tab-btn, .js-go 모두 포함) 클릭 감지
  const targetBtn = e.target.closest('[data-target]');
  if (targetBtn) {
    const targetId = targetBtn.getAttribute('data-target');
    if (targetId) {
      setActiveTab(targetId);
    }
  }
});

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  setActiveTab('panel-login'); // 기본 탭: 로그인
});

// 로그인
// 요소들
const loginForm = document.querySelector("#loginForm");
const loginBtn = document.querySelector("#loginBtn");
const loginId = document.querySelector("#loginId");
const loginPw = document.querySelector("#loginPw");
const idMsg = document.querySelector("#idMsg");
const pwMsg = document.querySelector("#pwMsg");
// 리멤버미
const rememberMe = document.querySelector("#rememberMe");
const rememberHidden = document.querySelector("#rememberHidden");

// 입력 시 에러메시지 초기화
loginId.addEventListener("input", () => {idMsg.innerText = "";});
loginPw.addEventListener("input", () => {pwMsg.innerText = "";});

// 로그인
loginBtn.addEventListener("click", () => {
	
	const idVal = loginId.value.trim();
	const pwVal = loginPw.value.trim();
	
	// 빈 값 검증
	if(idVal === ""){
		setMsg(idMsg, "아이디를 입력해주세요.", "red");
		loginId.focus();
		return;
	}
	if(pwVal === ""){
		setMsg(pwMsg, "비밀번호를 입력해주세요.", "red");
		loginPw.focus();
		return;
	}
	
	// 비동기 전송 (Fetch API)
	const rememberVal = rememberHidden.value; // "Y" or "N"
	const originalBtnText = loginBtn.innerText;
	
	loginBtn.innerText = "로그인 중";
	loginBtn.disabled = true;
	
	fetch("/user/login", { 
		method: "POST",
		headers: {
			"Content-Type": "application/json; charset=utf-8"
		},
		body: JSON.stringify({
			username: idVal,
			password: pwVal,
			rememberMe: rememberVal
		})
	})
	.then(response => response.json())
	.then(data => {
		if(data.success) {
			// 성공 시 리다이렉트
			location.href = data.redirectUrl; 
		} else {
			showCustomToast("아이디 또는 비밀번호가 올바르지 않습니다.", "error");
			loginBtn.innerText = originalBtnText;
			loginBtn.disabled = false;
		}
	})
	.catch(err => {
		console.error("Login Error:", err);
		// 서버 통신 에러
		showCustomToast("서버 통신 중 오류가 발생했습니다.", "error");
		
		loginBtn.innerText = originalBtnText;
		loginBtn.disabled = false;
	});
	
});

//자동로그인: rememberMe
rememberMe.addEventListener("change", function() {
	rememberHidden.value =
	rememberMe.checked ? "Y" : "N";
});

// 아이디 찾기
// 요소들
const sendCodeBtn = document.querySelector("#sendCode-btn"); // 이메일 인증(모달 열기)
const emailBadge = document.querySelector("#emailBadge");
const nextBtn = document.querySelector("#nextBtn");
var state = {verifiedEmail: false}; // 기본 인증 상태 : 미완료

function addClass(el, c) {
	if (!el) return;
	if (el.classList) el.classList.add(c);
	else if (!hasClass(el, c)) el.className += " " + c;
}

function removeClass(el, c) {
	if (!el) return;
	if (el.classList) el.classList.remove(c);
	else el.className = el.className.replace(new RegExp("(^|\\s)" + c + "(\\s|$)", "g"), " ").replace(/\s+/g, " ").replace(/^\s|\s$/g, "");
}

function toggleClass(el, c, on) {
	if (!el) return;
	if (on) addClass(el, c);
	else removeClass(el, c);
}

function updateVerifyBadges() {
	if (emailBadge) {
		emailBadge.innerHTML = state.verifiedEmail ? "완료" : "미완료";
		toggleClass(emailBadge, "done", state.verifiedEmail);
	}
	if (sendCodeBtn) sendCodeBtn.disabled = state.verifiedEmail;
}

function updateNextBtn(){
	if(!nextBtn) return;
	nextBtn.disabled = !state.verifiedEmail;
}

document.addEventListener("emailVerifiedSuccess", function (e) {
	// 인증 완료
	state.verifiedEmail = true;
	// 아이디 설정
	const foundUserId = e.detail.userId;
	const resultIdText = document.querySelector("#resultIdText");
	if(resultIdText) {
		resultIdText.innerText = foundUserId;
	}
	// 배지 업데이트 및 다음 버튼 활성화 로직 호출
	updateVerifyBadges();
	updateNextBtn();
});
  
// 이동 버튼 클릭
if (nextBtn) {
	nextBtn.addEventListener("click", function () {
		if (!state.verifiedEmail) return;
		setActiveTab('panel-find-id-result');
	});
}
