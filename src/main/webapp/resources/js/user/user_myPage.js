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
    var t = e.target;
    var closeBtn = t && t.closest ? t.closest("[data-modal-close]") : null;
    
    if (closeBtn) {
      var modal = closeBtn.closest(".modal");
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
  if (btnAvatar && isOwner) {
    btnAvatar.addEventListener("click", function () { openModal(modals.avatar); });
  }

  // 프로필: 회원등급 안내
  var btnGradeGuide = document.getElementById("btnGrade");
  if (btnGradeGuide) {
    btnGradeGuide.addEventListener("click", function () { openModal(modals.grade); });
  }


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
    var url = ctx + "/user/mypage/hashtag?keyword=" + encodeURIComponent(keyword);
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

      fetch(ctx + "/user/mypage/aspect?hashtagId=" + encodeURIComponent(hashtagId), {
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
          showCustomToast("관심사 저장에 실패했습니다.", "error");
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
    // 백엔드 컨트롤러에 맞게 userId, tab, page, pageSize 파라미터 조립!
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
    var api = wrap.getAttribute("data-api");

    // 작성댓글
    if (api.indexOf("reply") !== -1) {
      var content = escapeHtml(data.content || "");
      var regDate = escapeHtml(data.reg_date || "");

      return ''
        + '<li class="list-item">'
        +   '<div class="comment-item">'
        +     '<div class="comment-content">' + content + '</div>'
        +     '<div class="comment-meta">등록날짜 ' + regDate + '</div>'
        +   '</div>'
        + '</li>';
    }
    
    // 작성글 / 질문 / 답변 등
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
    var listEl = q(wrap, ".js-list");
    var pagerEl = q(wrap, ".js-pager");
    var emptyEl = q(wrap, ".js-empty");
    var totalEl = q(wrap, ".js-total");

    fetchList(api, tab, page)
      .then(function (data) {
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
          for (var i = 0; i < items.length; i++) {
            html += renderListItem(items[i], wrap);
          }
          listEl.innerHTML = html;
        }

        if (pagerEl) {
          renderPager(pagerEl, currentPage, totalPages, function (p) {
            loadList(wrap, tab, p);
          });
        }
      })
      .catch(function () {
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
    if (str == null) return "";
    return String(str)
      .split("&").join("&amp;")
      .split("<").join("&lt;")
      .split(">").join("&gt;")
      .split('"').join("&quot;")
      .split("'").join("&#039;");
  }

  // -------------------------
  // 프로필-이미지 업로드
  // ------------------------- 
  var avatarFile = document.querySelector("#avatarFile");
  var btnAvatarSave = document.querySelector("#btnAvatarSave");
  var avatarLarge = document.querySelector("#avatarLarge");
  
  if (avatarFile && btnAvatarSave && avatarLarge) {
    avatarFile.addEventListener("change", function(e) {
      var file = e.target.files[0];
      if (!file) return;
      
      var reader = new FileReader();
      reader.onload = function (evt) {
        avatarLarge.src = evt.target.result; // 미리보기
      };
      reader.readAsDataURL(file);
    });

    btnAvatarSave.addEventListener("click", function () {
      var file = avatarFile.files[0];

      if (!file) {
        showCustomToast("이미지를 먼저 선택해주세요.", "warning");
        return;
      }

      var formData = new FormData();
      formData.append("profileImage", file);

      fetch("/user/uploadProfile", {
        method: "POST",
        body: formData
      })
        .then(function (res) {
          if (!res.ok) {
            throw new Error("error");
          }
          return res.json(); 
        })
        .then(function (data) {
          if (data.status === "success") { 
            showCustomToast("이미지 저장 완료", "success");
            location.reload();
          } else {
            showCustomToast("저장 실패", "error");
          }
        })
        .catch(function (err) {
          showCustomToast("업로드 중 오류 발생", "error");
        });
    });
  }
  
  // -------------------------
  // 프로필-자기소개 수정
  // -------------------------
  var btnIntro = document.querySelector("#editIntro");
  var introText = document.querySelector("#introText");
  var introMsg = document.querySelector("#introMsg");
  var originalIntro = introText ? (introText.dataset.original || "") : "";
  
  function introUpdate(intro) {
    return fetch(ctx + "/user/mypage/introUpdate", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "intro=" + encodeURIComponent(intro)
    })
    .then(function(res) { 
      return res.text(); 
    });
  }
  
  // 자기소개 수정 버튼
  if (btnIntro) {
    btnIntro.addEventListener("click", function() {
      var newIntro = introText.value.trim();
      
      if (newIntro === "") {
        introMsg.textContent = "자기소개를 수정해주세요";
        introMsg.style.color = "red"; 
        return;
      } else if (newIntro === originalIntro) {
        introMsg.textContent = "다른 내용으로 수정해주세요";
        introMsg.className = "form-msg error";
        introMsg.style.color = "red";
        return;
      }
      
      introUpdate(newIntro).then(function(t) { 
        if ((t || "").trim() === "ok") {
          introMsg.textContent = "내용 수정 완료";
          introMsg.className = "form-msg success";
          introMsg.style.color = "green";
          introMsg.style.display = "inline";
          
          // 변경된 값 저장
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

})();