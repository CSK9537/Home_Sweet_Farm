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

//아이디 검증
	const nameInput = document.querySelector("#findIdName");
	const nameMsg = document.querySelector("#nameMsg");
	const verifyBtn = document.querySelector("#verifyBtn");
	
	verifyBtn.addEventListener("click", (e)=>{
		const name = nameInput.value.trim();
		//빈 값 체크
		if(!name){
			nameMsg.innerText = "이름을 입력해주세요.";
			nameMsg.style.color = "red";
			return;
		}
		nameMsg.innerText ="";
		return true;
	});
//		
//		if(name.length < 2){
//			nameMsg.innerText = "이름은 2자 이상 입력해주세요.";
//			nameMsg.style.color = "red";
//			return false;
//		}
		
//	
//	// 2) 입력 시작하면 메시지 사라지게
//	  nameInput.addEventListener("input", () => {
//	    nameMsg.innerText = "";
//	  });
//
//	  // 3) 인증 버튼 클릭 시 검증
//	  verifyBtn.addEventListener("click", (e) => {
//	    if (!validateName()) {
//	      e.preventDefault();  // form submit 막기(버튼이 submit이면 중요)
//	      return;
//	    }
//
//	    // ✅ 여기 아래에 "인증" fetch/로직이 실행되게 넣기
//	    // send email / check code 등...
//	  });
//	});








const findIdEmail = document.querySelector("#findIdEmail");
const verifyCode = document.querySelector("#verifyCode");
//const verifyBtn = document.querySelector("#verifyBtn");

