// 1. 토스트 메시지 기본 설정
const Toast = Swal.mixin({
	toast: true,
	position: 'bottom',					// 알림 위치 (bottom, top, top-end 등)
	width: 'fit-content',				// 가로 - 내용에 맞춤
	padding: '10px',					// 패딩 10px
	showConfirmButton: false,			// 확인 버튼 숨김
	timer: 2500,						// 2.5초 후 사라짐
	showClass: { popup: 'my-fade-in' },	// 등장 시 페이드인(css설정)
	hideClass: { popup: 'my-fade-out' }	// 숨김 시 페이드아웃(css설정)
//	timerProgressBar: true,				// 타이머 진행바 표시
//	didOpen: (toast) => {
//		toast.addEventListener('mouseenter', Swal.stopTimer)	// 마우스오버시 타이머정지
//		toast.addEventListener('mouseleave', Swal.resumeTimer)	// 마우스떠나면 타이머재시작
//	}
});

//2. 토스트 함수
function showCustomToast(message, type) {
    if (!message) return;

    let toastBackground = '#333333';	// 기본 배경색(회색)
    let toastIcon = type || 'info';		// 기본 아이콘타입

    switch(toastIcon) {
        case 'success': toastBackground = '#526645'; break; // 성공 비빋드 다크 그린
        case 'error': toastBackground = '#B85C5C'; break;   // 에러 테라코타 레드 
        case 'warning': toastBackground = '#E5B55C'; break; // 경고 머스타드 옐로우 
        case 'info': default: toastBackground = '#5C8CB8'; toastIcon = 'info'; break; // 정보 블루
    }

    Toast.fire({
        icon: toastIcon,
        title: message,
        background: toastBackground,
        color: '#FFFFFF',
        iconColor: '#FFFFFF'
    });
}

// 3. 페이지가 로드될 때 서버(Model) 값이 있는지 확인 (Controller 연동용)
window.addEventListener('DOMContentLoaded', function() {
	const msgElement = document.getElementById('serverMsg');
	const typeElement = document.getElementById('serverMsgType');
	
	// 요소가 정상적으로 존재하는지 먼저 확인
	if (msgElement) {
		const msg = msgElement.getAttribute('data-msg');
		
		// msg 값이 존재하고, 공백이 아닐 때만 실행
		if (msg && msg.trim() !== "") {
			// msgType 값 설정, 만약 비어있다면 기본값인 'error'
			let type = typeElement ? typeElement.getAttribute('data-msgType') : 'error';
			if (!type || type.trim() === "") {
			type = 'error';
		}
	
		// 토스트 함수 실행
		showCustomToast(msg, type);
		
		// 새로고침 시 토스트가 또 뜨는 걸 방지하기 위해 속성 제거.
		msgElement.setAttribute('data-msg', ''); 
		}
	}
});