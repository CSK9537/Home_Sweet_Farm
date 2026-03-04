package org.joonzis.myplant.controller;

import org.joonzis.myplant.dto.StatsResponseDTO;
import org.joonzis.myplant.service.MyPlantStatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MyPlantStatisticsController {

	@Autowired
	private MyPlantStatisticsService statisticsService;
	
	@GetMapping("/myplant/statistics")
	public ResponseEntity<StatsResponseDTO> getStatistics(
							@RequestParam("myplant_id") int myplant_id,
							@RequestParam("range") String range) {
	
	StatsResponseDTO response = statisticsService.getPlantStatistics(myplant_id, range);
	
	return ResponseEntity.ok(response);
	}
}
