document.addEventListener("DOMContentLoaded", () => {
  function getCpath() {
    const path = window.location.pathname;
    const idx = path.indexOf("/", 1);
    return idx > 0 ? path.substring(0, idx) : "";
  }

  const modalEl = document.querySelector("#emailAuthModal");
  const emailSendBtn = document.querySelector("#emailAuthSendBtn");
  const emailVerifyBtn = document.querySelector("#emailAuthVerifyBtn");
  const emailInput = document.querySelector("#emailAuthAddrInput");
  const codeInput = document.querySelector("#emailAuthCodeInput");
  
  let resultEmail = '';
  let isTimerRunning = false;
  let resendTimer;
  
  document.addEventListener("resetEmailModal", () => {
    clearInterval(resendTimer); // 돌아가던 타이머 즉시 정지
    isTimerRunning = false;     // 타이머 상태 초기화
	  
    // 입력창 비우기
    if (emailInput) emailInput.value = "";
    if (codeInput) codeInput.value = "";
  
    // 발송 버튼 상태 원래대로 복구
    if (emailSendBtn) {
      emailSendBtn.classList.remove('loading');
      emailSendBtn.disabled = false;
      const textEl = emailSendBtn.querySelector('.email-auth-btn-text');
      if (textEl) textEl.textContent = "인증메일 발송";
    }
  });
  
  // 모달 열기/닫기 공통 로직
  // 부모 페이지에서 data-email-open 속성을 가진 버튼을 누르면 모달 열림
  document.addEventListener("click", (e) => {
    
	const openBtn = e.target.closest("[data-email-open]");
	
	// 열기
    if (openBtn) {
      if (modalEl) {
    	if (!isTimerRunning) {
    	  if (emailInput) emailInput.value = "";
          if (codeInput) codeInput.value = "";
    	}
        modalEl.classList.add("is-open");
        modalEl.setAttribute("aria-hidden", "false");
        
        // 모달 모드 설정
        const btnMode = openBtn.getAttribute("data-mode") || "signup";
        modalEl.setAttribute("data-mode", btnMode);
      }
    }
    // 닫기 (X 버튼이나 배경 클릭 시)
    if (e.target.closest("[data-email-close]")) {
      if (modalEl) {
        modalEl.classList.remove("is-open");
        modalEl.setAttribute("aria-hidden", "true");
      }
    }
  });

  // 검사 및 발송
  if (emailSendBtn) {
    emailSendBtn.addEventListener("click", (e) => {
      const btn = e.currentTarget;
      const textEl = btn.querySelector('.email-auth-btn-text');
      const originalText = textEl.textContent;
      const email = emailInput ? (emailInput.value || "").trim() : "";
      const mode = modalEl ? modalEl.getAttribute("data-mode") : "signup";
      
      let requestData = { email: email, mode: mode };
      let userId = "";
      
      if (btn.classList.contains('loading')) return;

      if (!email) {
        if(typeof showCustomToast === "function") showCustomToast("이메일을 입력해주세요.", "warning");
        return;
      }
      
      if (mode === "findPw") {
        const userIdInput = document.querySelector("#findPwById"); // 실제 입력칸 ID로 변경 필요
        const userId = userIdInput ? (userIdInput.value || "").trim() : "";

        if (!userId) {
          if(typeof showCustomToast === "function") showCustomToast("아이디를 먼저 입력해주세요.", "warning");
          return; // 이메일 발송 중단
        }
        
        requestData.userId = userId; // 요청 데이터에 userId 추가
      }
      
      btn.classList.add('loading');
      btn.disabled = true;
      textEl.textContent = "검사 중";
      
      fetch(getCpath() + "/checkEmail", {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=UTF-8" },
          body: JSON.stringify(requestData)
        })
        .then(response => {
          if (!response.ok) throw new Error("네트워크 에러");
          return response.json();
        })
        .then(data => {
          // 회원가입
          if (mode === "signup" && data.duplicate) {
            if(typeof showCustomToast === "function") showCustomToast("이미 가입된 이메일입니다.", "error");
            throw new Error("VALIDATION_ERROR");
          } 
          // 아이디 찾기
          else if (mode === "findId" && !data.exist) {
            if(typeof showCustomToast === "function") showCustomToast("등록되지 않은 이메일입니다.", "error");
            throw new Error("VALIDATION_ERROR");
          }
          // 비밀번호 찾기
          else if (mode === "findPw" && !data.isMatch) {
            if(typeof showCustomToast === "function") showCustomToast("아이디와 이메일 정보가 일치하지 않습니다.", "error");
            throw new Error("VALIDATION_ERROR");
          }

          textEl.textContent = "발송 중";
          return fetch("/email/send", {
            method: "POST",
            headers: { "Content-Type": "text/plain; charset=UTF-8" },
            body: email
          });
        })
        .then(response => {
          if (!response.ok) throw new Error("SEND_FAIL");
          
          if(typeof showCustomToast === "function") showCustomToast("인증코드를 발송했습니다.", "info");
          btn.classList.remove('loading');
          resultEmail = email;
          isTimerRunning = true;

          let remain = 60;
          textEl.textContent = `재전송 (${remain}s)`;
          
          resendTimer = setInterval(() => {
            remain--;
            if (remain <= 0) {
              clearInterval(resendTimer);
              btn.disabled = false;
              textEl.textContent = "인증메일 재전송";
              isTimerRunning = false;
              return;
            }
            textEl.textContent = `재전송 (${remain}s)`;
          }, 1000);
        })
        .catch(err => {
          if (err.message === "SEND_FAIL") {
            if(typeof showCustomToast === "function") showCustomToast("발송에 실패했습니다.", "error");
          }
          textEl.textContent = originalText;
          btn.classList.remove('loading');
          btn.disabled = false;
        });
    });
  }

  // 인증 완료 로직
  if (emailVerifyBtn) {
    emailVerifyBtn.addEventListener("click", function () {
      const code = codeInput ? (codeInput.value || "").trim() : "";
      
      if (!code) {
        if(typeof showCustomToast === "function") showCustomToast("인증코드를 입력해주세요.", "warning");
        return;
      }

      fetch("/email/check/" + encodeURIComponent(code), { method: "PUT" })
        .then(response => response.json().then(data => ({ status: response.status, data: data })))
        .then(({ status, data }) => {
          if (status === 202 && data.message === "verified") {
            if(typeof showCustomToast === "function") showCustomToast("인증 완료", "success");
            
            // 모달 닫기
            if (modalEl) {
              modalEl.classList.remove("is-open");
              modalEl.setAttribute("aria-hidden", "true");
            }

            // 부모 페이지로 성공 이벤트 발송
            document.dispatchEvent(new CustomEvent("emailVerifiedSuccess", {
              detail: {
            	  email: resultEmail,
            	  userId: data.userId
            	  }
            }));
          } else {
            if(typeof showCustomToast === "function") showCustomToast("코드가 올바르지 않습니다.", "error");
          }
        })
        .catch(() => {
          if(typeof showCustomToast === "function") showCustomToast("오류가 발생했습니다.", "error");
        });
    });
  }
});