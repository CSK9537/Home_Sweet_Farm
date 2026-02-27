(function () {
  "use strict";

  // ===== helpers (ES5) =====
  function $(sel, parent) {
    return (parent || document).querySelector(sel);
  }

  function $all(sel, parent) {
    return (parent || document).querySelectorAll(sel);
  }

  function toArray(nodeList) {
    var arr = [];
    var i;
    for (i = 0; i < nodeList.length; i++) arr.push(nodeList[i]);
    return arr;
  }

  // closest 대체 (ES5)
  function closest(el, selector) {
    var cur = el;
    while (cur && cur !== document) {
      if (matches(cur, selector)) return cur;
      cur = cur.parentNode;
    }
    return null;
  }

  function matches(el, selector) {
    var p = Element.prototype;
    var fn = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector;
    if (fn) return fn.call(el, selector);

    // 매우 구형 fallback (성능은 낮지만 안전)
    var nodes = (el.parentNode || document).querySelectorAll(selector);
    var i;
    for (i = 0; i < nodes.length; i++) {
      if (nodes[i] === el) return true;
    }
    return false;
  }

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

  function hasClass(el, c) {
    if (!el) return false;
    if (el.classList) return el.classList.contains(c);
    return new RegExp("(^|\\s)" + c + "(\\s|$)").test(el.className);
  }

  function getAttr(el, name) {
    return el ? el.getAttribute(name) : null;
  }

  // ===== modal =====
  function openModal(id) {
    var el = document.getElementById(id);
    if (!el) return;
    addClass(el, "is-open");
    el.setAttribute("aria-hidden", "false");

    // focus 이동
    var focusable = el.querySelector("button, input, [tabindex]:not([tabindex='-1'])");
    if (focusable) focusable.focus();
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    removeClass(modalEl, "is-open");
    modalEl.setAttribute("aria-hidden", "true");
  }

  // ===== steps =====
  function setActiveStep(step) {
    var panels = toArray($all(".step-panel"));
    var i;
    for (i = 0; i < panels.length; i++) removeClass(panels[i], "is-active");

    var panel = $('.step-panel[data-step="' + step + '"]');
    if (panel) addClass(panel, "is-active");

    var navBtns = toArray($all(".step-nav__btn"));
    for (i = 0; i < navBtns.length; i++) {
      var btn = navBtns[i];
      var isActive = (btn.getAttribute("data-step-link") === step);
      toggleClass(btn, "is-active", isActive);
      btn.setAttribute("aria-selected", String(isActive));
      btn.disabled = !isActive;
    }
  }


  
  // ===== state =====
  var state = {
    verifiedEmail: false,
    interests: []
  };

  function updateVerifyBadges() {
    var emailBadge = $("#emailBadge");

    if (emailBadge) {
      emailBadge.innerHTML = state.verifiedEmail ? "완료" : "미완료";
      toggleClass(emailBadge, "done", state.verifiedEmail);
    }
    const sendCodeBtn = document.querySelector("#sendCode-btn"); // 이메일 인증(모달 열기)
    const sendBtn     = document.querySelector("#emailSendBtn"); // 인증메일 발송
    const verifyBtn   = document.querySelector("#emailVerifyBtn"); // 인증 완료
    const emailInput  = document.querySelector("#emailAddr"); // 이메일 입력
    const codeInput   = document.querySelector("#emailCode"); // 인증코드 입력
    
    if (sendCodeBtn) sendCodeBtn.disabled = state.verifiedEmail;
    if (sendBtn) sendBtn.disabled = state.verifiedEmail;
    if (verifyBtn) verifyBtn.disabled = state.verifiedEmail;
    if (emailInput) emailInput.disabled = state.verifiedEmail;
    if (codeInput) codeInput.disabled = state.verifiedEmail;
    
    var hidEmail = $("#hidVerifiedEmail");
    if (hidEmail) hidEmail.value = String(state.verifiedEmail);
  }

  
//renderChips
  function renderChips() {
    var wrap = $("#interestChips");
    if (!wrap) return;

    wrap.innerHTML = "";
    var i;
    for (i = 0; i < state.interests.length; i++) {
      var name = state.interests[i];
      var chip = document.createElement("span");
      chip.className = "chip";
      chip.setAttribute("data-name", name);
      chip.appendChild(document.createTextNode(name));
      wrap.appendChild(chip);
    }

    var hid = $("#hidInterests");
    if (hid) hid.value = state.interests.join(",");
  }

  // ===== util: context path (ES5) =====
  function getCpath() {
    var path = window.location.pathname;
    var idx = path.indexOf("/", 1);
    return idx > 0 ? path.substring(0, idx) : "";
  }

  // ===== click handler (ES5) =====
  document.addEventListener("click", function (e) {
    var t = e.target;

    // open modal
    var openBtn = closest(t, "[data-modal-open]");
    if (openBtn) {
      openModal(getAttr(openBtn, "data-modal-open"));
      return;
    }

    // close modal
    var closeBtn = closest(t, "[data-modal-close]");
    if (closeBtn) {
      closeModal(closest(t, ".modal"));
      return;
    }

    // step link
    var stepLink = closest(t, "[data-step-link]");
    if (stepLink) {
      setActiveStep(getAttr(stepLink, "data-step-link"));
      return;
    }

    // chip remove
    var chip = closest(t, ".chip");
    if (chip) {
      var name = chip.getAttribute("data-name");
      var next = [];
      var i;
      for (i = 0; i < state.interests.length; i++) {
        if (state.interests[i] !== name) next.push(state.interests[i]);
      }
      state.interests = next;
      renderChips();
      return;
    }
  });

  // ===== step1: terms all =====
  var agreeAll = $("#agreeAll");
  var agreeItems = toArray($all(".agree-item"));

  if (agreeAll) {
    agreeAll.addEventListener("change", function () {
      var i;
      for (i = 0; i < agreeItems.length; i++) {
        agreeItems[i].checked = agreeAll.checked;
      }
    });
  }

  for (var ai = 0; ai < agreeItems.length; ai++) {
    agreeItems[ai].addEventListener("change", function () {
      if (!agreeAll) return;
      var allChecked = true;
      var i;
      for (i = 0; i < agreeItems.length; i++) {
        if (!agreeItems[i].checked) {
          allChecked = false;
          break;
        }
      }
      agreeAll.checked = allChecked;
    });
  }

  // logo -> home
  var goHomeBtn = $("#goHomeBtn");
  if (goHomeBtn) {
    goHomeBtn.addEventListener("click", function () {
      window.location.href = "/";
    });
  }

  // login
  var goLoginBtn = $("#goLoginBtn");
  if (goLoginBtn) {
    goLoginBtn.addEventListener("click", function () {
      window.location.href = getCpath() + "/login";
    });
  }
      
  // 보기 모달
  document.querySelectorAll('.link-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
    const modalId = e.currentTarget.getAttribute('data-modal-open'); 
        
    const urlMap = {
        'modal-service': '/rules/use',
        'modal-privacy': '/rules/privacy'
    };
    const sectionMap = {
        'modal-service': 'terms__section',
        'modal-privacy': 'policy__section'
    };
  
    const url = urlMap[modalId]; // 대상 URL 결정
    const targetModal = document.getElementById(modalId); 
      const modalBody = targetModal ? targetModal.querySelector('.modal__body') : null;
  
      if (modalBody && url) {
          fetch(url)
              .then(response => {
                  if (!response.ok) throw new Error('파일을 불러올 수 없습니다.');
                  return response.text();
              })
              .then(data => {
                // 임시 DOM 객체를 만들어 HTML 문자열을 주입
                  const parser = new DOMParser();
                  const doc = parser.parseFromString(data, 'text/html');
                  const sections = doc.querySelectorAll('.' + sectionMap[modalId]); 
  
                  let combinedHtml = '';
  
                  sections.forEach(el => {
                      combinedHtml += el.outerHTML; // 태그 포함 전체 내용 합치기
                  });
  
                  modalBody.innerHTML = combinedHtml || '<p class="modal__text">내용이 없습니다.</p>';
              })
              .catch(error => {
                  console.error('Error:', error);
                  modalBody.innerHTML = '약관을 불러오는 중 오류가 발생했습니다.';
              });
      }
    });
  });
  
  
//===== step1 -> step2 (account -> verify) =====

  
//아이디 검증
	const idInput = document.querySelector('#userId');
	const idMsg = document.querySelector('#idMsg');
	const checkIdBtn = document.querySelector('#checkIdBtn')
	
	let idCheckedOk = false;
	let lastCheckedId = "";
	
	const idRegex = /^[a-z0-9]{6,20}$/;
	
	idInput.addEventListener("input",
	function(){
		const id = idInput.value.trim();
		
		//아이디를 바꾸면 중복확인 무조건 무효
		idCheckedOk = false;
		lastCheckedId = "";
		
	    if (!idRegex.test(id)) {
	    	idMsg.innerText = "영문 소문자/숫자 6~20자로 입력해 주세요.";
	    	idMsg.style.color = "red";
	    	if (checkIdBtn) checkIdBtn.disabled = true;
	    	idCheckedOk = false;
	    	enableVerifyBtn();
	        return;
	    } 
		 // 형식 OK인데 아직 중복확인 안 함
		    idMsg.innerText = "중복확인을 진행해 주세요.";
		    idMsg.style.color = "#666";
		    checkIdBtn.disabled = false;
		    enableVerifyBtn();
		 });
	
	// 아이디 중복확인
	var checkedOk = (typeof idCheckedOk !== "undefined") ? idCheckedOk : false;
	var checkedId = (typeof lastCheckedId !== "undefined") ? lastCheckedId : "";
	 
	checkIdBtn.addEventListener('click', (e) => {
		
	if (checkIdBtn.classList.contains('loading')) return;
	
	let originalText = checkIdBtn.textContent;
	let val = idInput.value.trim();
	
	checkIdBtn.classList.add('loading');
	checkIdBtn.textContent = "확인 중";
	checkIdBtn.disabled = true;
	
	fetch(getCpath() + "/checkId?username=" + encodeURIComponent(val))
		.then(response => {
			
			if(!response.ok || response.status != 200){
				checkIdBtn.classList.remove('loading');
				checkIdBtn.textContent = originalText;
				checkIdBtn.disabled = false;
				throw new Error("에러발생");
			}
			return response.json();
		})
		.then(data => {
			const val = (idInput.value || "").trim();
			let result = data.duplicate; // result -> 아이디가 중복되면 true
			
			//1)아이디 미입력 시
			if(val === ""){
				idMsg.innerText ="아이디를 입력한 뒤 중복확인 해주세요.";
				idMsg.style.color = "red";
				
				checkedOk = false;
				checkedId = "";
				
				idCheckedOk = false;
				lastCheckedId = "";
				
				idInput.focus();
				
				checkIdBtn.classList.remove('loading');
				checkIdBtn.textContent = originalText;
				checkIdBtn.disabled = false;
				
				enableVerifyBtn();
				return;
			}
			
			if(result){
				//2)중복일때
				idMsg.innerText = "아이디가 중복되었습니다.";
				idMsg.style.color = "red";
				checkedOk = false;
				checkedId = "";
				
				idCheckedOk = false;
				lastCheckedId = "";
				
				checkIdBtn.classList.remove('loading');
				checkIdBtn.textContent = originalText;
				checkIdBtn.disabled = false;
				
				enableVerifyBtn();
			}else{
				//3)중복이 아닐 때(사용 가능)
				idMsg.innerText = "사용 가능한 아이디입니다.";
				idMsg.style.color = "green";
				
				checkedOk = true;
				checkedId = val;
				
				idCheckedOk = true;
				lastCheckedId = val;
				
				checkIdBtn.textContent = "확인 완료";
				idInput.setAttribute('readonly', true);
				idInput.classList.add('no-click');
				enableVerifyBtn();
			}
			
		})
		.catch(err => console.log(err));
});

	// 비밀번호 검증
	const pwInput = document.querySelector('#userPw');
	const pwMsg = document.querySelector('#pwMsg');
	let pwCheckedOk = false;
	
	const pwInput2 = document.querySelector('#userPw2');
	const pwMsg2 = document.querySelector('#pwMsg2');
	let pw2CheckedOk = false;
	
	pwInput.addEventListener("input",
	function () {
		const pw = pwInput.value;//현재 비번
		const pw2 = pwInput2.value;
		const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/;
		
		if (!pwRegex.test(pw)) {
			pwMsg.innerText = "영문, 숫자, 특수문자 포함 8~20자";
			pwMsg.style.color = "red";
			pwMsg2.innerText = "비밀번호 확인이 일치하지 않습니다.";
			pwMsg2.style.color = "red";
			pwCheckedOk = false;
			pw2CheckedOk = false;
			enableVerifyBtn();
		} else {
			pwMsg.innerText = "사용 가능한 비밀번호입니다.";
			pwMsg.style.color = "green";
			pwCheckedOk = true;
			if(pw !== pw2){
				pwMsg2.innerText = "비밀번호 확인이 일치하지 않습니다.";
				pwMsg2.style.color = "red";
				pw2CheckedOk = false;
				enableVerifyBtn();
			}else{
				pwMsg2.innerText = "비밀번호 확인이 일치합니다.";
				pwMsg2.style.color = "green";
				pw2CheckedOk = true;
				enableVerifyBtn();
			}
			
		}	    
	});

	//비밀번호 확인 검증
	pwInput2.addEventListener("input",
	function () {
		const pw = pwInput.value;//현재 비번
		const pw2 = pwInput2.value;//확인 비번
		
		if(pw !== pw2){
			pwMsg2.innerText = "비밀번호 확인이 일치하지 않습니다.";
			pwMsg2.style.color = "red";
			pw2CheckedOk = false;
			enableVerifyBtn();
		}else{
			pwMsg2.innerText = "비밀번호 확인이 일치합니다.";
			pwMsg2.style.color = "green";
			pw2CheckedOk = true;
			enableVerifyBtn();
		}
	});
	
	// 약관 동의 검증
	let isServiceAgreed = false;
	let isPrivacyAgreed = false;
	let agreeCheckedOk = false; // 두 필수 약관이 모두 동의되었는지 저장
	
	const agreeServiceEl = document.getElementById("agreeService");
	const agreePrivacyEl = document.getElementById("agreePrivacy");
	const agreeAllEl = document.getElementById("agreeAll");
	
	function updateAgreementState() {
		isServiceAgreed = agreeServiceEl.checked;
		isPrivacyAgreed = agreePrivacyEl.checked;
		
		agreeCheckedOk = (isServiceAgreed && isPrivacyAgreed);
		
		enableVerifyBtn();
	}

	agreeServiceEl.addEventListener("change", updateAgreementState);
	agreePrivacyEl.addEventListener("change", updateAgreementState);
	agreeAllEl.addEventListener("change", updateAgreementState);
	
// 다음 버튼
  const toVerifyBtn = document.querySelector("#toVerifyBtn");
  
// 다음 버튼 활성화
  function enableVerifyBtn() {
	  if(idCheckedOk && pwCheckedOk && pw2CheckedOk && agreeCheckedOk){
		  toVerifyBtn.disabled = false;
	  }else{
		  toVerifyBtn.disabled = true;
	  }
  }
	
// 다음 버튼 클릭
  if (toVerifyBtn) {
	  toVerifyBtn.addEventListener("click", function (e) {
	  e.preventDefault(); // submit 방지

      const userIdEl = document.querySelector("#userId");
      const pwEl = document.querySelector("#userPw");
      const pw2El = document.querySelector("#userPw2");

      const userId = userIdEl ? (userIdEl.value || "").trim() : "";
      const pw = pwEl ? (pwEl.value || "") : "";
      const pw2 = pw2El ? (pw2El.value || "") : "";


      // 3) 필수 약관 체크
      var agreeServiceEl = $("#agreeService");
      var agreePrivacyEl = $("#agreePrivacy");
      var agreeService = agreeServiceEl ? agreeServiceEl.checked : false;
      var agreePrivacy = agreePrivacyEl ? agreePrivacyEl.checked : false;


      // 4) hidden copy
      var hidUserId = $("#hidUserId");
      var hidUserPw = $("#hidUserPw");
      var hidUserPw2 = $("#hidUserPw2");
      var hidAgreeService = $("#hidAgreeService");
      var hidAgreePrivacy = $("#hidAgreePrivacy");
      var hidAgreeMarketing = $("#hidAgreeMarketing");

      if (hidUserId) hidUserId.value = userId;
      if (hidUserPw) hidUserPw.value = pw;
      if (hidUserPw2) hidUserPw2.value = pw2;

      if (hidAgreeService) hidAgreeService.value = agreeService ? "1" : "0";
      if (hidAgreePrivacy) hidAgreePrivacy.value = agreePrivacy ? "1" : "0";

      var agreeMarketingEl = $("#agreeMarketing");
      var agreeMarketing = agreeMarketingEl ? agreeMarketingEl.checked : false;
      if (hidAgreeMarketing) hidAgreeMarketing.value = agreeMarketing ? "1" : "0";

      // 5) step2 이동
      setActiveStep("verify");
    });
  }

  // ===== step2: verify =====

  var emailSendBtn = $("#emailSendBtn");
  var tmpemail = '';

  if (emailSendBtn) {
    emailSendBtn.addEventListener("click", (e) => {
      var btn = e.currentTarget;
      var textEl = btn.querySelector('.btn-text');
      var originalText = textEl.textContent;
      var emailEl = $("#emailAddr");
      var email = emailEl ? (emailEl.value || "").trim() : "";

      if (btn.classList.contains('loading')) return;

      if (!email) {
        alert("이메일을 입력해주세요.");
        return;
      }

      // 로딩 상태 시작
      btn.classList.add('loading');
      btn.disabled = true;
      textEl.textContent = "검사 중";

      // 이메일 중복 검사
      fetch(getCpath() + "/checkEmail?email=" + encodeURIComponent(email))
        .then(response => {
          if (!response.ok || response.status != 200) throw new Error("네트워크 에러");
          return response.json();
        })
        .then(data => {
          if (data.duplicate) {
            alert("중복된 이메일입니다.");
            throw new Error("DUPLICATE"); // 중복이면 에러를 던져서 중단
          }

          // 중복이 아닐 때 발송
          textEl.textContent = "발송 중";
          return fetch("/email/send", {
            method: "POST",
            headers: { "Content-Type": "text/plain; charset=UTF-8" },
            body: email
          });
        })
        .then(response => {
          if (!response.ok) throw new Error("SEND_FAIL");
          
          // 발송 성공 후 타이머
          alert("인증코드를 이메일로 발송했습니다.");
          btn.classList.remove('loading');
          tmpemail = email;

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
          // 모든 단계의 에러가 여기서 처리됨
          if (err.message === "DUPLICATE") {
            // 중복일 때 상태 복구
          } else if (err.message === "SEND_FAIL") {
            alert("이메일 발송에 실패했습니다.");
          } else {
            console.error(err);
          }
          
          // 공통 에러 복구 로직
          textEl.textContent = originalText;
          btn.classList.remove('loading');
          btn.disabled = false;
        });
    });
  }
  

  var emailVerifyBtn = $("#emailVerifyBtn");
  if (emailVerifyBtn) {
    emailVerifyBtn.addEventListener("click", function () {
      var codeEl = $("#emailCode");
      var code = codeEl ? (codeEl.value || "").trim() : "";
      
      if (!code) {
        alert("인증코드를 입력해주세요.");
        return;
      }
      fetch("/email/check/" + encodeURIComponent(code), {
          method: "PUT"
        })
        .then(response => response.text().then(text => ({ status: response.status, text })))
        .then(({ status, text }) => {
          if (status === 202 && text === "verified") {
            state.verifiedEmail = true;
            document.getElementById('userEmail').value = tmpemail;
            updateVerifyBadges();
            updateNextBtn();
            alert("이메일 인증 완료!");
            closeModal($("#modal-email"));
          } else {
            state.verifiedEmail = false;
            updateVerifyBadges();
            updateNextBtn();
            alert("인증코드가 올바르지 않습니다.");
          }
        })
        .catch(() => {
          alert("인증 확인 중 오류가 발생했습니다.");
        });
    });
  }
  
  //인증번호 재전송

  //다음 단계 이동 버튼
  var toProfileBtn = $("#toProfileBtn");
  if (toProfileBtn) {
    toProfileBtn.addEventListener("click", function () {
      if (!state.verifiedEmail) {
    	  return;
      }
      updateVerifyBadges();
      setActiveStep("profile");
    });
    updateNextBtn();
  }
  function updateNextBtn(){
	  if(!toProfileBtn) return;
	  toProfileBtn.disabled = !state.verifiedEmail;
  }

  // ===== interests =====
  var addPlantBtn = $("#addPlantBtn");
  if (addPlantBtn) {
    addPlantBtn.addEventListener("click", function () {
      var input = $("#plantNameInput");
      var name = input ? (input.value || "").replace(/^\s+|\s+$/g, "") : "";
      if (!name) {
        alert("식물명을 입력해주세요.");
        return;
      }

      var i;
      for (i = 0; i < state.interests.length; i++) {
        if (state.interests[i] === name) {
          alert("이미 추가된 식물입니다.");
          return;
        }
      }

      state.interests.push(name);
      if (input) input.value = "";
      renderChips();
      closeModal($("#modal-interest"));
    });
  }

  // ===== final submit guard =====
  var joinForm = $("#joinForm");
  if (joinForm) {
    joinForm.addEventListener("submit", function (e) {
      var hidUserId = $("#hidUserId");
      var hidUserPw = $("#hidUserPw");

      var vId = hidUserId ? hidUserId.value : "";
      var vPw = hidUserPw ? hidUserPw.value : "";

      if (!vId || !vPw) {
        if (e && e.preventDefault) e.preventDefault();
        alert("계정 정보가 누락되었습니다. 처음 단계부터 다시 진행해주세요.");
        setActiveStep("account");
        return false;
      }
      if (!state.verifiedEmail) {
    	if (e && e.preventDefault) e.preventDefault();
    	alert("이메일 인증을 진행해주세요.");
    	setActiveStep("verify");
    	return false;
      }
      return true;
    });
  }

  // init
  setActiveStep("account");
  updateVerifyBadges();
  renderChips();

})();
