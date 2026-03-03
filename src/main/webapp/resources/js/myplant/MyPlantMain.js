document.addEventListener('DOMContentLoaded', () => {
	// ---------------실시간 센서 데이터 받아오기---------------
	// 5초(5000ms)마다 데이터 갱신
    const UPDATE_INTERVAL = 5000; 
    
    // 센서 데이터 API 주소
    const SENSOR_API_URL = 'http://192.168.0.130:8080/api/realtime';

    function fetchRealtimePlantData() {
        // 1. 센서 데이터 요청
        fetch(SENSOR_API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('데이터를 불러오는 데 실패했습니다.');
            }
            return response.json();
        })
        .then(data => {
            /* 받아온 데이터  */
            const currentTemp = data.temperature;
            const currentHumi = data.humidity;
            const currentLux = data.illumination;
            const currentSoil = data.soil_moisture;
            
            const plantItems = document.querySelectorAll('.plant-item[data-plant-id]');
            
            // 3. 각 식물 카드의 상태 업데이트
            plantItems.forEach(item => {
                const plantId = item.getAttribute('data-plant-id');
                
                const tempEl = document.getElementById(`realtimeTemp_${plantId}`);
                const humiEl = document.getElementById(`realtimeHumi_${plantId}`);
                const luxEl = document.getElementById(`realtimeLux_${plantId}`);
                const soilMoistEl = document.getElementById(`realtimeSoilMoist_${plantId}`);

                // 요소가 존재하고, 데이터가 정상적으로 들어왔을 때만 텍스트 변경
                if (tempEl && currentTemp !== undefined) tempEl.innerText = `${currentTemp}℃`;
                if (humiEl && currentHumi !== undefined) humiEl.innerText = `${currentHumi}%RH`;
                if (luxEl && currentLux !== undefined) luxEl.innerText = `${currentLux}`;
                if (soilMoistEl && currentSoil !== undefined) soilMoistEl.innerText = `${currentSoil}`;
            });
        })
        .catch(error => {
            console.error("실시간 센서 데이터 조회 오류:", error);
        });
    }

    // 페이지 로드 시 즉시 1회 실행
    fetchRealtimePlantData();

    // 이후 5초마다 반복 실행
    setInterval(fetchRealtimePlantData, UPDATE_INTERVAL);
    // ---------------실시간 센서 데이터 받아오기---------------
    
    // 삭제
    const plantListContainer = document.querySelector('.myplants-list');
    
    if (plantListContainer) {
        plantListContainer.addEventListener('click', (e) => {
            // 클릭된 요소가 '삭제' 버튼인지 확인
            if (e.target.classList.contains('removeMyPlant')) {
                
                // 최상위 식물 아이템(li)과 ID 가져오기
                const plantItem = e.target.closest('.plant-item');
                const plantId = plantItem.dataset.plantId;

                // 알림 띄우기
                showCustomToast("정말 삭제하시겠습니까?", "warning", true)
                    .then((result) => {
                    	// 확인 누르면 삭제 진행
                        if (result.isConfirmed) deleteMyPlant(plantId, plantItem);
                    });
            }
        });
    }
	
});

function deleteMyPlant(plantId, plantItemElement) {
    fetch(`/myplant/remove/${plantId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // 서버 삭제 성공 시: 화면에서 해당 식물 요소 즉시 제거
            plantItemElement.remove();
            showCustomToast("성공적으로 삭제되었습니다.", "success");
            
            // 모든 식물이 삭제되었다면 '빈 상태' 화면으로 전환
            checkEmptyState(); 
        } else {
            showCustomToast("삭제에 실패했습니다. 다시 시도해 주세요.", "error");
        }
    })
    .catch(error => {
        console.error("삭제 요청 중 오류 발생:", error);
        showCustomToast("서버 통신 중 문제가 발생했습니다.", "error");
    });
}

// 리스트가 비었는지 확인하는 헬퍼 함수
function checkEmptyState() {
    const remainingPlants = document.querySelectorAll('.plant-item');
    if (remainingPlants.length === 0) {
        // JSP의 <c:when test="${not empty sessionScope.loginUser and empty myPlants}"> 
        // 화면을 렌더링하게 하거나, 자바스크립트로 직접 DOM을 조작해 빈 화면을 띄울 수 있습니다.
        location.reload(); 
    }
}