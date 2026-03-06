// myPage.js (ES5 호환)
(function () {
  "use strict";

  var root = document.querySelector(".mypage-card");
  if (!root) return;

  var ctx = root.getAttribute("data-ctx") || "";
  var profileUserId = root.getAttribute("data-profile-user-id");
  var isOwner = (root.getAttribute("data-is-owner") === "true");

  // -------------------------
  // Left navigation (section swap)
  // -------------------------
  var navButtons = Array.prototype.slice.call(document.querySelectorAll(".js-nav"));
  var sections = Array.prototype.slice.call(document.querySelectorAll(".right-section"));

  function showSection(sectionId) {
    for (var i = 0; i < sections.length; i++) {
      sections[i].classList.toggle("is-show", sections[i].id === sectionId);
    }
    for (var j = 0; j < navButtons.length; j++) {
      navButtons[j].classList.toggle("is-active", navButtons[j].getAttribute("data-target") === sectionId);
    }
  }

  for (var k = 0; k < navButtons.length; k++) {
    (function (btn) {
      btn.addEventListener("click", function () {
        showSection(btn.getAttribute("data-target"));
      });
    })(navButtons[k]);
  }

  showSection("secProfile");
 
  // -------------------------
  // Modal helpers
  // -------------------------
  var backdrop = document.getElementById("modalBackdrop");
  var modals = {
    grade: document.getElementById("modalGrade"),
    plant: document.getElementById("modalPlant"),
    verify: document.getElementById("modalVerify"),
    avatar: document.getElementById("modalAvatar")
  };

  function anyModalOpen() {
    for (var key in modals) {
      if (modals[key] && modals[key].hidden === false) return true;
    }
    return false;
  }

  function openModal(el) {
    if (!el) return;
    backdrop.hidden = false;
    el.hidden = false;
  }

  function closeModal(el) {
    if (!el) return;
    el.hidden = true;
    if (!anyModalOpen()) backdrop.hidden = true;
  }

  document.addEventListener("click", function (e) {
	const t = e.target;
    const closeBtn = t && t.closest ? t.closest("[data-modal-close]"): null;
    if (closeBtn) {
    	const modal = closeBtn.closest(".modal");
      closeModal(modal);
      return;
    }
    if (t === backdrop) {
      for (var key in modals) {
        if (modals[key]) closeModal(modals[key]);
      }
    }
  });

  // 프로필 이미지 크게보기 (주인만)
  var btnAvatar = document.getElementById("btnAvatar");
  if (btnAvatar && isOwner) btnAvatar.addEventListener("click", function () { openModal(modals.avatar); });

  //프로필: 회원등급 안내
  var btnGradeGuide = document.getElementById("btnGrade");
  if (btnGradeGuide) btnGradeGuide.addEventListener("click", function () { openModal(modals.grade); });
  
  
  // -------------------------
  // Account: interest plant modal
  // -------------------------
  var btnInterestPlant = document.getElementById("btnInterestPlant");
  if (btnInterestPlant && isOwner) {
    btnInterestPlant.addEventListener("click", function () { openModal(modals.plant); });
  }

  var btnPlantSearch = document.getElementById("btnPlantSearch");
  var plantKeyword = document.getElementById("plantKeyword");
  var plantResult = document.getElementById("plantResult");
  var plantEmpty = document.getElementById("plantEmpty");

  function searchPlants(keyword) {
    var url = ctx + "/user/myPage/hashtag?keyword=" + encodeURIComponent(keyword);
    return fetch(url, { headers: { "Accept": "application/json" } })
      .then(function (res) {
        if (!res.ok) throw new Error("plant search failed");
        return res.json();
      });
  }

  function renderPlantResults(items) {
    if (!plantResult) return;
    plantResult.innerHTML = "";
    if (!items || items.length === 0) {
      if (plantEmpty) plantEmpty.style.display = "block";
      return;
    }
    if (plantEmpty) plantEmpty.style.display = "none";

    for (var i = 0; i < items.length; i++) {
      var p = items[i];
      
      var id = p.hashtag_id || p.HASHTAG_ID;
      var name = p.hashtag_name || p.HASHTAG_NAME;
      
      var li = document.createElement("li");
      li.className = "list-item";
      li.innerHTML =
          '<div class="item-top">' +
            '<div><b>' + escapeHtml(name || "") + '</b></div>' +
            '<button type="button" class="btn btn-ghost" data-hashtag-id="' + escapeHtml(id) + '">선택</button>' +
          '</div>';
      plantResult.appendChild(li);
    }
  }

  if (btnPlantSearch) {
    btnPlantSearch.addEventListener("click", function () {
      var kw = (plantKeyword && plantKeyword.value ? plantKeyword.value : "").trim();
      if (!kw) {
        renderPlantResults([]);
        return;
      }
      searchPlants(kw)
        .then(function (data) { renderPlantResults(data); })
        .catch(function () { renderPlantResults([]); });
    });
  }

  if (plantResult) {
	  plantResult.addEventListener("click", function (e) {
	    var pickBtn = closest(e.target, "button[data-hashtag-id]");
	    if (!pickBtn) return;

	    var hashtagId = pickBtn.getAttribute("data-hashtag-id");

	    fetch(ctx + "/user/myPage/aspect?hashtagId=" + encodeURIComponent(hashtagId), {
	      method: "POST",
	      headers: { "Accept": "application/json" }
	    })
	      .then(function (res) {
	        if (!res.ok) throw new Error("save failed");
	        return res.json();
	      })
	      .then(function () {
	        location.reload();
	      })
	      .catch(function () {
	        alert("관심사 저장에 실패했습니다.");
	      });
	  });
	}

  // -------------------------
  // Verify modal (phone/email)
  // -------------------------
  var modalVerifyTitle = document.getElementById("modalVerifyTitle");
  var verifyDesc = document.getElementById("verifyDesc");
  var verifyTarget = document.getElementById("verifyTarget");
  var btnEmailVerify = document.getElementById("btnEmailVerify");
  var inpPhone = document.getElementById("inpPhone");
  var inpEmail = document.getElementById("inpEmail");

  function openVerify(kind) {
    if (!isOwner) return;
      if (modalVerifyTitle) modalVerifyTitle.textContent = "이메일 인증";
      if (verifyDesc) verifyDesc.textContent = "이메일로 인증번호를 발송합니다.";
      if (verifyTarget) verifyTarget.value = inpEmail ? (inpEmail.value || "") : "";
    
    if (modals.verify) modals.verify.setAttribute("data-kind", kind);
    openModal(modals.verify);
  }

  if (btnEmailVerify && isOwner) btnEmailVerify.addEventListener("click", function () { openVerify("email"); });
  if (inpEmail) inpEmail.addEventListener("click", function () { if (isOwner) openVerify("email"); });

  var btnSendCode = document.getElementById("btnSendCode");
  var btnConfirmCode = document.getElementById("btnConfirmCode");
  var verifyCode = document.getElementById("verifyCode");

  if (btnSendCode) {
    btnSendCode.addEventListener("click", function () {
      var kind = modals.verify ? modals.verify.getAttribute("data-kind") : "";
      fetch(ctx + "/myPage/api/verify/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: kind })
      })
        .then(function (res) {
          if (!res.ok) throw new Error("send failed");
          alert("인증번호를 발송했습니다.");
        })
        .catch(function () {
          alert("인증번호 발송에 실패했습니다.");
        });
    });
  }

  if (btnConfirmCode) {
    btnConfirmCode.addEventListener("click", function () {
      var kind = modals.verify ? modals.verify.getAttribute("data-kind") : "";
      var code = (verifyCode && verifyCode.value ? verifyCode.value : "").trim();
      if (!code) return alert("인증번호를 입력하세요.");

      fetch(ctx + "/myPage/api/verify/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: kind, code: code })
      })
        .then(function (res) {
          if (!res.ok) throw new Error("confirm failed");
          alert("인증이 완료되었습니다.");
          location.reload();
        })
        .catch(function () {
          alert("인증에 실패했습니다.");
        });
    });
  }

  // -------------------------
  // Lists: tab + paging (7 items/page, max 5 pages)
  // -------------------------
  var PAGE_SIZE = 7;
  var MAX_PAGES = 5;

  function q(rootEl, sel) { return rootEl.querySelector(sel); }

  function fetchList(api, tab, page) {
    var url = api +
      "?userId=" + encodeURIComponent(profileUserId) +
      "&tab=" + encodeURIComponent(tab) +
      "&page=" + page +
      "&pageSize=" + PAGE_SIZE;

    return fetch(url, { headers: { "Accept": "application/json" } })
      .then(function (res) {
        if (!res.ok) throw new Error("list fetch failed");
        return res.json();
      });
  }

  function renderListItem(data, wrap) {
//    var title = escapeHtml(data.title || "");
//    var url = data.url || "#";
//    var createdAt = escapeHtml(data.createdAt || "");
//    var summary = escapeHtml(data.summary || "");
//
//    return '' +
//      '<li class="list-item">' +
//        '<div class="item-top">' +
//          '<a class="item-title" href="' + url + '">' + title + '</a>' +
//          '<div class="item-meta">' + createdAt + '</div>' +
//        '</div>' +
//        (summary ? '<div class="item-body">' + summary + '</div>' : '') +
//      '</li>';
	  
	  
		  var api = wrap.getAttribute("data-api");
	
		  // 작성댓글
		  if (api.indexOf("reply") !== -1) {
	
		    var content = escapeHtml(data.content || "");
		    var regDate = escapeHtml(data.reg_date || "");
	
		    return ''
		      + '<li class="list-item">'
		      + '<div class="comment-item">'
		      + '<div class="comment-content">' + content + '</div>'
		      + '<div class="comment-meta">등록날짜 ' + regDate + '</div>'
		      + '</div>'
		      + '</li>';
		  }
		  
		  var title = escapeHtml(data.title || "");
		  var url = data.moveUrl || "#";
		  var viewCount = Number(data.viewCount || 0);
		  var likeCount = Number(data.likeCount || 0);
		  var replyCnt = Number(data.replyCnt || 0);

		  return ''
		    + '<li class="list-item post-card">'
		    +   '<a class="post-link" href="' + url + '">'
		    +     '<div class="post-title">' + title + '</div>'
		    +     '<div class="post-meta">'
		    +       '<span>조회수 ' + viewCount + '</span>'
		    +       '<span>|</span>'
		    +       '<span>좋아요 ' + likeCount + '</span>'
		    +       '<span>|</span>'
		    +       '<span>댓글 ' + replyCnt + '</span>'
		    +     '</div>'
		    +   '</a>'
		    + '</li>';
		
	  
  }

  function renderPager(pagerEl, currentPage, totalPages, onMove) {
    pagerEl.innerHTML = "";
    var limitedTotal = Math.min(totalPages, MAX_PAGES);
    if (limitedTotal <= 1) return;

    for (var p = 1; p <= limitedTotal; p++) {
      (function (pageNum) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "page-btn" + (pageNum === currentPage ? " is-active" : "");
        btn.textContent = String(pageNum);
        btn.addEventListener("click", function () { onMove(pageNum); });
        pagerEl.appendChild(btn);
      })(p);
    }
  }

  function loadList(wrap, tab, page) {
    var api = wrap.getAttribute("data-api");
    console.log("api =", api, "tab =", tab, "page =", page);  
    var listEl = q(wrap, ".js-list");
    var pagerEl = q(wrap, ".js-pager");
    var emptyEl = q(wrap, ".js-empty");
    var totalEl = q(wrap, ".js-total");

    fetchList(api, tab, page)
      .then(function (data) {
    	  console.log("api =", api);
    	  console.log("data =", data);
//        var items = data.items || [];
//        var total = Number(data.total || 0);
//        var totalPages = Number(data.totalPages || 1);
//        var currentPage = Number(data.page || page);
    	  var items, total, totalPages, currentPage;

    	  if (Array.isArray(data)) {
    	    items = data;
    	    total = data.length;
    	    totalPages = 1;
    	    currentPage = 1;
    	  } else {
    	    items = data.items || [];
    	    total = Number(data.total || 0);
    	    totalPages = Number(data.totalPages || 1);
    	    currentPage = Number(data.page || page);
    	  }
    	
        if (totalEl) totalEl.textContent = String(total);

        if (!items || items.length === 0) {
          if (listEl) listEl.innerHTML = "";
          if (pagerEl) pagerEl.innerHTML = "";
          if (emptyEl) emptyEl.style.display = "block";
          return;
        }

        if (emptyEl) emptyEl.style.display = "none";
        if (listEl) {
          var html = "";
          for (var i = 0; i < items.length; i++) html += renderListItem(items[i], wrap);
          listEl.innerHTML = html;
        }

        if (pagerEl) {
          renderPager(pagerEl, currentPage, totalPages, function (p) {
            loadList(wrap, tab, p);
          });
        }
      })
      .catch(function () {
        // 요구사항: 데이터 없으면 숨김 (API 실패도 동일 취급)
        //wrap.style.display = "none";
    	  var listEl = q(wrap, ".js-list");
    	  var pagerEl = q(wrap, ".js-pager");
    	  var emptyEl = q(wrap, ".js-empty");
    	  var totalEl = q(wrap, ".js-total");

    	  if (totalEl) totalEl.textContent = "0";
    	  if (listEl) listEl.innerHTML = "";
    	  if (pagerEl) pagerEl.innerHTML = "";
    	  if (emptyEl) {
    	    emptyEl.textContent = "표시할 데이터가 없습니다.";
    	    emptyEl.style.display = "block";
    	  } 
      });
  }

  // 탭 처리
  var tabbars = Array.prototype.slice.call(document.querySelectorAll(".tabbar"));
  for (var tb = 0; tb < tabbars.length; tb++) {
    (function (tabbar) {
      tabbar.addEventListener("click", function (e) {
        var tabBtn = closest(e.target, ".tab");
        if (!tabBtn) return;

        // 같은 섹션의 list-wrap 찾기
        var sec = closest(tabbar, ".right-section");
        if (!sec) return;
        var wrap = sec.querySelector(".list-wrap");
        if (!wrap) return;

        var tabs = tabbar.querySelectorAll(".tab");
        for (var i = 0; i < tabs.length; i++) {
          tabs[i].classList.toggle("is-active", tabs[i] === tabBtn);
        }

        loadList(wrap, tabBtn.getAttribute("data-tab"), 1);
      });
    })(tabbars[tb]);
  }

  // Lazy load on section show
  var loaded = {};
  function lazyLoadIfNeeded(sectionId) {
    if (loaded[sectionId]) return;
    var sec = document.getElementById(sectionId);
    if (!sec) return;

    var wrap = sec.querySelector(".list-wrap");
    if (!wrap) return;

    var defaultTab = wrap.getAttribute("data-default-tab") || "all";
    loadList(wrap, defaultTab, 1);
    loaded[sectionId] = true;
  }

  for (var n = 0; n < navButtons.length; n++) {
    (function (btn) {
      btn.addEventListener("click", function () {
        lazyLoadIfNeeded(btn.getAttribute("data-target"));
      });
    })(navButtons[n]);
  }

  // -------------------------
  // Utilities
  // -------------------------
  function closest(el, selector) {
    while (el && el.nodeType === 1) {
      if (matches(el, selector)) return el;
      el = el.parentElement;
    }
    return null;
  }

  function matches(el, selector) {
    var p = Element.prototype;
    var f = p.matches || p.webkitMatchesSelector || p.msMatchesSelector;
    return f.call(el, selector);
  }

  function escapeHtml(str) {
    return String(str)
      .split("&").join("&amp;")
      .split("<").join("&lt;")
      .split(">").join("&gt;")
      .split('"').join("&quot;")
      .split("'").join("&#039;");
  }
//-------------------------
  // 프로필-이미지 업로드
 // ------------------------- 
  var avatarFile = document.querySelector("#avatarFile");
  var btnAvatarSave = document.querySelector("#btnAvatarSave");
  var avatarLarge = document.querySelector("#avatarLarge");
  
  avatarFile.addEventListener("change",
  function(e){
	  var file = e.target.files[0];
	  if(!file) return;
	  
	  var reader = new FileReader();
	  reader.onload = function (evt) {
	    avatarLarge.src = evt.target.result; // 미리보기
	  };
	  reader.readAsDataURL(file);
	});

	btnAvatarSave.addEventListener("click", function () {
	  var file = avatarFile.files[0];

	  if (!file) {
	    alert("이미지를 먼저 선택해주세요.");
	    return;
	  }

	  var formData = new FormData();
	  formData.append("profileImage", file);

	  fetch("/user/myPage/profileImage", {
	    method: "POST",
	    body: formData
	  })
	    .then(function (res) {
	    	if(!res.ok){
	    		return new Error("222222");
	    	}
	    	return res.json(); 
    	})
	    .then(function (data) {
	      if (data.success) {
	        alert("저장 완료");
	        location.reload();
	      } else {
	        alert("저장 실패");
	      }
	    })
	    .catch(function (err) {
	      alert("업로드 중 오류 발생" + err);
	    });
	});
  
  
  
  
 //-------------------------
  // 마이페이지-닉네임, 주소 수정
 // -------------------------
  var btnNick = document.querySelector("#nicknameUpdateBtn");
  var btnAddr = document.querySelector("#addressUpdateBtn");
  var nicknameInput = document.querySelector("#nicknameInput");
  var addressInput = document.querySelector("#addressInput");
  var nickMsg = document.querySelector("#nicknameMsg");
  var originalNick = nicknameInput.dataset.original;
  var originalAddr = addressInput.dataset.original;
  
  function mypageUpdate(payload) {
	  // payload: {nickname:"", address:""} 중 필요한 것만 넣어서 보냄
	  var body = Object.keys(payload)
	    .map(function(k){
	      return encodeURIComponent(k) + "=" + encodeURIComponent(payload[k]);
	    })
	    .join("&");

	  return fetch(ctx + "/user/myPage/update", {
	    method: "POST",
	    headers: {"Content-Type": "application/x-www-form-urlencoded"},
	    body: body
	  }).then(function(res){ return res.text(); });
	}

	// 닉네임 수정 버튼
	if (btnNick) {
	  btnNick.addEventListener("click", function(){
		  
		  var newNick = nicknameInput.value.trim();
		  
		  if(newNick === ""){
			  nickMsg.textContent = "닉네임을 수정해주세요";
			  nickMsg.style.color = "red"; 
		  }
		  else if(newNick === originalNick){
			  nickMsg.textContent = "다른 닉네임으로 수정해주세요";
			  nickMsg.className = "form-msg error";
			  nickMsg.style.color = "red";
			  return;
		  }
		  mypageUpdate({ nickname: newNick })
	      .then(function(t){ 

	    	  if ((t || "").trim() === "ok") {
	    	    nickMsg.textContent = "닉네임 수정 완료";
	    	    nickMsg.className = "form-msg success";
	    	    nickMsg.style.color = "green";
	    	    nickMsg.style.display = "inline";
	    	    //변경된 값 저장
	    	    nicknameInput.dataset.original = newNick;
	    	    
	    	    //왼쪽 닉네임도 즉시 반영
	    	    var leftNickEl = document.querySelector("#leftNickname");
	    	    
	    	    if(leftNickEl){
	    	    	leftNickEl.textContent = newNick;
	    	    }
	    	    setTimeout(function () {
	                nickMsg.style.display = "none";
	              }, 2000);
	    	    	
	    	  } else {
	    	    nickMsg.textContent = "닉네임 수정 실패";
	    	    nickMsg.className = "form-msg error";
	    	    nickMsg.style.color = "red";
	    	    nickMsg.style.display = "inline";
	    	    
	    	    setTimeout(function () {
	                nickMsg.style.display = "none";
	              }, 2000);
	    	  }
	    	});
	  	}); 
	}
	

	// 주소  수정 버튼
	if (btnAddr) {
	  btnAddr.addEventListener("click", function(){
		  
		  var newAddr = addressInput.value.trim();
		  
		  if(newAddr === ""){
			  addressMsg.textContent = "주소를 수정해주세요";
			  addressMsg.style.color = "red"; 
		  }
		  else if(newAddr === originalAddr){
			  addressMsg.textContent = "다른 주소로 수정해주세요";
			  addressMsg.className = "form-msg error";
			  addressMsg.style.color = "red";
			  return;
		  }
		  mypageUpdate({ address: addressInput.value })
	      .then(function(t){
	    	  if ((t || "").trim() === "ok") {
	    		  addressMsg.textContent = "주소 수정 완료";
	    		  addressMsg.className = "form-msg success";
	    		  addressMsg.style.color = "green";
	    		  addressMsg.style.display = "inline";
		    	    //변경된 값 저장
	    		  addressInput.dataset.original = newAddr;
	    		  
	    		  setTimeout(function () {
	    			  addressMsg.style.display = "none";
		              }, 2000);
	    		  
		    	  } else {
		    		addressMsg.textContent = "주소 수정 실패";
		    		addressMsg.className = "form-msg error";
		    		addressMsg.style.color = "red";
		    		addressMsg.style.display = "inline";
		    	    
		    	    setTimeout(function () {
		    	    	addressMsg.style.display = "none";
		              }, 2000);
		    	  }
	      });
	  });
	}
	
	//-------------------------
	  // 프로필-자기소개 수정
	 // -------------------------
	  var btnIntro = document.querySelector("#editIntro");
	  var introText = document.querySelector("#introText");
	  var introMsg = document.querySelector("#introMsg");
	  var originalIntro = introText ?(introText.dataset.original || ""):"";
	  
	  function introUpdate(intro) {
		  
		  return fetch(ctx + "/user/myPage/introUpdate", {
		    method: "POST",
		    headers: {"Content-Type": "application/x-www-form-urlencoded"},
		    body: "intro="+encodeURIComponent(intro)
		  })
		  .then(function(res){ 
			  return res.text(); 
		  });
		}

	  
	  	// 자기소개 수정 버튼
		if (btnIntro) {
			btnIntro.addEventListener("click", function(){
			  
			  var newIntro = introText.value.trim();
			  
			  if(newIntro === ""){
				  introMsg.textContent = "자기소개를 수정해주세요";
				  introMsg.style.color = "red"; 
			  }
			  else if(newIntro === originalIntro){
				  introMsg.textContent = "다른 내용으로 수정해주세요";
				  introMsg.className = "form-msg error";
				  introMsg.style.color = "red";
				  return;
			  }
			  introUpdate(newIntro)
		      .then(function(t){ 

		    	  if ((t || "").trim() === "ok") {
		    		introMsg.textContent = "내용 수정 완료";
		    		introMsg.className = "form-msg success";
		    		introMsg.style.color = "green";
		    		introMsg.style.display = "inline";
		    	    //변경된 값 저장
		    		originalIntro = newIntro;
		    		introText.dataset.original = newIntro;
		    		
		    		setTimeout(function () {
		    			introMsg.style.display = "none";
		              }, 2000);
		    		
		    	  } else {
		    		introMsg.textContent = "내용 수정 실패";
		    		introMsg.className = "form-msg error";
		    		introMsg.style.color = "red";
		    		introMsg.style.display = "inline";
		    		
		    		setTimeout(function () {
		    			introMsg.style.display = "none";
		              }, 2000);
		    	  }
		    	});
		  	}); 
		}
		
		
		// -------------------------
		// 작성글 불러오기
		// -------------------------
		(function () {
		  var postSection = document.getElementById("secPosts");
		  if (!postSection) return;
		
		  var wrap = postSection.querySelector(".list-wrap");
		  if (!wrap) return;
		
		  var api = wrap.getAttribute("data-api");
		  var defaultTab = wrap.getAttribute("data-default-tab") || "all";
		
		  var listEl = wrap.querySelector(".js-list");
		  var emptyEl = wrap.querySelector(".js-empty");
		  var totalEl = wrap.querySelector(".js-total");
		  var pagerEl = wrap.querySelector(".js-pager");
		  var tabButtons = postSection.querySelectorAll(".tabbar[data-section='posts'] .tab");
		
		  var currentTab = defaultTab;
		
		  function escapeHtml(str) {
		    if (str == null) return "";
		    return String(str)
		      .replace(/&/g, "&amp;")
		      .replace(/</g, "&lt;")
		      .replace(/>/g, "&gt;")
		      .replace(/"/g, "&quot;")
		      .replace(/'/g, "&#39;");
		  }
		
		  function renderList(data) {
		    if (!listEl || !emptyEl || !totalEl) return;
		
		    listEl.innerHTML = "";
		    pagerEl.innerHTML = "";
		
		    if (!data || data.length === 0) {
		      totalEl.textContent = "0";
		      emptyEl.style.display = "block";
		      listEl.style.display = "none";
		      return;
		    }
		
		    var filtered = data;
		
		    if (currentTab === "community") {
		      filtered = data.filter(function (item) {
		        return !item.moveUrl || item.moveUrl.indexOf("/qna/") === -1;
		      });
		    } else if (currentTab === "qna") {
		      filtered = data.filter(function (item) {
		        return item.moveUrl && item.moveUrl.indexOf("/qna/") !== -1;
		      });
		    }
		
		    totalEl.textContent = String(filtered.length);
		
		    if (filtered.length === 0) {
		      emptyEl.style.display = "block";
		      listEl.style.display = "none";
		      return;
		    }
		
		    emptyEl.style.display = "none";
		    listEl.style.display = "block";
		
		    var html = "";
		
		    for (var i = 0; i < filtered.length; i++) {
		      var post = filtered[i];
		
		      html += ''
		        + '<li class="list-item">'
		        + '  <a class="list-link" href="' + escapeHtml(post.moveUrl || "#") + '">'
		        + '    <div class="item-title">' + escapeHtml(post.title || "") + '</div>'
		        + '    <div class="item-meta">'
		        + '      조회 ' + (post.viewCount || 0) + ' · 댓글 ' + (post.replyCnt || 0)
		        + '    </div>'
		        + '  </a>'
		        + '</li>';
		    }
		
		    listEl.innerHTML = html;
		  }
		
		  function loadPosts() {
		    if (!api) return;
		
		    fetch(api)
		      .then(function (res) {
		        return res.json();
		      })
		      .then(function (data) {
		        console.log("작성글 데이터:", data);
		        renderList(data);
		      })
		      .catch(function (err) {
		        console.log("작성글 불러오기 실패:", err);
		        totalEl.textContent = "0";
		        emptyEl.style.display = "block";
		        listEl.style.display = "none";
		      });
		  }
		
		  for (var i = 0; i < tabButtons.length; i++) {
		    tabButtons[i].addEventListener("click", function () {
		      currentTab = this.getAttribute("data-tab");
		
		      for (var j = 0; j < tabButtons.length; j++) {
		        tabButtons[j].classList.remove("is-active");
		      }
		      this.classList.add("is-active");
		
		      loadPosts();
		    });
		  }
		
		  loadPosts();
		})();
		
		

  
 
  
})();
