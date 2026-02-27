(function () {
  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }
  function qsa(sel, root) {
    return (root || document).querySelectorAll(sel);
  }

  function setActiveTab(targetId) {
    var tabs = qsa('.tab-btn');
    var panels = qsa('.tab-panel');

    for (var i = 0; i < tabs.length; i++) {
      var t = tabs[i];
      var isOn = (t.getAttribute('data-target') === targetId);
      if (isOn) {
        t.className = 'tab-btn is-active';
        t.setAttribute('aria-selected', 'true');
      } else {
        t.className = 'tab-btn';
        t.setAttribute('aria-selected', 'false');
      }
    }

    for (var j = 0; j < panels.length; j++) {
      var p = panels[j];
      if (p.id === targetId) {
        p.className = 'tab-panel is-show';
      } else {
        p.className = 'tab-panel';
      }
    }
  }

  function wireTabs() {
    var tabs = qsa('.tab-btn');
    for (var i = 0; i < tabs.length; i++) {
      (function (btn) {
        btn.onclick = function () {
          var target = btn.getAttribute('data-target');
          if (target) setActiveTab(target);
        };
      })(tabs[i]);
    }

    // 내부 "바로가기" 버튼(아이디찾기/비번찾기/로그인)도 동일하게 처리
    var gos = qsa('.js-go');
    for (var k = 0; k < gos.length; k++) {
      (function (b) {
        b.onclick = function () {
          var target = b.getAttribute('data-target');
          if (target) setActiveTab(target);
        };
      })(gos[k]);
    }
  }

  function wireCodeInputs() {
    var groups = qsa('.code-boxes');
    for (var g = 0; g < groups.length; g++) {
      (function (wrap) {
        var inputs = qsa('.code-input', wrap);
        for (var i = 0; i < inputs.length; i++) {
          (function (idx) {
            inputs[idx].oninput = function () {
              // 숫자만
              this.value = (this.value || '').replace(/[^0-9]/g, '');
              if (this.value && idx < inputs.length - 1) {
                inputs[idx + 1].focus();
              }
            };
            inputs[idx].onkeydown = function (e) {
              e = e || window.event;
              var key = e.keyCode;

              // Backspace: 비어있으면 이전 칸으로
              if (key === 8) {
                if (!this.value && idx > 0) {
                  inputs[idx - 1].focus();
                }
              }
            };
          })(i);
        }
      })(groups[g]);
    }
  }

  function init() {
    wireTabs();
    wireCodeInputs();

    // 기본 탭: 로그인
    setActiveTab('panel-login');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


//아이디, 비번 검증
const loginBtn = document.querySelector("#loginBtn");
const loginId = document.querySelector("#loginId");
const loginPw = document.querySelector("#loginPw");
const idMsg = document.querySelector("#idMsg");
const pwMsg = document.querySelector("#pwMsg");
const loginErrorMsg = document.querySelector("#loginErrorMsg");

//1. input 이벤트(항상 작동)
//1)아이디
loginId.addEventListener("input",
function(){
	idMsg.innerText = "";
	loginErrorMsg.innerText = "";//로그인 실패 메시지
});
//2)비번
loginPw.addEventListener("input",
function(){
	pwMsg.innerText = "";
	loginErrorMsg.innerText = "";//로그인 실패 메시지
});

//2.submit 검증
loginBtn.addEventListener("click",
function(e){
	//1)아이디 비어있으면
	if(loginId.value.trim()===""){
		e.preventDefault();
		
		idMsg.innerText = "아이디를 입력해주세요.";
		idMsg.style.color = "red";
		
		loginId.focus();
		return;
	}
	//2)비밀번호 비어있으면
	if(loginPw.value.trim()===""){
		e.preventDefault();
		
		pwMsg.innerText = "비밀번호를 입력해주세요.";
		pwMsg.style.color = "red";
		
		loginPw.focus();
		return;
	}
});

//자동로그인: rememberMe
const rememberMe =
	document.querySelector("#rememberMe");
const rememberHidden =
	document.querySelector("#rememberHidden");

rememberMe.addEventListener("change",
function(){
	rememberHidden.value =
	rememberMe.checked ? "Y" : "N";
});

function setMsg(msgEl, text, color){
	if(!msgEl) return;
	msgEl.innerText = text || "";
	msgEl.style.color = color || (text ? "red" : "");
}

//타이머 함수
let resendTimer = null;

function startResendCooldown(seconds) {
    const resetBtn = document.querySelector("#resetBtn");
    if (!resetBtn) return;

    let remain = seconds;
    resetBtn.disabled = true;
    resetBtn.textContent = `재전송 (${remain}s)`;

    if (resendTimer) clearInterval(resendTimer);

    resendTimer = setInterval(() => {
      remain-= 1;
      
      if (remain <= 0) {
        clearInterval(resendTimer);
        resendTimer = null;
        resetBtn.disabled = false;
        resetBtn.textContent = "인증메일 재전송";
        return;
      }
      resetBtn.textContent = `재전송 (${remain}s)`;
    }, 1000);
  }

//아이디 검증
document.addEventListener("DOMContentLoaded", ()=>{
	const nameInput = document.querySelector("#findIdName");//이름 입력
	const nameMsg = document.querySelector("#nameMsg");
	const emailInput = document.querySelector("#findIdEmail");//이메일 입력
	const emailMsg = document.querySelector("#emailMsg");
	const codeInput = document.querySelector("#verifyCode");//인증번호 
	const codeMsg = document.querySelector("#codeMsg");
	const sendBtn = document.querySelector("#sendBtn");//발송 버튼
	const resetBtn = document.querySelector("#resetBtn");//재발송 버튼
	const verifyBtn = document.querySelector("#verifyBtn");//인증 버튼
	const nextBtn = document.querySelector("#nextBtn");//다음 버튼
	const nextBtnEl = document.querySelector("#nextBtn");
	
	if(!nameInput || !nameMsg || 
		!emailInput || !emailMsg ||
		!codeInput || !codeMsg || 
		!verifyBtn || !nextBtn) return;
	
	nameInput.addEventListener("input",()=>{
		const name = nameInput.value.trim();
		if(name.length >=2){
			setMsg(nameMsg, "");
		}
	});
	emailInput.addEventListener("input",()=>{
		const email = emailInput.value.trim();
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		//비었으면: 메시지 지우거나 유지
		if(email === ""){
			setMsg(emailMsg, "");
			return;
		}
		//형식이 맞으면 메시지 지우기
		if(emailRegex.test(email)){
			setMsg(emailMsg, "");
		}
	});
	codeInput.addEventListener("input",()=>{
		setMsg(codeMsg, "");
	});
	
	function validateName(){
		const name = nameInput.value.trim();
		
		//빈 값 체크
		if(!name){
			setMsg(nameMsg, "이름을 입력해주세요.");
			nameMsg.style.color = "red";
			nameInput.focus();
			return false;
		}
		//길이 검사
		if(name.length < 2){
			setMsg(nameMsg, "이름은 2자 이상 입력해주세요.");
			nameMsg.style.color = "red";
			nameInput.focus();
			return false;
		}
		setMsg(nameMsg, "확인되었습니다.");
		nameMsg.style.color = "green";
		return true;
	}
	function validateEmail(){
		const email = emailInput.value.trim();
		//빈 값 체크
		if(!email){
			setMsg(emailMsg, "이메일을 입력해주세요.");
			emailMsg.style.color = "red";
			emailInput.focus();
			return false;
		}
		//정규식 검사
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if(!emailRegex.test(email)){
			setMsg(emailMsg, "올바른 이메일 형식으로 입력해주세요.");
			emailMsg.style.color = "red";
			emailInput.focus();
			return false;
		}
		setMsg(emailMsg, "확인되었습니다.");
		emailMsg.style.color = "green";
		return true;
	}	
	
//인증번호 검증 버튼 클릭
	sendBtn.addEventListener("click",(e)=>{
		e.preventDefault();
		setMsg(codeMsg,"");
		codeMsg.style.color = "";
		if(!validateName()) return;
		if(!validateEmail()) return;
		sendVerifyCode();
	})
	
	// 재전송 버튼
	if (resetBtn) {
	   resetBtn.addEventListener("click", (e)=>{
	      e.preventDefault();
	
	      if(!validateName()) return;
	      if(!validateEmail()) return;
	
	      sendVerifyCode();
	   });
	}
	
	//다음버튼에서 인증번호 빈 값 체크
	nextBtn.addEventListener("click", (e)=>{
		e.preventDefault();
		
		const verifyCode = codeInput.value.trim();
		//빈 값 체크   
		   if(!verifyCode){
			   setMsg(codeMsg, "인증번호를 입력해주세요.");
			    codeMsg.style.color = "red";
			    codeInput.focus();
				return;
			}
		   	setMsg(codeMsg, "");
			
		});
});


//이메일 인증코드 발송
function sendVerifyCode(){
	const emailEl = document.querySelector("#findIdEmail");
	const codeInput = document.querySelector("#verifyCode");
	const codeMsg = document.querySelector("#codeMsg");
	
	setMsg(codeMsg, "");
	codeMsg.style.color ="";
	
    const email = emailEl ?
  (emailEl.value || "").trim() : "";
  	
  	fetch("/email/send", {
  		method: "POST",
  		credentials: "same-origin",
  		headers: {"Content-Type":"text/plain;charset=UTF-8"},
  		body: email
  	})
  	.then((response) =>{
  		if(!response.ok) throw new Error("HTTP"+ response.status);
  		setMsg(codeMsg, "인증코드를 이메일로 발송했습니다.");
  		if(codeMsg) codeMsg.style.color = "green";
  		if(codeInput)
  		codeInput.focus();
  		if(typeof startResendCooldown === "function"){
  		startResendCooldown(60);//인증번호 재전송
  		}
  	})
  	.catch((err)=>{
  		console.error("SEND ERROR:", err); // ✅ 이거 추가
  		setMsg(codeMsg, "이메일 발송에 실패했습니다.")
  		if(codeMsg) codeMsg.style.color = "red";
  	});
}

	  
//인증버튼	  
  const verifyBtn = document.querySelector("#verifyBtn")
  const codeInput = document.querySelector("#verifyCode");
  	  if (codeInput) {
  		codeInput.addEventListener("input", 
  		()=>{
  			nextBtn.dataset.verified = "false";
  			updateNextBtn();
  		});
  	  }
      if (verifyBtn) {
	  verifyBtn.addEventListener("click", function () {
	    const codeEl = document.querySelector("#verifyCode");
	    const code = codeEl ? (codeEl.value || "").trim() : "";

      if (!code) {
    	  setMsg(codeMsg, "인증코드를 입력해주세요.");
    	  codeMsg.style.color = "red";
        return;
      }
      //인증번호 6자리 필수 입력
	     if (!/^\d{6}$/.test(code)) {
	       setMsg(codeMsg, "인증번호 6자리를 정확히 입력해주세요.");
	       codeMsg.style.color = "red";
	       return;
	      }
      fetch("/email/check/" + encodeURIComponent(code), {
          method: "PUT",
          credentials: "same-origin",
        })
        .then(response => response.text().then(text => ({ status: response.status, text })))
        .then(({ status, text }) => {
          if (status === 202 && text === "verified") {
        	  setMsg(codeMsg, "인증되었습니다.");  
        	  codeMsg.style.color = "green";
        	  nextBtnEl.dataset.verified = "true";
        	  updateNextBtn();
          } else {
        	  setMsg(codeMsg, "인증코드가 올바르지 않습니다.");  
        	  codeMsg.style.color = "red";
          }
        })
        .catch(() => alert("인증 확인 중 오류가 발생했습니다."));
	     
    });
  }


  
//다음 단계 이동 버튼
  const nextBtnEl = document.querySelector("#nextBtn");
  const findIdPanelEl = document.querySelector("#panel-find-id");
  const resultPanelEl = document.querySelector("#panel-find-id-result");
  const resultEl = document.querySelector("#resultIdText");
  
  if(nextBtnEl){
	  nextBtnEl.dataset.verified = "false";
  }
  function updateNextBtn(){
	  if(!nextBtnEl) return;
	  nextBtnEl.disabled = nextBtnEl.dataset.verified !== "true";
}
  //최초 진입 시 비활성화
  updateNextBtn();
  
  if (nextBtnEl) {
	  nextBtnEl.addEventListener("click", function () {
	 const nameInput = document.querySelector("#findIdName");//이름 입력
	 const emailInput = document.querySelector("#findIdEmail");//이메일 입력
	  if (!nameInput || !emailInput){
		  console.error("findIdName 또는  findIdEmail 요소를 찾지 못했습니다.");
		  return;
	  }
      if (nextBtnEl.dataset.verified !== "true") {
    	  setMsg(codeMsg, "이메일 인증을 완료해주세요.");  
    	  codeMsg.style.color = "red";
    	  return;
      }
      //"다음" -> 결과메시지
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      fetch("/user/findId/email?name=" + encodeURIComponent(name) + "&email=" + encodeURIComponent(email))
      .then(r => r.text())
      .then(id => {

    	  if(!resultEl){
    		  console.error("#resultIdText 요소가 없습니다.");
    		  return;
    	  }
    	  if (id === "NOT_FOUND") {
              resultEl.innerText = "일치하는 계정이 없습니다.";
              resultEl.style.color = "red";
              if (findIdPanelEl) findIdPanelEl.style.display = "none";
              if (resultPanelEl) resultPanelEl.style.display = "block";
              return;
            }

            resultEl.innerText = `아이디는 ${id} 입니다`;
            resultEl.style.color = "green";

            if (findIdPanelEl) findIdPanelEl.style.display = "none";
            if (resultPanelEl) resultPanelEl.style.display = "block";
          })
          .catch(() => {
            if (!resultEl) return;
            resultEl.innerText = "요청 실패 (서버 확인 필요)";
            resultEl.style.color = "red";

            if (findIdPanelEl) findIdPanelEl.style.display = "none";
            if (resultPanelEl) resultPanelEl.style.display = "block";
          });

      });
    }