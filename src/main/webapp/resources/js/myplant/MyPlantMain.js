document.addEventListener('DOMContentLoaded', () => {
  // --- 요소 선택 ---
  const modalbtn = document.getElementById('openAddPlantModal');
  const modal = document.getElementById('addPlantModal');
  const searchInput = document.getElementById('plantSearchInput');
  const plantPickList = document.getElementById('plantPickList');
  const plantItems = document.querySelectorAll('.mpm-item');
  const confirmBtn = document.getElementById('confirmAddPlant');
  const pickedPlantIdInput = document.getElementById('pickedPlantId');
  const closeElements = document.querySelectorAll('[data-modal-close]');

  // --- 1. 모달 제어 기능 ---

  /** 모달 열기 */
  const openModal = () => {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
    searchInput.focus();
  };
  modalbtn.addEventListener('click', openModal);

  /** 모달 닫기 및 초기화 */
  const closeModal = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = ''; // 스크롤 복원
    
    // 상태 초기화
    searchInput.value = '';
    plantItems.forEach(item => item.style.display = '');
    
    // 라디오 버튼 및 추가 버튼 초기화 (선택사항)
    const checkedRadio = plantPickList.querySelector('input[name="pick"]:checked');
    if (checkedRadio) checkedRadio.checked = false;
    confirmBtn.disabled = true;
    pickedPlantIdInput.value = '';
  };

  // 닫기 버튼 및 백드롭 클릭 이벤트
  closeElements.forEach(el => {
    el.addEventListener('click', closeModal);
  });

  // --- 2. 실시간 검색 기능 ---

  searchInput.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase().trim();

    plantItems.forEach(item => {
      const koreanName = item.querySelector('.mpm-item__korean').textContent.toLowerCase();
      const latinName = item.querySelector('.mpm-item__latin').textContent.toLowerCase();

      if (koreanName.includes(keyword) || latinName.includes(keyword)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });

  // --- 3. 식물 선택 및 추가 버튼 활성화 ---

  plantPickList.addEventListener('change', (e) => {
    if (e.target.classList.contains('mpm-item__radio')) {
      const selectedId = e.target.value;
      
      // Hidden input에 ID 저장
      pickedPlantIdInput.value = selectedId;
      
      // '추가' 버튼 활성화
      confirmBtn.disabled = false;
    }
  });

  // --- 4. ESC 키로 모달 닫기 ---
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
});