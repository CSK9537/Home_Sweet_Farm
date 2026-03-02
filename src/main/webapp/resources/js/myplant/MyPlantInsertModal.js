document.addEventListener("DOMContentLoaded", () => {
  function getCpath() {
    const path = window.location.pathname;
    const idx = path.indexOf("/", 1);
    return idx > 0 ? path.substring(0, idx) : "";
  }
  
  // 모달창 요소
  const modalEl = document.querySelector("#addPlantModal");
  const searchInput = document.getElementById('plantSearchInput');
  const plantPickList = document.getElementById('plantPickList');
  const pickedPlantIdInput = document.getElementById('pickedPlantId');
  const plantItems = document.querySelectorAll('.mpm-item');
  const confirmBtn = document.getElementById('confirmAddPlant');
  
  let isTimerRunning = false;
  
  
  // 모달 열기/닫기 공통 로직
  // 부모 페이지에서 data-insert-open 속성을 가진 버튼을 누르면 모달 열림
  document.addEventListener("click", (e) => {
    
	const openBtn = e.target.closest("[data-insert-open]");
	
	// 열기
    if (openBtn) {
      if (modalEl) {
        modalEl.classList.add("is-open");
        modalEl.setAttribute("aria-hidden", "false");
        searchInput.focus();
      }
    }
    // 닫기 (X 버튼이나 배경 클릭 시)
    if (e.target.closest("[data-insert-close]")) {
      if (modalEl) {
        modalEl.classList.remove("is-open");
        modalEl.setAttribute("aria-hidden", "true");
        plantPickList.innerHTML = ''; // 모달 닫을 때 검색 결과도 초기화
        plantItems.forEach(item => item.style.display = '');
        
        // 라디오 버튼 및 추가 버튼 초기화
        const checkedRadio = plantPickList.querySelector('input[name="pick"]:checked');
        if (checkedRadio) checkedRadio.checked = false;
        confirmBtn.disabled = true;
        pickedPlantIdInput.value = '';
      }
    }
  });
  
  // esc로 모달 닫기
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalEl.classList.contains('is-open')) {
    	console.log('eesscc');
    }
  });
  
});