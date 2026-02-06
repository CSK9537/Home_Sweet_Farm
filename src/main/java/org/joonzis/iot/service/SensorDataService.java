package org.joonzis.iot.service;

import org.joonzis.iot.domain.PlantStatistics;
import org.joonzis.iot.dto.SensorDataDTO;

public interface SensorDataService {

	 void saveSensorData(SensorDataDTO request);
	    PlantStatistics getLatestData(Long myplantId);
	 void svae(PlantStatistics data);
	 void register(PlantStatistics vo);
}
