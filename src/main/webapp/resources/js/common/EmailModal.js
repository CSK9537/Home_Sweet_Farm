document.addEventListener("DOMContentLoaded", () => {
  function getCpath() {
    const path = window.location.pathname;
    const idx = path.indexOf("/", 1);
    return idx > 0 ? path.substring(0, idx) : "";
  }

  const modalEl = document.querySelector("#emailAuthModal");
  const emailSendBtn = document.querySelector("#emailAuthSendBtn");
  const emailVerifyBtn = document.querySelector("#emailAuthVerifyBtn");
  let resultEmail = '';

  // 1. 모달 열기/닫기 공통 로직
  // 부모 페이지에서 data-email-open 속성을 가진 버튼을 누르면 모달 열림
  document.addEventListener("click", (e) => {
    // 열기
    if (e.target.closest("[data-email-open]")) {
      if (modalEl) {
        modalEl.classList.add("is-open");
        modalEl.setAttribute("aria-hidden", "false");
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

  // 2. 발송 및 중복 검사 로직 (변경된 ID 적용)
  if (emailSendBtn) {
    emailSendBtn.addEventListener("click", (e) => {
      const btn = e.currentTarget;
      const textEl = btn.querySelector('.email-auth-btn-text');
      const originalText = textEl.textContent;
      const emailInput = document.querySelector("#emailAuthAddrInput");
      const email = emailInput ? (emailInput.value || "").trim() : "";
      
      if (btn.classList.contains('loading')) return;

      if (!email) {
        if(typeof showCustomToast === "function") showCustomToast("이메일을 입력해주세요.", "warning");
        return;
      }

      btn.classList.add('loading');
      btn.disabled = true;
      textEl.textContent = "검사 중";

      fetch(getCpath() + "/checkEmail?email=" + encodeURIComponent(email))
        .then(response => {
          if (!response.ok) throw new Error("네트워크 에러");
          return response.json();
        })
        .then(data => {
          const mode = modalEl ? modalEl.getAttribute("data-mode") : "signup";

          if (mode === "signup" && data.duplicate) {
            if(typeof showCustomToast === "function") showCustomToast("이미 가입된 이메일입니다.", "error");
            throw new Error("DUPLICATE_ERROR");
          } else if (mode === "find" && !data.duplicate) {
            if(typeof showCustomToast === "function") showCustomToast("등록되지 않은 이메일입니다.", "error");
            throw new Error("NOT_FOUND_ERROR");
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

          let remain = 60;
          textEl.textContent = `재전송 (${remain}s)`;
          let resendTimer = setInterval(() => {
            remain--;
            if (remain <= 0) {
              clearInterval(resendTimer);
              btn.disabled = false;
              textEl.textContent = "인증메일 재전송";
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

  // 3. 인증 완료 로직
  if (emailVerifyBtn) {
    emailVerifyBtn.addEventListener("click", function () {
      const codeEl = document.querySelector("#emailAuthCodeInput");
      const code = codeEl ? (codeEl.value || "").trim() : "";
      
      if (!code) {
        if(typeof showCustomToast === "function") showCustomToast("인증코드를 입력해주세요.", "warning");
        return;
      }

      fetch("/email/check/" + encodeURIComponent(code), { method: "PUT" })
        .then(response => response.json().then(data => ({ status: response.status, data: data })))
        .then(({ status, text }) => {
          if (status === 202 && text === "verified") {
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