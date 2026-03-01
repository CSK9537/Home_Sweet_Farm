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
  const openModal = () => {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
    searchInput.focus();
  };
  modalbtn.addEventListener('click', openModal);

  const closeModal = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = ''; // 스크롤 복원
    
    // 상태 초기화
    searchInput.value = '';
    plantPickList.innerHTML = ''; // 모달 닫을 때 검색 결과도 초기화
    plantItems.forEach(item => item.style.display = '');
    
    // 라디오 버튼 및 추가 버튼 초기화
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
  let debounceTimeout; // 디바운싱을 위한 타이머 변수

  searchInput.addEventListener('input', (e) => {
    const keyword = e.target.value.trim();

    // 검색어가 비어있으면 목록을 비우고 요청 취소
    if (!keyword) {
      plantPickList.innerHTML = '';
      return;
    }

    // 디바운싱: 타이핑 후 200ms 대기 후 서버 요청
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      fetch('/search/plant?q=' + encodeURIComponent(keyword))
        .then(res => {
          if (!res.ok) throw new Error("검색 응답 오류");
          return res.json();
        })
        .then(data => {
          // 배열을 하나의 HTML 문자열로 만들어 한 번에 DOM에 삽입 (성능 대폭 향상)
          const htmlString = data.map(p => `
            <li class="mpm-item">
              <label class="mpm-item__row">
                <input class="mpm-item__radio" type="radio" name="pick"
                  value="${p.plant_id}" />
                <span class="mpm-item__text">
                  <span class="mpm-item__korean">${p.plant_name_kor}</span>
                  <span class="mpm-item__latin">${p.plant_name}</span>
                </span>
              </label>
            </li>
          `).join('');

          plantPickList.innerHTML = htmlString;
        })
        .catch(err => console.error(err));
    }, 200);
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

  // --- 5. 나의 식물 추가 버튼  ---
  confirmBtn.addEventListener('click', () => {
    const plantId = pickedPlantIdInput.value;
    const myPlantNameInput = document.getElementById('myPlantName');
    // myPlantName 요소가 존재하는지 확인하여 에러 방지
    const myPlantName = myPlantNameInput ? myPlantNameInput.value : '';

    fetch('/my-plants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        plantId: plantId,
        myPlantName: myPlantName
      })
    })
    .then(res => {
      if (!res.ok) throw new Error("서버 오류");
      closeModal();
      location.reload();
    })
    .catch(err => console.error(err));
  });

}); // <-- DOMContentLoaded 닫는 괄호가 여기 위치해야 합니다!