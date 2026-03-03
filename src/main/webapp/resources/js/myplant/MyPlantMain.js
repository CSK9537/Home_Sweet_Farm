document.addEventListener('DOMContentLoaded', () => {
	
	// 삭제 진행(일단 메시지 띄우기까지만)
	document.querySelectorAll('.removeMyPlant').forEach((btn) => {
		btn.addEventListener('click', () => {
			// 알림창 띄우기 (확인, 취소 버튼 모두 true라고 가정)
			showCustomToast("정말 삭제하시겠습니까?", "warning", true)
				.then((result) => {
					if (result.isConfirmed) {
						console.log("삭제를 진행합니다.");
					} else if (result.isDismissed) {
						console.log("삭제가 취소되었습니다.");
					}
				});
		});
	});
	
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

            // 2. 화면에 렌더링된 모든 식물 리스트 가져오기
            const plantItems = document.querySelectorAll('.plant-item[data-plant-id]');
            
            // 3. 각 식물 카드의 상태 업데이트
            plantItems.forEach(item => {
                const plantId = item.getAttribute('data-plant-id');
                
                const tempEl = document.getElementById(`realtimeTemp_${plantId}`);
                const humiEl = document.getElementById(`realtimeHumi_${plantId}`);
                const luxEl = document.getElementById(`realtimeLux_${plantId}`);
                const soilMoistEl = document.getElementById(`realtimeSoilMoist_${plantId}`);

                // 요소가 존재하고, 데이터가 정상적으로 들어왔을 때만 텍스트 변경
                if (tempEl && currentTemp !== undefined) {
                    tempEl.innerText = `${currentTemp}℃`;
                }
                if (humiEl && currentHumi !== undefined) {
                    humiEl.innerText = `${currentHumi}%RH`;
                }
                if (luxEl && currentLux !== undefined) {
                	luxEl.innerText = `${currentLux}`;
                }
                if (soilMoistEl && currentSoil !== undefined) {
                	soilMoistEl.innerText = `${currentSoil}`;
                }
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
	
}); // <-- DOMContentLoaded 닫는 괄호가 여기 위치해야 합니다!