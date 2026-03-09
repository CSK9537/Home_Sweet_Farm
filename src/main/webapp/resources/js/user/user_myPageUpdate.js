document.addEventListener('DOMContentLoaded', function() {
  // 1. 입력 요소 가져오기
  const nameInput = document.querySelector('input[name="name"]');
  const nicknameInput = document.getElementById('nicknameInput');
  const phoneInput = document.getElementById('inpPhone');
  const form = document.getElementById('accountForm');

  // 2. 정규표현식 (검증 규칙)
  // 이름: 한글, 영문 대소문자 2~10자
  const regexName = /^[가-힣a-zA-Z]{2,10}$/; 
  // 닉네임: 한글, 영문, 숫자 2~10자 (특수문자 제외)
  const regexNickname = /^[가-힣a-zA-Z0-9]{2,10}$/; 
  // 휴대전화: 010으로 시작하며 중간에 하이픈(-) 유무 허용, 총 10~11자리 숫자
  const regexPhone = /^010-?\d{3,4}-?\d{4}$/; 

  // 3. 실시간 검증 함수
  function validateRealTime(inputElement, regex) {
    const value = inputElement.value.trim();
    
    // 값이 비어있을 때는 에러 표시를 지울지, 에러로 낼지 결정 (여기선 비어있으면 원상복구)
    if (value === "") {
      inputElement.classList.remove('input-invalid');
      return false;
    }

    // 정규식 테스트
    if (!regex.test(value)) {
      inputElement.classList.add('input-invalid'); // 조건 불일치: 빨간 테두리
      return false;
    } else {
      inputElement.classList.remove('input-invalid'); // 조건 일치: 테두리 원상복구
      return true;
    }
  }

  // 4. input 이벤트 리스너 등록 (타이핑 할 때마다 실행됨)
  if(nameInput) {
    nameInput.addEventListener('input', () => validateRealTime(nameInput, regexName));
  }
  if(nicknameInput) {
    nicknameInput.addEventListener('input', () => validateRealTime(nicknameInput, regexNickname));
  }
  if(phoneInput) {
    phoneInput.addEventListener('input', () => validateRealTime(phoneInput, regexPhone));
  }

  // 5. 이메일 인증
  document.addEventListener("emailVerifiedSuccess", function (e) {

    const userEmailInput = document.getElementById('inpEmail');
    if (userEmailInput) {
      userEmailInput.value = e.detail.email; // 이메일 자동 입력
    }
    const verifyBtn = document.getElementById('sendCode-btn');
    verifyBtn.disabled = true;

  });
  
  // 6. 폼 전송(Submit) 시 최종 검증
  form.addEventListener('submit', function(e) {
	e.preventDefault(); 
    const isNameValid = validateRealTime(nameInput, regexName);
    const isNicknameValid = validateRealTime(nicknameInput, regexNickname);
    const isPhoneValid = validateRealTime(phoneInput, regexPhone);

    // 하나라도 검증을 통과하지 못하면 폼 제출 막기
    if (!isNameValid || !isNicknameValid || !isPhoneValid) {
      showCustomToast("적절치 못한 항목이 존재합니다.", "warning");
      return;
    }
    
    const url = this.getAttribute('action');
    const formData = new FormData(this); // 폼 데이터 자동 수집

    // fetch를 이용한 비동기 통신
    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        // response.ok가 아닐 때 상태 코드(status)를 에러 메시지에 포함시킵니다.
        if (!response.ok) {
            throw new Error(`서버 응답 에러: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
        	showCustomToast("회원정보가 성공적으로 수정되었습니다.", "success");
            // 필요하다면 페이지 새로고침 또는 특정 UI 업데이트
        	window.location.reload();
        } else {
        	showCustomToast("수정에 실패했습니다", "error");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showCustomToast("오류가 발생했습니다.", "error");
    });
  });
  
});