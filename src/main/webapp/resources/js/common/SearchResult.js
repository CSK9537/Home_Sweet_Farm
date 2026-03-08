// SearchResult.js

document.addEventListener("DOMContentLoaded", function() {
  const tabs = document.querySelectorAll(".search-result-tab");
  const sections = document.querySelectorAll(".search-result-section");

  tabs.forEach(tab => {
    tab.addEventListener("click", function() {
      // 1. 탭 활성화 변경
      tabs.forEach(t => t.classList.remove("is-active"));
      this.classList.add("is-active");

      const target = this.getAttribute("data-target");

      // 2. 섹션 표시/숨김 처리
      if (target === "all") {
        sections.forEach(sec => sec.style.display = "block");
      } else {
        sections.forEach(sec => {
          if (sec.id === target) {
            sec.style.display = "block";
          } else {
            sec.style.display = "none";
          }
        });
      }
    });
  });
});