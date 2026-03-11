document.addEventListener("DOMContentLoaded", function() {
    const imgElement = document.querySelector('.hero-slide__img');

    // 데이터가 없거나 이미지가 없으면 실행 안 함
    if (!imgElement || !window.plantImages || window.plantImages.length === 0) return;

    // 초기 디폴트 이미지 경로를 백업해 둡니다.
    const defaultImageSrc = imgElement.src;

    // 슬라이드 타이머 변수와 에러 상태 플래그를 상단에 선언
    let slideInterval;
    let isErrorOccurred = false;

    // 이미지를 가져오는 데 실패했을 때 실행되는 이벤트
    imgElement.onerror = function() {
        isErrorOccurred = true;           // 에러 상태 기록
        imgElement.src = defaultImageSrc; // 디폴트 이미지로 경로 복구
        imgElement.style.opacity = 1;     // 이미지가 보이도록 투명도 복구
        clearInterval(slideInterval);     // 실행 중인 슬라이드 타이머 완전 중지
    };

    // 1. 페이지 로드 직후 즉시 첫 번째 랜덤 이미지 띄우기 (대기 시간 없이)
    const firstIndex = Math.floor(Math.random() * window.plantImages.length);
    imgElement.src = "/plant/image/" + window.plantImages[firstIndex];
    imgElement.style.opacity = 1; // 처음엔 선명하게 보이도록 설정

    // 2. 부드럽게 랜덤 이미지를 변경하는 함수
    function changeRandomImage() {
        if (isErrorOccurred) return; // 에러가 난 상태면 함수 실행 중단

        // 이미지를 투명하게 만듭니다 (CSS transition 작동)
        imgElement.style.opacity = 0;

        // 0.5초(500ms) 뒤에 이미지 교체
        setTimeout(() => {
            if (isErrorOccurred) return; // 대기 시간 중 에러 처리 방어

            const randomIndex = Math.floor(Math.random() * window.plantImages.length);
            const selectedImage = window.plantImages[randomIndex];

            // 이미지 주소 변경 (에러 발생 시 위 onerror 발동)
            imgElement.src = "/plant/image/" + selectedImage;

            // 새 이미지가 로드 완료되면 다시 나타나게 함
            imgElement.onload = () => {
                if (!isErrorOccurred) {
                    imgElement.style.opacity = 1;
                }
            };
        }, 500);
    }

    // 3. 5초(5000ms)마다 함수 실행 설정
    slideInterval = setInterval(changeRandomImage, 5000);
    
    // 4. 마우스를 올렸을 때는 슬라이드를 멈추는 로직
    const slideContainer = document.querySelector('.hero-slide');
    if (slideContainer) {
        slideContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
        slideContainer.addEventListener('mouseleave', () => {
            // 🚨 에러가 발생하지 않았을 때만 슬라이드 재시작
            if (!isErrorOccurred) {
                slideInterval = setInterval(changeRandomImage, 5000);
            }
        });
    }
});

function handleUserClick(element) {
    const id = element.getAttribute('data-user-id');
    GlobalProfileModal.open(id);
}