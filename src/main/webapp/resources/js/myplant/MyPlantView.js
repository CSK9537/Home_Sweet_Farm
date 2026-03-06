document.addEventListener('DOMContentLoaded', () => {
	
	// 나의 식물 상태
	let plantGuide = null;
    const plant_name = document.querySelector('.plant-detail__latin').innerHTML;
    const UPDATE_INTERVAL = 5000; 
    const SENSOR_API_URL = 'http://192.168.0.130:8080/api/realtime';

    // --- [1. 매핑 헬퍼 함수] ---
    
    // 일조량 필요량에 따른 레벨 수치화
    function getLightRange(lightString) {
        if (!lightString) return null;

        let minLight = 100; // 최솟값을 찾기 위해 가장 큰 수로 초기화
        let maxLight = 0;   // 최댓값을 찾기 위해 가장 작은 수로 초기화
        let isMatched = false;

        // 1. 완전한 햇빛 (가장 밝은 환경)
        if (lightString.includes('완전한 햇빛')) {
            minLight = Math.min(minLight, 70);
            maxLight = Math.max(maxLight, 100);
            isMatched = true;
        }
        // 2. 부분 햇빛 (중간 밝기 환경)
        if (lightString.includes('부분 햇빛')) {
            minLight = Math.min(minLight, 40);
            maxLight = Math.max(maxLight, 70);
            isMatched = true;
        }
        // 3. 간접 햇빛 (직사광선이 닿지 않는 밝은 곳)
        if (lightString.includes('간접 햇빛')) {
            minLight = Math.min(minLight, 30);
            maxLight = Math.max(maxLight, 60);
            isMatched = true;
        }
        // 4. 충분한 그늘 (어두운 환경)
        if (lightString.includes('충분한 그늘')) {
            minLight = Math.min(minLight, 10);
            maxLight = Math.max(maxLight, 40);
            isMatched = true;
        }

        // 매칭된 키워드가 단 하나도 없다면 null 반환
        if (!isMatched) return null;

        return { min: minLight, max: maxLight };
    }    
    
    // 급수 주기에 따른 습도 레벨 수치화
    function getIdealHumidityRange(scheduleString) {
        let minHumid = 40; // 기본 최솟값 (일반 실내 기준)
        let maxHumid = 75; // 기본 최댓값

        if (!scheduleString) return { min: minHumid, max: maxHumid };

        if (scheduleString.includes('하루에 한 번')) {
            minHumid = 60; maxHumid = 90;
        } else if (scheduleString.includes('일주일에 두 번')) {
            minHumid = 55; maxHumid = 85;
        } else if (scheduleString.includes('매주')) {
            minHumid = 50; maxHumid = 80;
        } else if (scheduleString.includes('1-2주마다')) {
            minHumid = 40; maxHumid = 75;
        } else if (scheduleString.includes('2주마다')) {
            minHumid = 35; maxHumid = 70;
        } else if (scheduleString.includes('2-3주마다')) {
            minHumid = 30; maxHumid = 60;
        } else if (scheduleString.includes('3주마다')) {
            minHumid = 25; maxHumid = 50;
        } else if (scheduleString.includes('한 달에 한 번') || scheduleString.includes('한달에 한번')) {
            minHumid = 20; maxHumid = 40;
        }

        return { min: minHumid, max: maxHumid };
    }
    
    // 급수 주기에 따른 토양 수분 레벨 수치화
    function getFallbackMoistureLevel(scheduleString) {
        if (!scheduleString) return 30; // 기본값 (일반 관엽식물 기준)

        if (scheduleString.includes('하루에 한 번')) return 60; // 흙이 마를 틈 없이 항상 촉촉해야 함
        if (scheduleString.includes('일주일에 두 번')) return 50; // 겉흙이 살짝만 마르면 급수
        if (scheduleString.includes('매주')) return 40; // 겉흙이 확실히 마르면 급수
        if (scheduleString.includes('1-2주마다')) return 30; // 겉흙~중간흙이 마르면 급수 (표준)
        if (scheduleString.includes('2주마다')) return 25; // 속흙이 마르기 시작할 때 급수
        if (scheduleString.includes('2-3주마다')) return 20; // 속흙이 절반 이상 말랐을 때 급수
        if (scheduleString.includes('3주마다')) return 15; // 화분 전체 흙이 거의 다 말랐을 때 급수
        if (scheduleString.includes('한 달에 한 번')) return 10; // 흙이 완전히 바싹 마르고도 며칠 뒤 급수 (선인장/다육이)

        return 30; // 매칭 안 될 경우 안전한 기본값
    }
    
    // 급수 수준에 따른 토양 수분 레벨 수치화
    function getMoistureLevelFromString(levelString) {
        if (!levelString) return null;
        
        // 물을 좋아하는 식물 (흙이 살짝 마르면 바로 급수)
        if (levelString.includes('높은') || levelString.includes('다습')) return 45; 
        // 일반적인 실내 관엽식물 (겉흙이 마르면 급수)
        if (levelString.includes('중간') || levelString.includes('보통')) return 30; 
        // 건조에 강한 식물 (속흙까지 마르면 급수)
        if (levelString.includes('낮은') || levelString.includes('건조')) return 15; 
        
        return null; // 매칭되지 않으면 null 반환
    }
    
    // --- [2. 메인 상태 판별 함수] ---
    function evaluatePlantStatus(sensor, guide) {
        const status = { 
            temperature: '알 수 없음', 
            humidity: '알 수 없음',
            illumination: '알 수 없음', 
            soilMoisture: '알 수 없음' 
        };

        const lightPercent = Math.round(((1023 - sensor.illumination) / 1023) * 100);
        const soilPercent = Math.round(((1023 - sensor.soil_moisture) / 1023) * 100);
        const temp = sensor.temperature;
        const airHumid = sensor.humidity;

        // 1. 온도 판별
        if (guide.guide_temperature_imax === 0) {
            status.temperature = '판별 제외 (IMAX가 0임)';
        } else {
            if (temp < guide.guide_temperature_tmin) {
                status.temperature = '매우 낮음 (심한 저온)';
            } else if (temp >= guide.guide_temperature_tmin && temp < guide.guide_temperature_imin) {
                status.temperature = '다소 낮음 (서늘함)';
            } else if (temp >= guide.guide_temperature_imin && temp <= guide.guide_temperature_imax) {
                status.temperature = '적정 (최적 온도)';
            } else if (temp > guide.guide_temperature_imax && temp <= guide.guide_temperature_tmax) {
                status.temperature = '다소 높음 (더움)';
            } else {
                status.temperature = '매우 높음 (심한 고온)';
            }
        }

        // 2. 대기 습도 판별
        
        // 1) 헬퍼 함수를 통해 적정 대기 습도 범위 가져오기
        const humidRange = getIdealHumidityRange(guide.guide_watering_schedule);
        const minIdealHumid = humidRange.min;
        const maxIdealHumid = humidRange.max;

        // 2) 동적 기준에 따라 5단계 판별
        if (airHumid < minIdealHumid - 10) {
            status.humidity = '매우 낮음 (심한 건조)';
        } else if (airHumid >= minIdealHumid - 10 && airHumid < minIdealHumid) {
            status.humidity = '다소 낮음 (건조함)';
        } else if (airHumid >= minIdealHumid && airHumid <= maxIdealHumid) {
            status.humidity = '적정 (쾌적함)';
        } else if (airHumid > maxIdealHumid && airHumid <= maxIdealHumid + 10) {
            status.humidity = '다소 높음 (습함)';
        } else {
            status.humidity = '매우 높음 (심한 과습)';
        }

        // 3. 조도 판별
        const reqRange = getLightRange(guide.guide_sunlight_requirements);
        const tolRange = getLightRange(guide.guide_sunlight_tolerance);

        if (!reqRange) {
            status.illumination = '가이드 정보 없음';
        } else {
            // 허용 범위(Tolerance)와 요구 범위(Requirement)를 조합하여 절대 상/하한선 계산
            const minBound = tolRange ? Math.min(reqRange.min, tolRange.min) : reqRange.min;
            const maxBound = tolRange ? Math.max(reqRange.max, tolRange.max) : reqRange.max;

            if (lightPercent < minBound) {
                status.illumination = '매우 낮음 (심각한 일조량 부족)';
            } else if (lightPercent >= minBound && lightPercent < reqRange.min) {
                status.illumination = '다소 낮음 (일조량 부족)';
            } else if (lightPercent >= reqRange.min && lightPercent <= reqRange.max) {
                status.illumination = '적정 (쾌적함)';
            } else if (lightPercent > reqRange.max && lightPercent <= maxBound) {
                status.illumination = '다소 높음 (일조량 과다)';
            } else {
                status.illumination = '매우 높음 (심각한 일조량 과다)';
            }
        }

        // 4. 토양 수분 판별
        
        // 1) DB의 습도 레벨 텍스트를 먼저 숫자로 변환
        let waterLevel = getMoistureLevelFromString(guide.guide_watering_humiditylevel);
        
        // 2) 만약 null이거나 매칭 실패 시, 8단계 급수 주기(schedule)를 통해 기준값 가져오기
        if (waterLevel === null) {
            waterLevel = getFallbackMoistureLevel(guide.guide_watering_schedule);
        }
        
        // 3) 설정된 waterLevel(급수 하한선)을 바탕으로 5단계 평가 진행
        if (soilPercent < waterLevel) {
            status.soilMoisture = '매우 낮음 (즉시 급수)';
        } else if (soilPercent >= waterLevel && soilPercent < waterLevel + 15) {
            status.soilMoisture = '다소 낮음 (수분 적음)';
        } else if (soilPercent >= waterLevel + 15 && soilPercent <= waterLevel + 40) {
            status.soilMoisture = '적정 (수분 충분)';
        } else if (soilPercent > waterLevel + 40 && soilPercent <= waterLevel + 60) {
            status.soilMoisture = '다소 높음 (수분 많음)';
        } else {
            status.soilMoisture = '매우 높음 (과습 주의)';
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

    // --- [3. 가이드 데이터] ---
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
            
//            console.log("가이드 데이터 준비 완료:", plantGuide);

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
                if (luxEl && data.illumination !== undefined) luxEl.innerText = `${data.illumination}정도`;
                if (soilMoistEl && data.soil_moisture !== undefined) soilMoistEl.innerText = `${data.soil_moisture}정도`;

                comparePlantData(plantGuide, data, plantId);
            })
            .catch(error => console.error(error));
    }
    
    // --- [5. 데이터 비교 및 상태 처리 함수] ---
    function comparePlantData(guide, currentSensor, plantId) {
    	
    	// 1. 상태 판별 로직 실행
        const evaluation = evaluatePlantStatus(currentSensor, guide);
        const current = evaluation.currentValues;
        const status = evaluation.statusResult;
        
//        // 콘솔 출력
//        console.log("=== 실시간 식물 상태 평가 ===");
//        console.log(`온도: ${current.temperature} -> ${status.temperature}`);
//        console.log(`습도: ${current.humidity} -> ${status.humidity}`);
//        console.log(`조도: ${current.illumination} -> ${status.illumination}`);
//        console.log(`수분: ${current.soilMoisture} -> ${status.soilMoisture}`);

        // 2. DOM 요소 가져오기 (HTML 구조와 동일하게 매칭)
        const luxEl = document.getElementById(`realtimeLux_${plantId}`);
        const humiEl = document.getElementById(`realtimeHumi_${plantId}`);
        const tempEl = document.getElementById(`realtimeTemp_${plantId}`);
        const soilMoistEl = document.getElementById(`realtimeSoilMoist_${plantId}`);

        // 3. UI 업데이트 실행
        updateStatusUI(luxEl, current.illumination, status.illumination);
        updateStatusUI(humiEl, current.humidity, status.humidity);
        updateStatusUI(tempEl, current.temperature, status.temperature);
        updateStatusUI(soilMoistEl, current.soilMoisture, status.soilMoisture);
    }

    // --- [UI 전용 헬퍼 함수] ---
    // 값, 상태 텍스트, 그리고 색상 클래스를 자동으로 입혀주는 함수
    function updateStatusUI(valueElement, newValue, newStatusText) {
        if (!valueElement) return;

        // 1. 센서 환산값 업데이트 (예: 100%RH, 25°C 등)
        valueElement.innerText = newValue;

        // 2. 상태 텍스트 업데이트 (다음 형제 요소인 status__text 선택)
        const textElement = valueElement.nextElementSibling;
        if (textElement && textElement.classList.contains('status__text')) {
            textElement.innerText = newStatusText;
        }

        // 3. 기존 색상 클래스 초기화
        valueElement.classList.remove('status__value--good', 'status__value--warn', 'status__value--bad');
        
        // 4. 상태 텍스트에 포함된 단어에 따라 알맞은 색상 클래스 부여
        if (newStatusText.includes('적정')) {
            valueElement.classList.add('status__value--good');  // 파랑/초록색 (정상)
        } else if (newStatusText.includes('다소')) {
            valueElement.classList.add('status__value--warn');  // 노란색/주황색 (주의)
        } else if (newStatusText.includes('매우') || newStatusText.includes('제외') || newStatusText.includes('없음')) {
            valueElement.classList.add('status__value--bad');   // 빨간색 (위험/오류)
        }
    }
    
    
    // 다가오는 가장 가까운 일정 가져오기
    var nextScheduleEl = document.getElementById("nextScheduleText");
    if (nextScheduleEl) {
      var myplant_id = nextScheduleEl.getAttribute("data-plant-id");
      updateNextSchedule(myplant_id);
    }
    
    function updateNextSchedule(myplant_id) {
      var ctx = window.ctx || "";
      var nextScheduleEl = document.getElementById("nextScheduleText");
      if (!nextScheduleEl) return;

      fetch(ctx + "/myplant/schedule/" + myplant_id)
        .then(function(res) {
          if (!res.ok) throw new Error("네트워크 응답 에러");
          return res.json();
        })
        .then(function(data) {
          // 1. 오늘 날짜 구하기 (YYYY-MM-DD)
          var today = new Date();
          var todayYmd = today.getFullYear() + "-" + 
                         String(today.getMonth() + 1).padStart(2, '0') + "-" + 
                         String(today.getDate()).padStart(2, '0');

          // 2. 오늘 포함하여 이후의 일정만 필터링
          var futureEvents = data.filter(function(e) {
            return String(e.date) >= todayYmd;
          });

          // 3. 다가오는 일정이 없으면 기본 문구 출력
          if (futureEvents.length === 0) {
            nextScheduleEl.textContent = "등록된 일정이 없어요";
            return;
          }

          // 4. 날짜순으로 오름차순 정렬 (가장 가까운 날짜가 0번 인덱스에 오도록)
          futureEvents.sort(function(a, b) {
            if (a.date < b.date) return -1;
            if (a.date > b.date) return 1;
            return 0;
          });

          // 5. 가장 가까운 날짜(nextDate)를 찾고, 해당 날짜와 동일한 모든 일정 추출 (중복 일정 표시용)
          var nextDate = futureEvents[0].date;
          var sameDateEvents = futureEvents.filter(function(e) {
            return e.date === nextDate;
          });

          // 6. 이모지와 타이틀 텍스트 조합 (예: 💧 물주기, 🧪 영양제)
          var TYPE_EMOJI = { water: "💧", nutri: "🧪", repot: "🪴" };
          var titles = sameDateEvents.map(function(e) {
            var emoji = TYPE_EMOJI[e.type] || "🗓️";
            return emoji + " " + e.title;
          }).join(", ");

          // 7. 화면에 출력
          nextScheduleEl.textContent = "다가오는 일정 : " + titles + " (" + nextDate + ")";
        })
        .catch(function(err) {
          console.error("다가오는 일정 갱신 실패:", err);
        });
    }
    
    // 스케쥴 변동 감지
    window.addEventListener("scheduleUpdated", function(e) {
    	if (e.detail && e.detail.myplant_id) {
    		updateNextSchedule(e.detail.myplant_id);
    	}
    });
});

// 이름 영역 변경
function toggleNicknameEdit(isEditMode) {
  const displayWrap = document.getElementById('nicknameDisplayWrap');
  const editWrap = document.getElementById('nicknameEditWrap');
  const inputEl = document.getElementById('nicknameInput');
  const textEl = document.getElementById('nicknameText');

  if (isEditMode) {
    // 편집 모드 켜기
    displayWrap.style.display = 'none';
    editWrap.style.display = 'flex';
    // 입력창에 현재 닉네임 세팅
    inputEl.value = textEl.innerText;
    inputEl.focus();
  } else {
    // 편집 모드 끄기 (취소)
    displayWrap.style.display = 'flex';
    editWrap.style.display = 'none';
  }
}

// 이름 검증
document.getElementById('nicknameInput').addEventListener('input', function() {
  // 한글, 영문, 숫자만 허용하며 1~10자 이내인지 검사 (공백 포함 여부는 선택)
  const isValid = /^[가-힣a-zA-Z0-9]{1,10}$/.test(this.value);
  const confirmNameBtn = document.getElementById('confirmNameBtn');
  
  if(isValid) {
	confirmNameBtn.disabled = false;
    this.style.borderColor = "var(--brand)"; // 올바른 입력일 때 원래 테두리 색상
  } else {
	confirmNameBtn.disabled = true;
    if(this.value.length > 0) {
      this.style.borderColor = "red"; // 특수문자 등 잘못된 입력 시 붉은색 테두리 경고
    } else {
      this.style.borderColor = "var(--brand)"; // 다 지웠을 때는 기본 색상
    }
  }
});


// 이름 저장(서버 전송) 함수
function saveNickname(myplantId) {
  const inputEl = document.getElementById('nicknameInput');
  const newNickname = inputEl.value.trim();

  if (!newNickname) {
	showCustomToast('식물 이름을 입력해주세요.', 'warning');
    inputEl.focus();
    return;
  }

  // 서버에 닉네임 수정 API 요청 (경로는 실제 서버 환경에 맞게 수정하세요)
  fetch(`/myplant/updateName`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 필요 시 CSRF 토큰 추가
    },
    body: JSON.stringify({
      myplant_id: myplantId,
      myplant_name: newNickname
    })
  })
  .then(response => {
    if (response.ok) {
      // 화면 텍스트 업데이트
      document.getElementById('nicknameText').innerText = newNickname;
      // 편집 모드 종료
      toggleNicknameEdit(false);
    } else {
      showCustomToast('이름 수정에 실패했습니다. 다시 시도해주세요.', 'error');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showCustomToast('서버 통신 중 오류가 발생했습니다.', 'error');
  });
}
