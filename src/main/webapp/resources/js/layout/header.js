document.addEventListener("DOMContentLoaded", () => {
  // ============================================================
  // [초기화] DOM 로드 완료 후 실행 (요소 null 방지)
  // ============================================================

  // ============================================================
  // [Filter Search] 필터 검색 UI 전체 초기화 및 이벤트 바인딩
  // ============================================================
  const root = document.getElementById("filterSearch");
  if (root) {
    // [Filter Search] JS 활성화 상태 표시(스타일/동작 분기용)
    root.classList.add("js");

    // [Filter Search] UI 요소 참조
    const toggle = document.getElementById("fsearchToggle");      // 패널 토글(체크박스)
    const bar = document.getElementById("fsearchBar");            // 검색바(클릭하면 패널 열기)
    const qInput = document.getElementById("searchQ");            // 검색어 입력
    const hint = document.getElementById("filterHint");           // 선택 안내 문구

    const mainWrap = document.getElementById("mainCategories");   // 대분류/소분류 목록 래퍼
    const subPanel = document.getElementById("subPanel");         // 소분류 패널(우측/오버레이)
    const categoryCell = root.querySelector(".fpanel__cell--category"); // 카테고리 셀
    const doSearchBtn = document.getElementById("doSearchBtn");   // 검색 실행 버튼
    const closePanelBtn = document.getElementById("closePanelBtn"); // 패널 닫기 버튼
    const addFilterBtn = document.getElementById("addFilterBtn"); // 필터 누적(+) 버튼(미구현 안내)

    // [Filter Search] 선택 상태(대분류/소분류)
    const state = { main: "", sub: "" };

    // [Filter Search] 입력값 안전 처리(널/공백 방지)
    const safeTrim = (v) => (v == null ? "" : String(v)).trim();

    // ------------------------------------------------------------
    // [Filter Search] 힌트 문구 업데이트(대/소분류 선택 상태 표시)
    // ------------------------------------------------------------
    const updateHint = () => {
      if (!hint) return;
      if (!state.main) {
        hint.textContent = "대분류를 선택해주세요.";
        return;
      }
      if (state.main && !state.sub) {
        hint.textContent = state.main + " 선택됨 (소분류 선택 가능)";
        return;
      }
      hint.textContent = state.main + " > " + state.sub;
    };

    // ------------------------------------------------------------
    // [Filter Search] 검색 입력 placeholder 업데이트(선택 상태 미리보기)
    // ------------------------------------------------------------
    const updateInputPreview = () => {
      if (!qInput) return;
      let prefix = "";
      if (state.main) {
        prefix = state.sub
          ? ("[" + state.main + " > " + state.sub + "] ")
          : ("[" + state.main + "] ");
      }
      // JSP EL 충돌 방지: 템플릿 리터럴(`${}`) 사용하지 않음
      qInput.placeholder = prefix ? (prefix + "검색어를 입력하세요") : "";
    };

    // ------------------------------------------------------------
    // [Filter Search] 대분류 details(아코디언) 다중 열림 방지(하나만 열기)
    // ------------------------------------------------------------
    const closeAllDetails = (except) => {
      if (!mainWrap) return;
      const all = mainWrap.querySelectorAll("details.fcat__item");
      all.forEach((d) => {
        if (d !== except) d.removeAttribute("open");
      });
    };

    // ------------------------------------------------------------
    // [Filter Search] 소분류 패널 숨기기(클론 제거/ARIA 처리)
    // ------------------------------------------------------------
    const hideSubPanel = () => {
      if (!subPanel || !categoryCell) return;
      categoryCell.classList.remove("showing-sub");
      subPanel.innerHTML = "";
      subPanel.setAttribute("aria-hidden", "true");
    };

    // ------------------------------------------------------------
    // [Filter Search] 소분류 패널 표시(선택된 대분류의 소분류 목록을 클론해서 보여줌)
    // ------------------------------------------------------------
    const showSubPanelFrom = (subEl) => {
      if (!subPanel || !categoryCell || !subEl) return;
      subPanel.innerHTML = "";

      // [Filter Search] 소분류 패널 뒤로가기 버튼
      const back = document.createElement("button");
      back.type = "button";
      back.className = "fsub-panel__back";
      back.setAttribute("aria-label", "뒤로");
      back.textContent = "←";
      back.addEventListener("click", (ev) => {
        ev.stopPropagation();
        hideSubPanel();
      });

      // [Filter Search] 소분류 목록 클론(원본 DOM 구조를 유지)
      const clone = subEl.cloneNode(true);
      clone.style.position = "static";

      // [Filter Search] 소분류 클릭 시 선택 상태 반영 후 패널 닫기
      clone.querySelectorAll(".fsub__item").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const sub = btn.getAttribute("data-sub");
          if (sub) setSub(sub);
          hideSubPanel();
        });
      });

      subPanel.appendChild(back);
      subPanel.appendChild(clone);

      categoryCell.classList.add("showing-sub");
      subPanel.setAttribute("aria-hidden", "false");
    };

    // ------------------------------------------------------------
    // [Filter Search] 대분류 선택 처리(소분류 초기화, 소분류 패널 표시)
    // ------------------------------------------------------------
    const setMain = (main, openerDetails) => {
      state.main = safeTrim(main);
      state.sub = "";
      updateHint();
      updateInputPreview();

      if (openerDetails) {
        const subEl = openerDetails.querySelector(".fsub");
        if (subEl) showSubPanelFrom(subEl);
        openerDetails.removeAttribute("open");
        closeAllDetails(openerDetails);
      } else {
        hideSubPanel();
        closeAllDetails(null);
      }
    };

    // ------------------------------------------------------------
    // [Filter Search] 소분류 선택 처리(패널 닫기/포커스 해제)
    // ------------------------------------------------------------
    const setSub = (sub) => {
      state.sub = safeTrim(sub);
      updateHint();
      updateInputPreview();

      if (toggle) toggle.checked = false;
      if (qInput) qInput.blur();
      hideSubPanel();
    };

    // ------------------------------------------------------------
    // [Filter Search] 검색 패널 열기
    // ------------------------------------------------------------
    const openPanel = () => {
      if (toggle) toggle.checked = true;
    };

    // ------------------------------------------------------------
    // [Filter Search] 검색바 클릭/키보드 접근 시 패널 열기
    // ------------------------------------------------------------
    if (bar) {
      bar.addEventListener("click", (e) => {
        e.stopPropagation();
        openPanel();
      });

      bar.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          openPanel();
          if (qInput) qInput.focus();
        }
      });
    }

    // ------------------------------------------------------------
    // [Filter Search] 입력 포커스/입력/엔터 처리
    //  - 포커스: 패널 열기
    //  - 입력: 값이 있으면 소분류 패널 숨김
    //  - 엔터: 검색 실행 후 패널 닫기
    // ------------------------------------------------------------
    if (qInput) {
      qInput.addEventListener("focus", (e) => {
        e.stopPropagation();
        openPanel();
      });

      qInput.addEventListener("input", () => {
        const v = safeTrim(qInput.value);
        if (v) {
          if (toggle) toggle.checked = false;
          hideSubPanel();
        }
      });

      qInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (doSearchBtn) doSearchBtn.click();
          if (toggle) toggle.checked = false;
          qInput.blur();
          hideSubPanel();
        }
      });
    }

    // ------------------------------------------------------------
    // [Filter Search] 패널 닫기 버튼 처리
    // ------------------------------------------------------------
    if (closePanelBtn) {
      closePanelBtn.addEventListener("click", () => {
        if (toggle) toggle.checked = false;
        if (qInput) qInput.blur();
        hideSubPanel();
      });
    }

    // ------------------------------------------------------------
    // [Filter Search] 패널 외부 클릭 시 닫기(바깥 영역 클릭 감지)
    // ------------------------------------------------------------
    document.addEventListener("click", (e) => {
      if (!toggle || !toggle.checked) return;
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (root.contains(t)) return;
      toggle.checked = false;
      if (qInput) qInput.blur();
      hideSubPanel();
    });

    // ------------------------------------------------------------
    // [Filter Search] ESC 키로 패널 닫기
    // ------------------------------------------------------------
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && toggle && toggle.checked) {
        toggle.checked = false;
        if (qInput) qInput.blur();
        hideSubPanel();
      }
    });

    // ------------------------------------------------------------
    // [Filter Search] 카테고리 클릭 처리
    //  - 대분류(summary 클릭): 대분류 선택 + 소분류 패널 표시
    //  - 소분류 클릭: 소분류 선택
    //  - 단일 대분류 버튼: 대분류만 선택하고 패널 닫기
    // ------------------------------------------------------------
    if (mainWrap) {
      mainWrap.addEventListener("click", (e) => {
        const t = e.target;
        if (!(t instanceof Element)) return;

        const summary = t.closest(".fcat__summary");
        if (summary) {
          e.preventDefault();
          e.stopPropagation();
          const parent = summary.closest("details.fcat__item");
          if (parent) {
            const main = parent.getAttribute("data-main");
            if (main) setMain(main, parent);
          }
          return;
        }

        const subBtn = t.closest(".fsub__item");
        if (subBtn) {
          const sub = subBtn.getAttribute("data-sub");
          if (sub) setSub(sub);
          return;
        }

        const mainBtn = t.closest(".fcat__solo");
        if (mainBtn) {
          const main = mainBtn.getAttribute("data-main");
          if (main) {
            setMain(main, null);
            if (toggle) toggle.checked = false;
            if (qInput) qInput.blur();
          }
        }
      });
    }

    // ------------------------------------------------------------
    // [Filter Search] 검색 실행(쿼리스트링 생성 후 /search 이동)
    // ------------------------------------------------------------
    if (doSearchBtn) {
      doSearchBtn.addEventListener("click", () => {
        const q = safeTrim(qInput ? qInput.value : "");
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (state.main) params.set("main", state.main);
        if (state.sub) params.set("sub", state.sub);
        if (!(q == "" || q == null || q.length < 2)) window.location.href = "/search?" + params.toString();
      });
    }

    // ------------------------------------------------------------
    // [Filter Search] 필터 누적(+) 버튼(현재는 안내만)
    // ------------------------------------------------------------
    if (addFilterBtn) {
      addFilterBtn.addEventListener("click", () => {
        alert("필터 누적(+) 기능은 UI(chip) 설계 후 추가 구현이 필요합니다.");
      });
    }

    // [Filter Search] 초기 힌트/placeholder 세팅
    updateHint();
    updateInputPreview();
  }

  // ============================================================
  // [Mobile Hamburger Drawer] 모바일 햄버거 메뉴(드로어) 초기화
  // ============================================================
  const mnav = document.getElementById("mnav");
  const mnavBtn = document.getElementById("mnavBtn");
  const mnavClose = document.getElementById("mnavClose");
  const mnavBackdrop = document.getElementById("mnavBackdrop");

  // [Mobile Hamburger Drawer] 필수 요소 없으면 종료
  if (!mnav || !mnavBtn) return;

  // [Mobile Hamburger Drawer] 아코디언 목록(details)
  const mnavDetails = Array.from(mnav.querySelectorAll("details.mnav__item"));

  // ------------------------------------------------------------
  // [Mobile Hamburger Drawer] 아코디언: 하나 열면 나머지 닫기
  // ------------------------------------------------------------
  mnavDetails.forEach((d) => {
    d.addEventListener("toggle", () => {
      if (d.open) {
        mnavDetails.forEach((other) => {
          if (other !== d) other.open = false;
        });
      }
    });
  });

  // ------------------------------------------------------------
  // [Mobile Hamburger Drawer] 드로어 닫힐 때 아코디언 전부 초기화
  // ------------------------------------------------------------
  const resetMnavAccordion = () => {
    mnavDetails.forEach((d) => (d.open = false));
  };

  // ------------------------------------------------------------
  // [Mobile Hamburger Drawer] 드로어 열기(ARIA 포함)
  // ------------------------------------------------------------
  const openMnav = () => {
    mnav.classList.add("is-open");
    mnav.setAttribute("aria-hidden", "false");
    mnavBtn.setAttribute("aria-expanded", "true");
  };

  // ------------------------------------------------------------
  // [Mobile Hamburger Drawer] 드로어 닫기(ARIA + 아코디언 초기화)
  // ------------------------------------------------------------
  const closeMnav = () => {
    mnav.classList.remove("is-open");
    mnav.setAttribute("aria-hidden", "true");
    mnavBtn.setAttribute("aria-expanded", "false");
    resetMnavAccordion();
  };

  // ------------------------------------------------------------
  // [Mobile Hamburger Drawer] 햄버거 버튼 클릭 시 드로어 열기
  // ------------------------------------------------------------
  mnavBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openMnav();
  });

  // ------------------------------------------------------------
  // [Mobile Hamburger Drawer] 닫기 버튼 / 배경 클릭 시 드로어 닫기
  // ------------------------------------------------------------
  if (mnavClose) mnavClose.addEventListener("click", closeMnav);
  if (mnavBackdrop) mnavBackdrop.addEventListener("click", closeMnav);

  // ------------------------------------------------------------
  // [Mobile Hamburger Drawer] ESC 키로 드로어 닫기
  // ------------------------------------------------------------
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMnav();
  });

  // ------------------------------------------------------------
  // [Mobile Hamburger Drawer] 메뉴 링크 클릭 시 드로어 닫기
  // ------------------------------------------------------------
  mnav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", closeMnav);
  });
});
