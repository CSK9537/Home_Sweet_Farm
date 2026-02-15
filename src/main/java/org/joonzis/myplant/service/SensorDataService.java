package org.joonzis.myplant.service;

import org.joonzis.myplant.dto.MyPlantStatisticsDTO;

public interface SensorDataService {
	public void saveSensorData(MyPlantStatisticsDTO stdto);
	public MyPlantStatisticsDTO getLatestData(int myplant_id);
	public void save(MyPlantStatisticsDTO stdto);
	public void register(MyPlantStatisticsDTO stdto);
}
