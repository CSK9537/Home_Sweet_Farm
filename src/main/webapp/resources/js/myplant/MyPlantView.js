document.addEventListener('DOMContentLoaded', () => {
    let plantGuide = null;
    const plant_name = document.querySelector('.plant-detail__latin').innerHTML;
    const UPDATE_INTERVAL = 5000; 
    const SENSOR_API_URL = 'http://192.168.0.130:8080/api/realtime';

    // --- [1. 매핑 헬퍼 함수] ---
    function getLightRange(lightString) {
        if (!lightString) return null;
        switch(lightString) {
            case '완전한 햇빛': return { min: 70, max: 100 };
            case '부분 햇빛': return { min: 40, max: 70 };
            case '충분한 그늘': return { min: 10, max: 40 };
            default: return null;
        }
    }

    function getFallbackMoistureLevel(scheduleString) {
        switch(scheduleString) {
            case '매주': return 40;
            case '1-2주마다': 
            case '2주마다': return 20;
            case '2-3주마다': return 10;
            default: return 20;
        }
    }

    // --- [2. 메인 상태 판별 함수] ---
    function evaluatePlantStatus(sensor, guide) {
        const status = { 
            temperature: '알 수 없음', 
            humidity: '알 수 없음',
            illumination: '알 수 없음', 
            soilMoisture: '알 수 없음' 
        };

        const lightPercent = Math.round((sensor.illumination / 1023) * 100);
        const soilPercent = Math.round(((1023 - sensor.soil_moisture) / 1023) * 100);
        const temp = sensor.temperature;
        const airHumid = sensor.humidity;

        // 온도 판별 (모두 소문자로 변경)
        if (guide.guide_temperature_imax === 0) {
            status.temperature = '판별 제외 (IMAX가 0임)';
        } else {
            if (temp >= guide.guide_temperature_imin && temp <= guide.guide_temperature_imax) {
                status.temperature = '좋음';
            } else if (
                (temp >= guide.guide_temperature_tmin && temp < guide.guide_temperature_imin) ||
                (temp > guide.guide_temperature_imax && temp <= guide.guide_temperature_tmax)
            ) {
                status.temperature = '보통 (허용 범위 내)';
            } else {
                status.temperature = '나쁨 (경고: 온도 이탈)';
            }
        }

        // 대기 습도 판별
        if (airHumid >= 40 && airHumid <= 70) {
            status.humidity = '좋음 (쾌적함)';
        } else if ((airHumid >= 30 && airHumid < 40) || (airHumid > 70 && airHumid <= 80)) {
            status.humidity = '보통 (약간 건조/습함)';
        } else {
            status.humidity = '나쁨 (경고: 너무 건조하거나 과습함)';
        }

        // 조도 판별
        const reqRange = getLightRange(guide.guide_sunlight_requirements);
        const tolRange = getLightRange(guide.guide_sunlight_tolerance);

        if (!reqRange) {
            status.illumination = '가이드 정보 없음';
        } else if (lightPercent >= reqRange.min && lightPercent <= reqRange.max) {
            status.illumination = '좋음';
        } else if (tolRange && lightPercent >= Math.min(reqRange.min, tolRange.min) && lightPercent <= Math.max(reqRange.max, tolRange.max)) {
            status.illumination = '보통 (허용 오차 내)';
        } else {
            status.illumination = '나쁨 (경고: 일조량 부적합)';
        }

        // 토양 수분 판별
        const waterLevel = guide.guide_watering_humiditylevel !== null 
                           ? guide.guide_watering_humiditylevel 
                           : getFallbackMoistureLevel(guide.guide_watering_schedule);
        
        if (soilPercent >= waterLevel + 15) {
            status.soilMoisture = '좋음 (수분 충분)';
        } else if (soilPercent >= waterLevel && soilPercent < waterLevel + 15) {
            status.soilMoisture = '보통 (급수 시기 다가옴)';
        } else {
            status.soilMoisture = '나쁨 (급수 필요)';
        }

        return { 
            currentValues: { 
                temperature: temp + '°C', 
                humidity: airHumid + '%', 
                illumination: lightPercent + '%', 
                soilMoisture: soilPercent + '%' 
            }, 
            statusResult: status 
        };
    }

    // --- [3. 가이드 데이터 Fetch (1회 실행)] ---
    fetch(`/myplant/guide/${plant_name}`,{
    	method : 'GET',
    	headers : {
    		'Accept': 'application/json'
    	}
    	})
        .then(response => {
            if (!response.ok) throw new Error('가이드 조회 실패');
            return response.json();
        })
        .then(data => {
            // 스프링에서 Map을 직접 반환했다면 data 객체 자체가 Map의 내용이 됩니다.
            // 혹시 응답 객체가 {"result": {...}} 처럼 한 번 더 감싸져 있다면 data.result 로 바꿔주세요.
            plantGuide = data; 
            
            console.log("가이드 데이터 준비 완료:", plantGuide);

            // 가이드 로드 완료 후 센서 데이터 수집 시작
            fetchRealtimePlantData(); 
            setInterval(fetchRealtimePlantData, UPDATE_INTERVAL);
        })
        .catch(error => console.error(error));

    // --- [4. 센서 데이터 Fetch (반복 실행)] ---
    function fetchRealtimePlantData() {
        fetch(SENSOR_API_URL)
            .then(response => {
                if (!response.ok) throw new Error('센서 데이터 조회 실패');
                return response.json();
            })
            .then(data => {
                const plantIdEl = document.querySelector('.status-grid');
                if (!plantIdEl) return;
                
                const plantId = plantIdEl.getAttribute('data-plant-id');
                const tempEl = document.getElementById(`realtimeTemp_${plantId}`);
                const humiEl = document.getElementById(`realtimeHumi_${plantId}`);
                const luxEl = document.getElementById(`realtimeLux_${plantId}`);
                const soilMoistEl = document.getElementById(`realtimeSoilMoist_${plantId}`);

                if (tempEl && data.temperature !== undefined) tempEl.innerText = `${data.temperature}℃`;
                if (humiEl && data.humidity !== undefined) humiEl.innerText = `${data.humidity}%RH`;
                if (luxEl && data.illumination !== undefined) luxEl.innerText = `${data.illumination}Lux`;
                if (soilMoistEl && data.soil_moisture !== undefined) soilMoistEl.innerText = `${data.soil_moisture}V`;

                comparePlantData(plantGuide, data);
            })
            .catch(error => console.error(error));
    }

    // --- [5. 데이터 비교 및 상태 처리 함수] ---
    function comparePlantData(guide, currentSensor) {
        const evaluation = evaluatePlantStatus(currentSensor, guide);
        
        console.log("===5초 단위 식물 상태 평가 ===");
        console.log("현재 센서 환산값:", evaluation.currentValues);
        console.log("상태 판별 결과:", evaluation.statusResult);
    }
});