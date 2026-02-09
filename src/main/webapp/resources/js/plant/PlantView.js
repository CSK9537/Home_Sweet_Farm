// PlantView.js
(function () {
  "use strict";

  function isBlankText(el) {
    if (!el) return true;
    const txt = (el.textContent || "").replace(/\u00a0/g, " ").trim();
    return txt.length === 0;
  }

  // data-section 내부에 실질 텍스트/이미지/행 등이 없으면 섹션 숨김
  function pruneEmptySections(root) {
    const sections = root.querySelectorAll("[data-section]");
    sections.forEach((sec) => {
      // 이미지가 있는지
      const hasImg = sec.querySelector("img[src]") !== null;

      // 테이블의 경우 row 존재 여부
      const hasRow = sec.querySelector("tr") !== null;

      // 카드/텍스트의 경우
      const hasText = !isBlankText(sec);

      // 버튼/링크만 있는 CTA는 텍스트가 없어도 남길 수 있으니 예외 최소화
      const hasAction = sec.querySelector("a.btn, button") !== null;

      if (!hasImg && !hasRow && !hasText && !hasAction) {
        sec.style.display = "none";
      }
    });
  }

  // 갤러리 스크롤
  function initGallery() {
    const track = document.getElementById("pvGalleryTrack");
    if (!track) return;

    const imgs = track.querySelectorAll("img");
    const prevBtn = document.querySelector(".pv-gbtn--prev");
    const nextBtn = document.querySelector(".pv-gbtn--next");

    // 이미지가 0~1장이면 버튼 숨김
    if (imgs.length <= 1) {
      if (prevBtn) prevBtn.style.display = "none";
      if (nextBtn) nextBtn.style.display = "none";
      return;
    }

    const step = () => {
      // 첫 이미지 폭 기준 이동량 계산
      const first = track.querySelector("img");
      if (!first) return 240;
      const rect = first.getBoundingClientRect();
      return Math.max(180, Math.floor(rect.width + 10));
    };

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        track.scrollLeft -= step();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        track.scrollLeft += step();
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("plantViewRoot");
    if (!root) return;

    pruneEmptySections(root);
    initGallery();
  });
})();
