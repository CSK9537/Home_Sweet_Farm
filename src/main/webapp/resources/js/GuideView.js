// guideView.js
// - JSP에서 c:if로 1차 필터링을 하지만,
//   공백/개행만 있는 텍스트가 찍히는 케이스까지 2차로 숨김 처리.

document.addEventListener("DOMContentLoaded", () => {
  // 섹션 내부에서 "실제 텍스트가 비어있으면" 섹션 자체를 숨김
  document.querySelectorAll(".js-empty-scan").forEach(section => {
    // section 안에 value 후보들 모으기
    const candidates = section.querySelectorAll(
      ".summary-item__value, .guide-kv__value, .guide-text, .temp-card__value"
    );

    if (candidates.length === 0) return;

    // 하나라도 유효 텍스트가 있으면 표시 유지
    const hasAnyValue = Array.from(candidates).some(el => {
      const t = (el.textContent || "").replace(/\s+/g, " ").trim();
      // "-", "null" 같은 표시값이 들어오면 비어있는 것으로 간주하고 싶다면 여기 추가
      if (!t) return false;
      if (t === "-" || t.toLowerCase() === "null") return false;
      return true;
    });

    if (!hasAnyValue) {
      section.style.display = "none";
    }
  });
});
