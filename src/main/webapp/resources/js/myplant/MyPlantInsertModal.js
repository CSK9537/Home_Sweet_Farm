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
  const confirmBtn = document.getElementById('confirmAddPlant');
  
  //디바운싱을 위한 타이머 변수
  let debounceTimeout;
  
  // 모달 열기/닫기 공통 로직
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
		  closeModal();
	  }
  });
  
  // 모달 닫기 함수
  function closeModal() {
    if (!modalEl) return;
    
    modalEl.classList.remove("is-open");
    modalEl.setAttribute("aria-hidden", "true");
    
    // 1. 검색어 비우기
    searchInput.value = '';
    
    // 2. 검색 결과 목록 완전히 텅 비우기
    plantPickList.innerHTML = ''; 
    
    // 3. 선택된 식물 ID 및 추가 버튼 비활성화
    pickedPlantIdInput.value = '';
    confirmBtn.disabled = true;

    // 4. (중요) 검색어를 치자마자 모달을 닫았을 때, 뒤늦게 검색 결과가 뜨는 것 방지
    // 이전 검색 로직에서 선언한 debounceTimeout 변수가 접근 가능해야 합니다.
    if (typeof debounceTimeout !== 'undefined') {
      clearTimeout(debounceTimeout);
    }
  }
  
  // esc로 모달 닫기
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalEl.classList.contains('is-open')) {
    	closeModal();
    }
  });
  
  // 실시간 검색 기능
  searchInput.addEventListener('input', (e) => {
	clearTimeout(debounceTimeout);
	const keyword = e.target.value.trim();

    // 검색어가 비어있으면 목록을 비우고 요청 취소
    if (!keyword) {
      plantPickList.innerHTML = '';
      return;
    }

    // 디바운싱: 타이핑 후 200ms 대기 후 서버 요청
    debounceTimeout = setTimeout(() => {
      fetch('/search/plantsimple?q=' + encodeURIComponent(keyword))
        .then(res => {
          if (!res.ok) throw new Error("검색 응답 오류");
          return res.json();
        })
        .then(data => {
          // 배열을 하나의 HTML 문자열로 만들어 한 번에 DOM에 삽입
        	const htmlString = data.map(p => {
        		  // 1. 이미지가 없으면 기본 이미지 경로를, 있으면 전달받은 이미지 경로를 설정합니다.
        		  const contextPath = getCpath(); // 이전 코드에 있던 함수 활용
        		  const defaultImage = contextPath + "/resources/image/Default_Plant.jpg";
        		  const imageApiUrl = contextPath + "/plant/image/" + encodeURIComponent(p.plant_image);
        		  const imageSrc = p.plant_image ? imageApiUrl : defaultImage;

        		  // 2. HTML 문자열을 반환합니다.
        		  return `
        		    <li class="mpm-item">
        		      <label class="mpm-item__row">
        		        <input class="mpm-item__radio" type="radio" name="pick" value="${p.plant_id}" />
        		        
        		        <span class="mpm-item__thumb">
        		          <img src="${imageSrc}" alt="${p.plant_name_kor}" />
        		        </span>
        		        
        		        <span class="mpm-item__text">
        		          <span class="mpm-item__korean">${p.plant_name_kor}</span>
        		          <span class="mpm-item__latin">${p.plant_name}</span>
        		        </span>
        		      </label>
        		    </li>
        		  `;
        		}).join('');
          plantPickList.innerHTML = htmlString;
        })
        .catch(err => console.error(err));
    }, 200);
  });
  
  const step1 = document.getElementById('mpmStep1');
  const step2 = document.getElementById('mpmStep2');
  
  const btnNextStep = document.getElementById('btnNextStep');
  const btnPrevStep = document.getElementById('btnPrevStep');
  const confirmAddPlant = document.getElementById('confirmAddPlant');
  
  const radioButtons = document.querySelectorAll('.mpm-item__radio');
  const nicknameInput = document.getElementById('plantNicknameInput');

  // [Step 1] 라디오 버튼 선택 시 '다음' 버튼 활성화
  document.getElementById('plantPickList').addEventListener('change', function(e) {
    if (e.target.classList.contains('mpm-item__radio')) {
      btnNextStep.disabled = false;
      document.getElementById('pickedPlantId').value = e.target.value;
    }
  });

  // [Step 1 -> Step 2] 다음 버튼 클릭 시
  btnNextStep.addEventListener('click', function() {
    const checkedRadio = document.querySelector('.mpm-item__radio:checked');
    if(!checkedRadio) return;

    const row = checkedRadio.closest('.mpm-item__row');
    const name = row.querySelector('.mpm-item__korean').textContent;
    const latin = row.querySelector('.mpm-item__latin').textContent;
    const imgSrc = row.querySelector('.mpm-item__thumb img').src;

    // 미리보기 영역에 찾은 데이터 채워넣기
    document.getElementById('previewName').textContent = name;
    document.getElementById('previewLatin').textContent = latin;
    
    // 이미지는 태그 자체를 생성해서 넣어줍니다.
    const previewThumb = document.getElementById('previewThumb');
    previewThumb.innerHTML = ''; // 기존 이미지 초기화
    const imgElement = document.createElement('img');
    imgElement.src = imgSrc;
    imgElement.alt = name;
    imgElement.style.width = '100%';
    imgElement.style.height = '100%';
    imgElement.style.objectFit = 'cover';
    previewThumb.appendChild(imgElement);

    // 화면 전환 및 닉네임 입력창 포커스
    step1.style.display = 'none';
    step2.style.display = 'block';
    nicknameInput.focus();
  });

  // [Step 2 -> Step 1] 이전 버튼 클릭 시
  btnPrevStep.addEventListener('click', function() {
    step2.style.display = 'none';
    step1.style.display = 'block';
  });

  //[Step 2] 닉네임 검증 및 '추가 완료' 버튼 제어
  nicknameInput.addEventListener('input', function() {
    // 한글, 영문, 숫자만 허용하며 1~10자 이내인지 검사 (공백 포함 여부는 선택)
    const isValid = /^[가-힣a-zA-Z0-9]{1,10}$/.test(this.value);

    if(isValid) {
      confirmAddPlant.disabled = false;
      this.style.borderColor = "var(--brand)"; // 올바른 입력일 때 원래 테두리 색상
    } else {
      confirmAddPlant.disabled = true;
      if(this.value.length > 0) {
        this.style.borderColor = "red"; // 특수문자 등 잘못된 입력 시 붉은색 테두리 경고
      } else {
        this.style.borderColor = "var(--brand)"; // 다 지웠을 때는 기본 색상
      }
    }
  });
  
  //[추가 완료] 버튼 클릭 시 서버로 데이터 전송
  confirmAddPlant.addEventListener('click', function(e) {
    e.preventDefault(); 

    const plantId = document.getElementById('pickedPlantId').value;
    const nickname = document.getElementById('plantNicknameInput').value.trim();

    // 데이터를 담아 전송할 가상의 Form 생성
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/myplant/register'; // 💡 백엔드 컨트롤러 주소에 맞게 수정

    // 1. plant_id 담기
    const inputPlantId = document.createElement('input');
    inputPlantId.type = 'hidden';
    inputPlantId.name = 'plant_id';
    inputPlantId.value = plantId;
    form.appendChild(inputPlantId);

    // 2. 식물 이름 담기
    const inputNickname = document.createElement('input');
    inputNickname.type = 'hidden';
    inputNickname.name = 'plant_nickname'; 
    inputNickname.value = nickname;
    form.appendChild(inputNickname);

    // 3. 폼 제출
    document.body.appendChild(form);
    form.submit();
  });
  
});