// mypage.js (ES5 호환)
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
    qna: document.getElementById("modalQna"),
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
    console.log("openModal called:", el.id);
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

  // 프로필: 등급 안내 / Q&A 레벨업
  var btnGradeGuide = document.getElementById("btnGradeGuide");
  if (btnGradeGuide) btnGradeGuide.addEventListener("click", function () { openModal(modals.grade); });

  var btnQnaLevelUp = document.getElementById("btnQnaLevelUp");
  if (btnQnaLevelUp) btnQnaLevelUp.addEventListener("click", function () { openModal(modals.qna); });

  // 프로필 이미지 크게보기 (주인만)
  var btnAvatar = document.getElementById("btnAvatar");
  if (btnAvatar && isOwner) btnAvatar.addEventListener("click", function () { openModal(modals.avatar); });

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
    var url = ctx + "/plant/api/search?keyword=" + encodeURIComponent(keyword);
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
      var li = document.createElement("li");
      li.className = "list-item";
      li.innerHTML =
        '<div class="item-top">' +
          '<div>' +
            '<div><b>' + escapeHtml(p.plant_name_kor || p.plant_name_kr || "") + '</b></div>' +
            '<div class="muted">' + escapeHtml(p.plant_name || p.plant_name_en || "") + '</div>' +
          '</div>' +
          '<button type="button" class="btn btn-ghost" data-plant-id="' + escapeHtml(p.plant_id) + '">선택</button>' +
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
      var pickBtn = closest(e.target, "button[data-plant-id]");
      if (!pickBtn) return;

      var plantId = pickBtn.getAttribute("data-plant-id");
      fetch(ctx + "/mypage/api/interest-plant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plantId: plantId })
      })
        .then(function (res) {
          if (!res.ok) throw new Error("save failed");
          location.reload();
        })
        .catch(function () {
          alert("관심식물 저장에 실패했습니다.");
        });
    });
  }

  // -------------------------
  // Verify modal (phone/email)
  // -------------------------
  var modalVerifyTitle = document.getElementById("modalVerifyTitle");
  var verifyDesc = document.getElementById("verifyDesc");
  var verifyTarget = document.getElementById("verifyTarget");
  var btnPhoneVerify = document.getElementById("btnPhoneVerify");
  var btnEmailVerify = document.getElementById("btnEmailVerify");
  var inpPhone = document.getElementById("inpPhone");
  var inpEmail = document.getElementById("inpEmail");

  function openVerify(kind) {
    if (!isOwner) return;
    if (kind === "phone") {
      if (modalVerifyTitle) modalVerifyTitle.textContent = "휴대전화 인증";
      if (verifyDesc) verifyDesc.textContent = "휴대전화 번호로 인증번호를 발송합니다.";
      if (verifyTarget) verifyTarget.value = inpPhone ? (inpPhone.value || "") : "";
    } else {
      if (modalVerifyTitle) modalVerifyTitle.textContent = "이메일 인증";
      if (verifyDesc) verifyDesc.textContent = "이메일로 인증번호를 발송합니다.";
      if (verifyTarget) verifyTarget.value = inpEmail ? (inpEmail.value || "") : "";
    }
    if (modals.verify) modals.verify.setAttribute("data-kind", kind);
    openModal(modals.verify);
  }

  if (btnPhoneVerify && isOwner) btnPhoneVerify.addEventListener("click", function () { openVerify("phone"); });
  if (btnEmailVerify && isOwner) btnEmailVerify.addEventListener("click", function () { openVerify("email"); });
  if (inpPhone) inpPhone.addEventListener("click", function () { if (isOwner) openVerify("phone"); });
  if (inpEmail) inpEmail.addEventListener("click", function () { if (isOwner) openVerify("email"); });

  var btnSendCode = document.getElementById("btnSendCode");
  var btnConfirmCode = document.getElementById("btnConfirmCode");
  var verifyCode = document.getElementById("verifyCode");

  if (btnSendCode) {
    btnSendCode.addEventListener("click", function () {
      var kind = modals.verify ? modals.verify.getAttribute("data-kind") : "";
      fetch(ctx + "/mypage/api/verify/send", {
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

      fetch(ctx + "/mypage/api/verify/confirm", {
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

  function renderListItem(data) {
    var title = escapeHtml(data.title || "");
    var url = data.url || "#";
    var createdAt = escapeHtml(data.createdAt || "");
    var summary = escapeHtml(data.summary || "");

    return '' +
      '<li class="list-item">' +
        '<div class="item-top">' +
          '<a class="item-title" href="' + url + '">' + title + '</a>' +
          '<div class="item-meta">' + createdAt + '</div>' +
        '</div>' +
        (summary ? '<div class="item-body">' + summary + '</div>' : '') +
      '</li>';
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
    var listEl = q(wrap, ".js-list");
    var pagerEl = q(wrap, ".js-pager");
    var emptyEl = q(wrap, ".js-empty");
    var totalEl = q(wrap, ".js-total");

    fetchList(api, tab, page)
      .then(function (data) {
        var items = data.items || [];
        var total = Number(data.total || 0);
        var totalPages = Number(data.totalPages || 1);
        var currentPage = Number(data.page || page);

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
          for (var i = 0; i < items.length; i++) html += renderListItem(items[i]);
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
        wrap.style.display = "none";
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
})();
