// 화면 에러 메시지
function setMsg(msgEl, text, color){
	if(!msgEl) return;
	msgEl.innerText = text || "";
	msgEl.style.color = color || (text ? "red" : "");
}

// 탭
// 활성화된 탭
let activeTab = 'panel-login'; // 기본 로그인

// 탭 전환
function setActiveTab(targetId) {
  
  let activeTabTarget = targetId;
  if (!targetId.endsWith('-result')) clearFindProcess();
  else if (targetId.endsWith('-result')) {
    activeTabTarget = targetId.replace('-result', ''); 
  }
  // 패널 전환
  const panels = document.querySelectorAll('.tab-panel');
  panels.forEach(p => {
    if (p.id === targetId) {
      p.classList.add('is-show');
    } else {
      p.classList.remove('is-show');
    }
  });
  
  // 탭 버튼 상태 변경
  // 만약 결과 화면이라면, 꼬리표('-result')를 떼고 부모 탭을 찾음
  
  // 탭 화면 전환
  const tabs = document.querySelectorAll('.tab-btn');
  
  tabs.forEach(t => {
    const isOn = (t.getAttribute('data-target') === activeTabTarget);
    if (isOn) {
      t.classList.add('is-active');
      t.setAttribute('aria-selected', 'true');
      activeTab = activeTabTarget;
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

// 요소들
const loginForm = document.querySelector("#loginForm");
const loginBtn = document.querySelector("#loginBtn");
const loginId = document.querySelector("#loginId");
const loginPw = document.querySelector("#loginPw");
const idMsg = document.querySelector("#idMsg");
const pwMsg = document.querySelector("#pwMsg");
const rememberMe = document.querySelector("#rememberMe");
const rememberHidden = document.querySelector("#rememberHidden");
const findPwById = document.querySelector("#findPwById");
const idMsg2 = document.querySelector("#idMsg2");
const sendCodeBtn2 = document.querySelector("#sendCode-btn2");

// 로그인 창에서 입력 시 에러메시지 초기화
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

// 이메일 인증 후 다음 탭 이동
document.addEventListener("emailVerifiedSuccess", function (e) {
	
	// 아이디 찾기 다음 탭으로
	if(activeTab == 'panel-find-id') {
		const foundUserId = e.detail.userId;
		const resultIdText = document.querySelector("#resultIdText");
		
		if(resultIdText) {
			resultIdText.innerText = foundUserId;
		}
		
		setActiveTab("panel-find-id-result");
	}
	
	// 비밀번호 찾기 다음 탭으로
	if(activeTab == 'panel-find-pw') {
		setActiveTab("panel-find-pw-result");
	}
});

// 비밀번호 찾기 
function validateFindPwId() {
    let val = findPwById.value.trim();
    sendCodeBtn2.disabled = true; // 일단 검사 전에는 발송 버튼 막기
    
    // 1) 아이디 미입력 시
    if(val === ""){
        setMsg(idMsg2, "아이디를 입력해주세요.", "red");
        return;
    }
    
    // 서버 통신
    fetch("/user/checkId?username=" + encodeURIComponent(val))
    .then(response => {
        if(!response.ok || response.status != 200){
            throw new Error("서버 에러 발생");
        }
        return response.json();
    })
    .then(data => {
        let result = data.duplicate; // result -> DB에 아이디가 존재하면 true
        
        if(result){
            // 2) 아이디가 존재할 때
            setMsg(idMsg2, "아이디가 확인되었습니다. 이메일 인증을 진행해주세요.", "green");
            sendCodeBtn2.disabled = false; // 발송 버튼 활성화
        } else {
            // 3) 없는 아이디일 때
            setMsg(idMsg2, "확인되지 않은 아이디입니다.", "red");
            sendCodeBtn2.disabled = true;
        }
    })
    .catch(err => {
        console.error(err);
        sendCodeBtn2.disabled = true;
    });
}

findPwById.addEventListener('input', validateFindPwId);

//아이디 찾기 후 비밀번호 이동 경우
document.getElementById('findIdToFindPw').addEventListener('click', (e) => {
	clearFindProcess();
    if (typeof setActiveTab === "function") {
        setActiveTab('panel-find-pw');
    }
});

// 비밀번호 재설정
// 요소
const modifyPwInput = document.querySelector('#modifyPw');
const modifyPwInput2 = document.querySelector('#modifyPw2');
const modifyPwMsg2 = document.querySelector('#pwMsg2'); // 첫 번째 비번 메시지
const modifyPwMsg3 = document.querySelector('#pwMsg3'); // 두 번째 비번 메시지
const pwModifyBtn = document.querySelector('#pwModifyBtn'); // 재설정 버튼

// 상태 변수
let modifyPwOk = false;
let modifyPw2Ok = false;

// 초기 상태에서 재설정 버튼 비활성화
if (pwModifyBtn) {
	pwModifyBtn.disabled = true;
}

// 재설정 버튼 상태 업데이트 함수
function enablePwModifyBtn() {
	if (pwModifyBtn) {
		// 둘 다 true일 때만 버튼 활성화
		pwModifyBtn.disabled = !(modifyPwOk && modifyPw2Ok);
	}
}

// 새 비밀번호 입력 검증
if (modifyPwInput) {
	modifyPwInput.addEventListener("input", function () {
		const pw = modifyPwInput.value;
		const pw2 = modifyPwInput2.value;
		// 영문, 숫자, 특수문자 포함 8~20자 정규식
		const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/;
		
		if (!pwRegex.test(pw)) {
			setMsg(modifyPwMsg2, "영문, 숫자, 특수문자 포함 8~20자", "red");
			
			// 첫 번째 비번이 틀리면 두 번째 비번 상태도 초기화
			if (pw2.length > 0) {
				setMsg(modifyPwMsg3, "비밀번호 확인이 일치하지 않습니다.", "red");
			} else {
				modifyPwMsg3.innerText = "";
			}
			
			modifyPwOk = false;
			modifyPw2Ok = false;
		} else {
			setMsg(modifyPwMsg2, "사용 가능한 비밀번호입니다.", "green");
			modifyPwOk = true;
			
			// 두 번째 입력칸에 값이 있을 때만 비교 처리
			if (pw2.length > 0) {
				if (pw !== pw2) {
					setMsg(modifyPwMsg3, "비밀번호 확인이 일치하지 않습니다.", "red");
					modifyPw2Ok = false;
				} else {
					setMsg(modifyPwMsg3, "비밀번호 확인이 일치합니다.", "green");
					modifyPw2Ok = true;
				}
			}
		}       
		enablePwModifyBtn();
	});
}

//2. 새 비밀번호 확인 입력 검증
if (modifyPwInput2) {
	modifyPwInput2.addEventListener("input", function () {
		const pw = modifyPwInput.value;
		const pw2 = modifyPwInput2.value;
		
		// 첫 번째 비밀번호가 형식을 갖추지 않았다면 막기
		if (!modifyPwOk) {
			setMsg(modifyPwMsg3, "먼저 올바른 비밀번호를 입력해주세요.", "red");
			modifyPw2Ok = false;
			enablePwModifyBtn();
			return;
		}
		
		if (pw !== pw2) {
			setMsg(modifyPwMsg3, "비밀번호 확인이 일치하지 않습니다.", "red");
			modifyPw2Ok = false;
		} else {
			setMsg(modifyPwMsg3, "비밀번호 확인이 일치합니다.", "green");
			modifyPw2Ok = true;
		}
		enablePwModifyBtn();
	});
}

// 비밀번호 재설정
if (pwModifyBtn) {
	pwModifyBtn.addEventListener("click", () => {
    const newPassword = modifyPwInput.value;

    // 버튼 상태를 '처리 중'으로 변경 (중복 클릭 방지)
    const originalText = pwModifyBtn.innerText;
    pwModifyBtn.innerText = "처리 중";
    pwModifyBtn.disabled = true;

    // 서버로 새 비밀번호 전송
    fetch("/user/resetPw", { 
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({ newPassword: newPassword })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // 성공 시
        if (typeof showCustomToast === "function") showCustomToast("비밀번호가 성공적으로 변경되었습니다.", "success");
        
        // 로그인 탭으로 이동
        if (typeof setActiveTab === "function") setActiveTab('panel-login');
        
        // 폼 초기화
        
        modifyPwInput.value = "";
        modifyPwInput2.value = "";
        modifyPwMsg2.innerText = "";
        modifyPwMsg3.innerText = "";
        idMsg2.innerText = "";
        pwModifyBtn.innerText = originalText;
        
        clearFindProcess();
        
      } else {
        // 실패 시
        if (data.reason === "same_as_old") {
          if (typeof showCustomToast === "function") showCustomToast("기존 비밀번호와 동일한 비밀번호로 변경할 수 없습니다.", "error");
        } else {
          if (typeof showCustomToast === "function") showCustomToast(data.message || "비밀번호 변경에 실패했습니다.", "error");
        }
        
        // 버튼 상태 원상복구
        pwModifyBtn.innerText = originalText;
        pwModifyBtn.disabled = false;
      }
    })
    .catch(err => {
      console.error(err);
      if (typeof showCustomToast === "function") showCustomToast("서버 통신 중 오류가 발생했습니다.", "error");
      pwModifyBtn.innerText = originalText;
      pwModifyBtn.disabled = false;
    });
  });
}

function clearFindProcess() {
    
    // 비밀번호 찾기 입력창 초기화
    const inputs = [ 
        "#findPwById", "#modifyPw", "#modifyPw2"
    ];
    inputs.forEach(id => {
        const el = document.querySelector(id);
        if (el) el.value = "";
    });

    // 발송 버튼 상태 초기화
    const sendBtn = document.querySelector("#sendCodeBtn2"); // 비번찾기 발송버튼
    if (sendBtn) sendBtn.disabled = true;
    
    // 이메일 인증 모달 초기화
    document.dispatchEvent(new CustomEvent("resetEmailModal"));

    // 서버 세션 날리기
    fetch("/email/clearSession", { 
        method: "POST",
        credentials: "same-origin"
    }).catch(err => console.error("세션 초기화 실패", err));
}