package org.joonzis.iot.service;

import java.time.LocalDateTime;
import java.util.Date;

import javax.inject.Inject;

import org.joonzis.iot.domain.PlantStatistics;
import org.joonzis.iot.dto.SensorDataDTO;
import org.joonzis.iot.repository.PlantStatisticsMapper;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class SensorDataServiceImpl implements SensorDataService {
	
	@Inject
    private final PlantStatisticsMapper mapper;

    @Override
    public void saveSensorData(SensorDataDTO request) {

        // IoT 기본 검증
        if (request.getTemperature() < -20 || request.getTemperature() > 80) {
            return;
        }

        PlantStatistics vo = new PlantStatistics();
        vo.setMyplantId(request.getMyplantId());
        vo.setTemperature(request.getTemperature());
        vo.setHumidity(request.getHumidity());
        vo.setIllumination(request.getIllumination());
        vo.setSoilMoisture(request.getSoilMoisture());
        vo.setSensingTime(new Date());;

        mapper.insert(vo);
    }

    @Override
    public PlantStatistics getLatestData(Long myplantId) {
        return mapper.findLatestByMyplantId(myplantId);
    }

	@Override
	public void svae(PlantStatistics data) {
		mapper.insert(data);
	}

	@Override
	public void register(PlantStatistics vo) {
		
		// 센싱 데이터 시간 자동 처리 유지
		if(vo.getSensingTime() == null) {
			vo.setSensingTime(new Date());
		}
		mapper.insert(vo);
	}
    
   
}

