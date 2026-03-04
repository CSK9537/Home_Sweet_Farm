document.addEventListener('DOMContentLoaded', () => {
    // 1. 페이지 내의 모든 식물 아이템 가져오기
    const plantItems = document.querySelectorAll('.plant-item');
    const plantGuides = {}; // 각 식물별 가이드 데이터를 저장할 객체 (키: plantId)
    
    const UPDATE_INTERVAL = 5000; 
    const SENSOR_API_URL = 'http://192.168.0.130:8080/api/realtime';

    // --- [1. 매핑 헬퍼 함수들 (상세페이지와 동일)] ---
    function getLightRange(lightString) {
        if (!lightString) return null;
        let minLight = 100, maxLight = 0, isMatched = false;
        if (lightString.includes('완전한 햇빛')) { minLight = Math.min(minLight, 70); maxLight = Math.max(maxLight, 100); isMatched = true; }
        if (lightString.includes('부분 햇빛')) { minLight = Math.min(minLight, 40); maxLight = Math.max(maxLight, 70); isMatched = true; }
        if (lightString.includes('간접 햇빛')) { minLight = Math.min(minLight, 30); maxLight = Math.max(maxLight, 60); isMatched = true; }
        if (lightString.includes('충분한 그늘')) { minLight = Math.min(minLight, 10); maxLight = Math.max(maxLight, 40); isMatched = true; }
        if (!isMatched) return null;
        return { min: minLight, max: maxLight };
    } 

    function getIdealHumidityRange(scheduleString) {
        let minHumid = 40, maxHumid = 75;
        if (!scheduleString) return { min: minHumid, max: maxHumid };
        if (scheduleString.includes('하루에 한 번')) { minHumid = 60; maxHumid = 90; }
        else if (scheduleString.includes('일주일에 두 번')) { minHumid = 55; maxHumid = 85; }
        else if (scheduleString.includes('매주')) { minHumid = 50; maxHumid = 80; }
        else if (scheduleString.includes('1-2주마다')) { minHumid = 40; maxHumid = 75; }
        else if (scheduleString.includes('2주마다')) { minHumid = 35; maxHumid = 70; }
        else if (scheduleString.includes('2-3주마다')) { minHumid = 30; maxHumid = 60; }
        else if (scheduleString.includes('3주마다')) { minHumid = 25; maxHumid = 50; }
        else if (scheduleString.includes('한 달에 한 번') || scheduleString.includes('한달에 한번')) { minHumid = 20; maxHumid = 40; }
        return { min: minHumid, max: maxHumid };
    }

    function getFallbackMoistureLevel(scheduleString) {
        if (!scheduleString) return 30;
        if (scheduleString.includes('하루에 한 번')) return 60;
        if (scheduleString.includes('일주일에 두 번')) return 50;
        if (scheduleString.includes('매주')) return 40;
        if (scheduleString.includes('1-2주마다')) return 30;
        if (scheduleString.includes('2주마다')) return 25;
        if (scheduleString.includes('2-3주마다')) return 20;
        if (scheduleString.includes('3주마다')) return 15;
        if (scheduleString.includes('한 달에 한 번')) return 10;
        return 30;
    }

    function getMoistureLevelFromString(levelString) {
        if (!levelString) return null;
        if (levelString.includes('높은') || levelString.includes('다습')) return 45; 
        if (levelString.includes('중간') || levelString.includes('보통')) return 30; 
        if (levelString.includes('낮은') || levelString.includes('건조')) return 15; 
        return null;
    }

    // --- [2. 메인 상태 판별 함수] ---
    function evaluatePlantStatus(sensor, guide) {
        const status = { temperature: '', humidity: '', illumination: '', soilMoisture: '' };
        const lightPercent = Math.round(((1023 - sensor.illumination) / 1023) * 100);
        const soilPercent = Math.round(((1023 - sensor.soil_moisture) / 1023) * 100);
        const temp = sensor.temperature;
        const airHumid = sensor.humidity;

        // 온도
        if (guide.guide_temperature_imax === 0) status.temperature = '판별 제외';
        else if (temp < guide.guide_temperature_tmin) status.temperature = '매우 낮음';
        else if (temp >= guide.guide_temperature_tmin && temp < guide.guide_temperature_imin) status.temperature = '다소 낮음';
        else if (temp >= guide.guide_temperature_imin && temp <= guide.guide_temperature_imax) status.temperature = '적정';
        else if (temp > guide.guide_temperature_imax && temp <= guide.guide_temperature_tmax) status.temperature = '다소 높음';
        else status.temperature = '매우 높음';

        // 습도
        const hRange = getIdealHumidityRange(guide.guide_watering_schedule);
        if (airHumid < hRange.min - 10) status.humidity = '매우 낮음';
        else if (airHumid >= hRange.min - 10 && airHumid < hRange.min) status.humidity = '다소 낮음';
        else if (airHumid >= hRange.min && airHumid <= hRange.max) status.humidity = '적정';
        else if (airHumid > hRange.max && airHumid <= hRange.max + 10) status.humidity = '다소 높음';
        else status.humidity = '매우 높음';

        // 조도
        const reqRange = getLightRange(guide.guide_sunlight_requirements);
        const tolRange = getLightRange(guide.guide_sunlight_tolerance);
        if (!reqRange) {
            status.illumination = '가이드 정보 없음';
        } else {
            const minBound = tolRange ? Math.min(reqRange.min, tolRange.min) : reqRange.min;
            const maxBound = tolRange ? Math.max(reqRange.max, tolRange.max) : reqRange.max;
            if (lightPercent < minBound) status.illumination = '매우 낮음';
            else if (lightPercent >= minBound && lightPercent < reqRange.min) status.illumination = '다소 낮음';
            else if (lightPercent >= reqRange.min && lightPercent <= reqRange.max) status.illumination = '적정';
            else if (lightPercent > reqRange.max && lightPercent <= maxBound) status.illumination = '다소 높음';
            else status.illumination = '매우 높음';
        }

        // 수분
        let wLevel = getMoistureLevelFromString(guide.guide_watering_humiditylevel) || getFallbackMoistureLevel(guide.guide_watering_schedule);
        if (soilPercent < wLevel) status.soilMoisture = '매우 낮음';
        else if (soilPercent >= wLevel && soilPercent < wLevel + 15) status.soilMoisture = '다소 낮음';
        else if (soilPercent >= wLevel + 15 && soilPercent <= wLevel + 40) status.soilMoisture = '적정';
        else if (soilPercent > wLevel + 40 && soilPercent <= wLevel + 60) status.soilMoisture = '다소 높음';
        else status.soilMoisture = '매우 높음';

        return { 
            currentValues: { temperature: temp + '℃', humidity: airHumid + '%RH', illumination: lightPercent + '%', soilMoisture: soilPercent + '%' }, 
            statusResult: status 
        };
    }

    // --- [3. 메인 로직: 초기화 및 반복 실행] ---
    
    // 식물이 없으면 실행 종료
    if (plantItems.length === 0) return;

    // 각 식물의 가이드를 병렬로 가져오기 위해 Promise 배열 생성
    const guidePromises = Array.from(plantItems).map(item => {
        const plantId = item.getAttribute('data-plant-id');
        const plantName = item.querySelector('.plant-item__latin').innerText.trim();
        
        return fetch(`/myplant/guide/${plantName}`, { headers: { 'Accept': 'application/json' } })
            .then(res => {
                if (!res.ok) throw new Error(`${plantName} 가이드 조회 실패`);
                return res.json();
            })
            .then(data => {
                plantGuides[plantId] = data; // 가져온 가이드를 객체에 저장
            })
            .catch(err => console.error(err));
    });

    // 모든 가이드 로딩이 끝나면 센서 데이터 수집 시작
    Promise.all(guidePromises).then(() => {
//        console.log("모든 식물의 가이드 데이터 준비 완료");
        fetchRealtimeForAll(); 
        setInterval(fetchRealtimeForAll, UPDATE_INTERVAL);
    });

    // --- [4. 센서 데이터 Fetch 및 일괄 업데이트] ---
    function fetchRealtimeForAll() {
        fetch(SENSOR_API_URL)
            .then(res => res.json())
            .then(sensorData => {
                // 화면에 있는 모든 식물을 순회하며 평가 진행
                plantItems.forEach(item => {
                    const plantId = item.getAttribute('data-plant-id');
                    const guide = plantGuides[plantId];
                    
                    if (guide) {
                        applyStatusToMainUI(guide, sensorData, plantId);
                    }
                });
            })
            .catch(err => console.error("센서 데이터 조회 오류:", err));
    }

 // --- [5. UI 업데이트 전용 함수 (메인 페이지용)] ---
    function applyStatusToMainUI(guide, currentSensor, plantId) {
        // 평가 결과 가져오기
        const evaluation = evaluatePlantStatus(currentSensor, guide);
        const status = evaluation.statusResult;

        // 메인 페이지의 DOM 요소 선택
        const luxEl = document.getElementById(`realtimeLux_${plantId}`);
        const humiEl = document.getElementById(`realtimeHumi_${plantId}`);
        const tempEl = document.getElementById(`realtimeTemp_${plantId}`);
        const soilMoistEl = document.getElementById(`realtimeSoilMoist_${plantId}`);

        // 수치 대신 상태 텍스트(status)만 넘겨서 업데이트 진행
        updateMainUIElement(luxEl, status.illumination);
        updateMainUIElement(humiEl, status.humidity);
        updateMainUIElement(tempEl, status.temperature);
        updateMainUIElement(soilMoistEl, status.soilMoisture);
    }

    // 화면에 글자와 색상을 그려주는 함수
    function updateMainUIElement(element, statusText) {
        if (!element) return;

        // 1. 수치(예: 25℃) 대신 상태 메시지(예: '적정', '다소 낮음')를 바로 삽입
        element.innerText = statusText;

        // 2. 기존 상태 색상 클래스 초기화
        element.classList.remove('status__value--good', 'status__value--warn', 'status__value--bad');

        // 3. 상태 텍스트 내용에 맞춰 알맞은 배경/글자색 클래스 부여
        if (statusText === '적정') {
            element.classList.add('status__value--good'); // 파랑/초록색 (정상)
        } else if (statusText.includes('다소')) {
            element.classList.add('status__value--warn'); // 주황/노란색 (주의)
        } else {
            element.classList.add('status__value--bad');  // 빨간색 (경고/위험)
        }
    }
    
 // 식물 삭제 로직
    const plantListContainer = document.querySelector('.myplants-list');

    if (plantListContainer) {
        plantListContainer.addEventListener('click', (e) => {
            // 클릭된 요소가 '삭제' 버튼인지 확인
            if (e.target.classList.contains('removeMyPlant')) {
                
                // 최상위 식물 아이템(li)과 ID 가져오기
                const plantItem = e.target.closest('.plant-item');
                if (!plantItem) return; // 요소가 없으면 중단

                const plantId = plantItem.dataset.plantId;

                // 커스텀 알림창 띄우기
                showCustomToast("정말 삭제하시겠습니까?", "warning", true)
                    .then((result) => {
                        // 사용자가 확인을 누르면 삭제 진행
                        if (result && result.isConfirmed) {
                            deleteMyPlant(plantId, plantItem);
                        }
                    });
            }
        });
    }

    function deleteMyPlant(plantId, plantItemElement) {
        fetch(`/myplant/remove/${plantId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // 필요 시 여기에 CSRF 토큰 등을 추가하세요
            }
        })
        .then(response => {
            if (response.ok) {
                // 서버 삭제 성공 시: 화면에서 해당 식물 요소 즉시 제거
                plantItemElement.remove();
                showCustomToast("성공적으로 삭제되었습니다.", "success");
                
                // 모든 식물이 삭제되었다면 '빈 상태' 화면으로 전환 (새로고침)
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

    function checkEmptyState() {
        const remainingPlants = document.querySelectorAll('.plant-item');
        if (remainingPlants.length === 0) {
            // 요소가 하나도 없으면 페이지를 새로고침하여 JSP의 빈 화면(c:if 등)을 렌더링
            location.reload(); 
        }
    }
});