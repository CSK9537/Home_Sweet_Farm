// 1. 토스트 메시지 기본 설정
const Toast = Swal.mixin({
	toast: true,
	position: 'bottom',					// 알림 위치 (bottom, top, top-end 등)
	width: 'fit-content',				// 가로 - 내용에 맞춤
	padding: '10px',					// 패딩 10px
	showClass: { popup: 'my-fade-in' },	// 등장 시 페이드인(css설정)
	hideClass: { popup: 'my-fade-out' }	// 숨김 시 페이드아웃(css설정)

});

//2. 토스트 함수
function showCustomToast(message, type, showBtn = false) {
    if (!message) return;

    let toastBackground = '#B85C5C';    // 기본 배경색
    let confirmBtnColor = '#E07A7A';    // 기본 확인 버튼색
    let cancelBtnColor = '#E07A7A';    // 기본 취소 버튼색
    let toastIcon = type || 'error';

    // 타입에 따라 배경색과 버튼색을 각각 지정
    switch(toastIcon) {
        case 'success': 
            toastBackground = '#526645'; 
            confirmBtnColor = '#8BA37A'; // 연한 그린
            cancelBtnColor = '#8BA37A'; // 연한 그린
            break;
        case 'error': 
            toastBackground = '#B85C5C'; 
            confirmBtnColor = '#E07A7A'; // 연한 레드
            cancelBtnColor = '#E07A7A'; // 연한 레드
            break; 
        case 'warning': 
            toastBackground = '#E5B55C'; 
            confirmBtnColor = '#FFD17A'; // 연한 옐로우
            cancelBtnColor = '#FFD17A'; // 연한 옐로우
            break; 
        case 'info': 
        default: 
            toastBackground = '#5C8CB8'; 
            confirmBtnColor = '#7FB1E3'; // 연한 블루
            cancelBtnColor = '#7FB1E3'; // 연한 블루
            toastIcon = 'info'; 
            break;
    }

    return Toast.fire({
        icon: toastIcon,
        title: message,
        background: toastBackground,
        color: '#FFFFFF',
        iconColor: '#FFFFFF',
        
        // --- 버튼 설정 ---
        showConfirmButton: showBtn,
        showCancelButton: showBtn,
        confirmButtonText: '네',
        cancelButtonText: '아니오',
        confirmButtonColor: confirmBtnColor, // 위에서 설정한 버튼 색상 적용
        cancelButtonColor: cancelBtnColor, // 위에서 설정한 버튼 색상 적용
        
        // 확인 버튼이 있으면 10초까지 유지, 없으면 2.5초 후 종료
        timer: showBtn ? 10000 : 2500,
		timerProgressBar: showBtn ? true : false,				// 타이머 진행바 표시
		didOpen: (toast) => {
			toast.addEventListener('mouseenter', Swal.stopTimer)	// 마우스오버시 타이머정지
			toast.addEventListener('mouseleave', Swal.resumeTimer)	// 마우스떠나면 타이머재시작
		}
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
			if (!type || type.trim() === "") type = 'error';
	
		// 토스트 함수 실행
		showCustomToast(msg, type);
		
		// 새로고침 시 토스트가 또 뜨는 걸 방지하기 위해 속성 제거.
		msgElement.setAttribute('data-msg', ''); 
		}
	}
});