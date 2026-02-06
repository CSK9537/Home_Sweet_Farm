package org.joonzis.iot.controller;

import org.joonzis.iot.domain.PlantStatistics;
import org.joonzis.iot.dto.SensorDataDTO;
import org.joonzis.iot.service.SensorDataService;
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
	    public ResponseEntity<String> receiveSensorData(@RequestBody SensorDataDTO dto) {
		 	
		 	// DTO → VO 변환
	        PlantStatistics vo = new PlantStatistics();
	        vo.setMyplantId(dto.getMyplantId());
	        vo.setTemperature(dto.getTemperature());
	        vo.setHumidity(dto.getHumidity());
	        vo.setIllumination(dto.getIllumination());
	        vo.setSoilMoisture(dto.getSoilMoisture());
	        vo.setSensingTime(dto.getSensingTime()); // null 가능

	        // Service 호출 (시간 자동 처리 포함)
	        sensorDataService.register(vo);

	        return ResponseEntity.ok("SUCCESS");
	    }

	 @PostMapping("/iot/sensor")
	 public ResponseEntity<String> receive(@RequestBody PlantStatistics data){
		 sensorDataService.svae(data);
		 return ResponseEntity.ok("ok");
	 }
}
