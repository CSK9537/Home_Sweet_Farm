package org.joonzis.iot.service;

import org.joonzis.iot.dto.SensorDataDTO;
import org.joonzis.iot.vo.PlantStatisticsVO;

public interface SensorDataService {

	 void saveSensorData(SensorDataDTO request);
	    PlantStatisticsVO getLatestData(Long myplantId);
	 void svae(PlantStatisticsVO data);
	 void register(PlantStatisticsVO vo);
}
