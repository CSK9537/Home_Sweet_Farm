package org.joonzis.myplant.controller;

import org.joonzis.myplant.dto.MyPlantStatisticsDTO;
import org.joonzis.myplant.service.SensorDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/arduino")
@RequiredArgsConstructor
public class ArduinoController {
	@Autowired
	private SensorDataService sensorDataService;


	 @PostMapping("/sensor-data")
	    public ResponseEntity<String> receiveSensorData(@RequestBody MyPlantStatisticsDTO stdto) {
		 	
		 	// DTO → VO 변환
	        MyPlantStatisticsDTO vo = new MyPlantStatisticsDTO();
	        vo.setMyplant_id(stdto.getMyplant_id());
	        vo.setTemperature(stdto.getTemperature());
	        vo.setHumidity(stdto.getHumidity());
	        vo.setIllumination(stdto.getIllumination());
	        vo.setSoil_moisture(stdto.getSoil_moisture());
	        vo.setSensing_time(stdto.getSensing_time()); // null 가능

	        // Service 호출 (시간 자동 처리 포함)
	        sensorDataService.register(vo);

	        return ResponseEntity.ok("SUCCESS");
	    }

	 @PostMapping("/iot/sensor")
	 public ResponseEntity<String> receive(@RequestBody MyPlantStatisticsDTO stdto){
		 sensorDataService.svae(stdto);
		 return ResponseEntity.ok("ok");
	 }
}
