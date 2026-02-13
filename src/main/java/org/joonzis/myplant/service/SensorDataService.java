package org.joonzis.myplant.service;

import org.joonzis.myplant.dto.SensorDataDTO;
import org.joonzis.myplant.vo.PlantStatisticsVO;

public interface SensorDataService {

	 void saveSensorData(SensorDataDTO request);
	    PlantStatisticsVO getLatestData(Long myplantId);
	 void svae(PlantStatisticsVO data);
	 void register(PlantStatisticsVO vo);
}
