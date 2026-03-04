package org.joonzis.myplant.service;

import org.joonzis.myplant.dto.StatsResponseDTO;

public interface MyPlantStatisticsService {
	public StatsResponseDTO getPlantStatistics(int myplant_id, String range);
}
