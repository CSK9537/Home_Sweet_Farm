document.addEventListener("DOMContentLoaded", () => {

  const qInput = document.querySelector(".fsearch__input");

  // ------------------------------------------------------------
  //  - 엔터: 검색 실행
  // ------------------------------------------------------------
//  if (qInput) {
//    qInput.addEventListener("keydown", (e) => {
//      if (e.key === "Enter") {
//        e.preventDefault();
//        const safeTrim = (v) => (v == null ? "" : String(v)).trim();
//        const q = safeTrim(qInput ? qInput.value : "");
//        const params = new URLSearchParams();
//        if (q) params.set("q", q);
//        if (!(q == "" || q == null || q.length < 2)) window.location.href = "/searchResult";
//        qInput.blur();
//      }
//    });
//  }

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
  
  //=============================================================
  // [Active Menu] 현재 URL 경로를 확인하여 헤더 메뉴 활성화 표시
  // ============================================================
  const currentPath = window.location.pathname;

  // 1. 데스크탑 메뉴 활성화 처리
  const desktopLinks = document.querySelectorAll(".gnb__link, .subbar__link");
  desktopLinks.forEach(link => {
    const href = link.getAttribute("href");
    
    // href가 유효하고, 임시 링크(#)나 메인(/)이 아니며, 현재 경로가 href로 시작하는 경우
    // ex) currentPath가 "/plant/detail" 일 때, href가 "/plant" 이면 매칭됨
    if (href && href !== "/" && href !== "#" && currentPath.startsWith(href)) {
      link.classList.add("active"); // 본인에게 active 부여

      // 만약 서브메뉴(.subbar__link)가 선택되었다면, 부모 대분류(.gnb__link)도 같이 활성화
      const parentItem = link.closest(".gnb__item");
      if (parentItem) {
        const mainLink = parentItem.querySelector(".gnb__link");
        if (mainLink) mainLink.classList.add("active");
      }
    }
  });

  // 2. 모바일 햄버거 메뉴 활성화 처리
  const mobileLinks = document.querySelectorAll(".mnav__list a");
  mobileLinks.forEach(link => {
    const href = link.getAttribute("href");
    
    if (href && href !== "/" && href !== "#" && currentPath.startsWith(href)) {
      link.classList.add("active"); // 본인에게 active 부여

      // 서브메뉴(details 안의 a 태그)인 경우
      const parentDetails = link.closest("details.mnav__item");
      if (parentDetails) {
        // 모바일 메뉴를 열었을 때 해당 아코디언이 열려 있도록 처리
        parentDetails.open = true; 
        
        // 부모 대분류(summary) 제목도 활성화 색상 적용
        const summary = parentDetails.querySelector("summary");
        if (summary) summary.classList.add("active");
      }
    }
  });
});
