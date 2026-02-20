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
    }

    var subtitle = $("#stepSubtitle");
    if (subtitle) {
      if (step === "account") subtitle.innerHTML = "계정 정보 입력";
      else if (step === "verify") subtitle.innerHTML = "본인인증";
      else subtitle.innerHTML = "회원 정보 입력";
    }
  }

  // ===== state =====
  var state = {
    verifiedSms: false,
    verifiedEmail: false,
    interests: []
  };

  function updateVerifyBadges() {
    var smsBadge = $("#smsBadge");
    var emailBadge = $("#emailBadge");

    if (smsBadge) {
      smsBadge.innerHTML = state.verifiedSms ? "완료" : "미완료";
      toggleClass(smsBadge, "done", state.verifiedSms);
    }
    if (emailBadge) {
      emailBadge.innerHTML = state.verifiedEmail ? "완료" : "미완료";
      toggleClass(emailBadge, "done", state.verifiedEmail);
    }

    var hidSms = $("#hidVerifiedSms");
    var hidEmail = $("#hidVerifiedEmail");
    if (hidSms) hidSms.value = String(state.verifiedSms);
    if (hidEmail) hidEmail.value = String(state.verifiedEmail);
  }

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

    // step back
    var backBtn = closest(t, "[data-step-back]");
    if (backBtn) {
      setActiveStep(getAttr(backBtn, "data-step-back"));
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
      
  
//===== step1 -> step2 (account -> verify) =====

 // 아이디 중복확인
var checkedOk = (typeof idCheckedOk !== "undefined") ? idCheckedOk : false;
var checkedId = (typeof lastCheckedId !== "undefined") ? lastCheckedId : "";
 

document.querySelector('#checkIdBtn').addEventListener('click', e=>{
	
	let val = document.querySelector('#userId').value;
	
	fetch(getCpath() + "/checkId?username=" + val)
		.then(response => {
			
			if(!response.ok || response.status != 200){
				return new Error("에러발생");
			}
			
			return response.json();
		})
		.then(data => {
			const idEl = document.querySelector('#userId');
			const msgEl = document.querySelector('#idCheckMsg');
			const val = (idEl.value || "").trim();
			let result = data.duplicate; // result -> 아이디가 중복되면 true
			
			//1)아이디 미입력 시
			if(val === ""){
				msgEl.innerText ="아이디를 입력한 뒤 중복확인 해주세요.";
				msgEl.style.color = "red";
				checkedOk = false;
				checkedId = "";
				idEl.focus();
				return;
			}
			
			if(result){
				//2)중복일때
				msgEl.innerText = "아이디가 중복되었습니다.";
				msgEl.style.color = "red";
				checkedOk = false;
			}else{
				//3)중복이 아닐 때(사용 가능)
				msgEl.innerText = "사용 가능한 아이디입니다.";
				msgEl.style.color = "green";
				checkedOk = true;
				checkedId = val;
			}
			
		})
		.catch(err => console.log(err));
});

//비번 검증
	const pwInput = document.querySelector('#userPw');
	const pwMsg = document.querySelector('#pwMsg');
	
	pwInput.addEventListener("input",
	function(){
		const pw = pwInput.value;//현재 비번
		
		const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/;

	    if (!regex.test(pw)) {
	        pwMsg.innerText = "영문, 숫자, 특수문자 포함 8~20자";
	        pwMsg.style.color = "red";
	    } else {
	        pwMsg.innerText = "사용 가능한 비밀번호입니다.";
	        pwMsg.style.color = "green";
	    }
		
	    
	});

//비밀번호 확인 검증
	const pwInput2 = document.querySelector('#userPw2');
	const pwMsg2 = document.querySelector('#pwMsg2');
	
	pwInput2.addEventListener("input",
	function(){
		const pw = pwInput.value;//현재 비번
		const pw2 = pwInput2.value;//확인 비번
		
		if(pw !== pw2){
			pwMsg2.innerText = "비밀번호 확인이 일치하지 않습니다.";
	        pwMsg2.style.color = "red";
		}else{
			pwMsg2.innerText = "비밀번호 확인이 일치합니다.";
	        pwMsg2.style.color = "green";
		}
	});

// 다음 버튼 클릭
  var toVerifyBtn = $("#toVerifyBtn");
  if (toVerifyBtn) {
    toVerifyBtn.addEventListener("click", function (e) {
      if (e && e.preventDefault) e.preventDefault(); // submit 방지

      var userIdEl = $("#userId");
      var pwEl = $("#userPw");
      var pw2El = $("#userPw2");

      var userId = userIdEl ? (userIdEl.value || "").trim() : "";
      var pw = pwEl ? (pwEl.value || "") : "";
      var pw2 = pw2El ? (pw2El.value || "") : "";

      // 1) 아이디 기본 검증
      if (!userId || userId.length < 6 || userId.length > 20) {
        alert("아이디는 6~20자로 입력해주세요.");
        if (userIdEl) userIdEl.focus();
        return;
      }

      if (!checkedOk || checkedId !== userId) {
        alert("아이디 중복확인을 먼저 완료해주세요.");
        if (userIdEl) userIdEl.focus();
        return;
      }

      // 3) 비밀번호 검증
      if (pw.length < 8 || pw.length > 20) {
        alert("비밀번호는 영문, 숫자, 특수문자 포함 8~20자로 입력해주세요.");
        if (pwEl) pwEl.focus();
        return;
      }

      if (pw !== pw2) {
        alert("비밀번호 확인이 일치하지 않습니다.");
        if (pw2El) pw2El.focus();
        return;
      }

      // 4) 필수 약관 체크
      var agreeServiceEl = $("#agreeService");
      var agreePrivacyEl = $("#agreePrivacy");
      var agreeService = agreeServiceEl ? agreeServiceEl.checked : false;
      var agreePrivacy = agreePrivacyEl ? agreePrivacyEl.checked : false;

      if (!agreeService || !agreePrivacy) {
        alert("[필수] 약관 동의가 필요합니다.");
        return;
      }

      // 5) hidden copy
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

      // 6) step2 이동
      setActiveStep("verify");
    });
  }

  // ===== step2: verify =====

  //이메일 인증코드 발송
  var emailSendBtn = $("#emailSendBtn");
  if (emailSendBtn) {
    emailSendBtn.addEventListener("click", function () {
      var emailEl = $("#emailAddr");
      var email = emailEl ?
    (emailEl.value || "").trim() : "";
    
    	if(!email){
    		alart("이메일을 입력해주세요.");
    		return;
    	}
    	fetch("/email/send", {
    		method: "POST",
    		headers: {"Content-Type":"text/plain; charset=UTF-8"},
    		body: email
    	})
    	.then(response =>{
    		if(!response.ok) throw new Error();
    		alert("인증코드를 이메일로 발송했습니다.");
    	})
    	.catch(()=>{
    		alert("이메일 발송에 실패했습니다.")
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
            updateVerifyBadges();
            alert("이메일 인증 완료!");
            closeModal($("#modal-email"));
          } else {
            state.verifiedEmail = false;
            updateVerifyBadges();
            alert("인증코드가 올바르지 않습니다.");
          }
        })
        .catch(() => {
          alert("인증 확인 중 오류가 발생했습니다.");
        });
    });
  }

  //다음 단계 이동 버튼
  var toProfileBtn = $("#toProfileBtn");
  if (toProfileBtn) {
    toProfileBtn.addEventListener("click", function () {
      if (!state.verifiedEmail) {
        var ok = confirm("본인인증이 미완료입니다. 그래도 다음 단계로 진행할까요?");
        if (!ok) return;
      }
      updateVerifyBadges();
      setActiveStep("profile");
    });
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
      return true;
    });
  }

  // init
  setActiveStep("account");
  updateVerifyBadges();
  renderChips();

})();
