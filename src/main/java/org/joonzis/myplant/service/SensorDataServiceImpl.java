package org.joonzis.myplant.service;

import java.util.Date;

import javax.inject.Inject;

import org.joonzis.myplant.dto.MyPlantStatisticsDTO;
import org.joonzis.myplant.mapper.MyPlantStatisticsMapper;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SensorDataServiceImpl implements SensorDataService {
	
	@Inject
    private final MyPlantStatisticsMapper mapper;

    @Override
    public void saveSensorData(MyPlantStatisticsDTO request) {

        // IoT 기본 검증
        if (request.getTemperature() < -20 || request.getTemperature() > 80) {
            return;
        }

        MyPlantStatisticsDTO stdto = new MyPlantStatisticsDTO();
        stdto.setMyplant_id(request.getMyplant_id());
        stdto.setTemperature(request.getTemperature());
        stdto.setHumidity(request.getHumidity());
        stdto.setIllumination(request.getIllumination());
        stdto.setSoil_moisture(request.getSoil_moisture());
        stdto.setSensing_time(new Date());;

        mapper.insert(stdto);
    }

    @Override
    public MyPlantStatisticsDTO getLatestData(int myplant_id) {
        return mapper.findLatestByMyplantId(myplant_id);
    }

	@Override
	public void svae(MyPlantStatisticsDTO stdto) {
		mapper.insert(stdto);
	}

	@Override
	public void register(MyPlantStatisticsDTO stdto) {
		
		// 센싱 데이터 시간 자동 처리 유지
		if(stdto.getSensing_time() == null) {
			stdto.setSensing_time(new Date());
		}
		mapper.insert(stdto);
	}
    
   
}

