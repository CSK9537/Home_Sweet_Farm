package org.joonzis.myplant.controller;

import java.sql.Date;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.joonzis.myplant.dto.MyPlantScheduleDTO;
import org.joonzis.myplant.service.MyPlantScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/myplant/schedule")
public class MyPlantScheduleController {
	
	@Autowired
	private MyPlantScheduleService scservice;

	// 1. 특정 식물의 전체 일정 조회 (모달 오픈 시)
	@GetMapping(value = "/{myplant_id}", produces = "application/json; charset=UTF-8")
	public ResponseEntity<List<Map<String, Object>>> getSchedules(@PathVariable("myplant_id") int myplant_id) {
		List<MyPlantScheduleDTO> list = scservice.getListByMyPlant(myplant_id);
		List<Map<String, Object>> result = new ArrayList<>();

		for (MyPlantScheduleDTO dto : list) {
			Map<String, Object> map = new HashMap<>();
			map.put("id", dto.getSchedule_id());             // JS의 id
			map.put("myplant_id", dto.getMyplant_id());         // JS의 myplant_id
			map.put("date", dto.getMyplant_schedule_date().toString()); // JS의 date
			map.put("type", dto.getMyplant_schedule_do());   // JS의 type (water, nutri, repot)

			// type에 맞춰 JS에서 사용할 title 매핑
			String title = "일정";
			if ("water".equals(dto.getMyplant_schedule_do())) title = "물주기";
			else if ("nutri".equals(dto.getMyplant_schedule_do())) title = "영양제";
			else if ("repot".equals(dto.getMyplant_schedule_do())) title = "분갈이";
			map.put("title", title);

			result.add(map);
		}
		
		return ResponseEntity.ok(result);
	}

	// 2. 일정 추가 (드래그/클릭 시)
	@PostMapping(produces = "application/json; charset=UTF-8")
	public ResponseEntity<Map<String, Object>> addSchedule(@RequestBody Map<String, Object> payload) {
		
		// JS에서 보낸 JSON 데이터를 DTO에 세팅
		MyPlantScheduleDTO dto = new MyPlantScheduleDTO();
		dto.setMyplant_id(Integer.parseInt(payload.get("myplant_id").toString()));
		dto.setMyplant_schedule_date(Date.valueOf(payload.get("date").toString()));
		dto.setMyplant_schedule_do(payload.get("type").toString());

		// DB Insert 실행 (성공 후 dto에 새로 생성된 schedule_id가 들어와야 함)
		scservice.register(dto);

		// 프론트엔드에서 바로 그릴 수 있도록 포맷을 맞춰서 응답
		Map<String, Object> response = new HashMap<>();
		response.put("id", dto.getSchedule_id()); // DB에서 생성된 진짜 PK
		response.put("myplant_id", dto.getMyplant_id());
		response.put("date", dto.getMyplant_schedule_date().toString());
		response.put("type", dto.getMyplant_schedule_do());
		response.put("title", payload.get("title"));

		return ResponseEntity.ok(response);
	}

	// 3. 단건 일정 삭제 (삭제 버튼 클릭 시)
	@DeleteMapping(value = "/{id}", produces = "text/plain; charset=UTF-8")
	public ResponseEntity<String> deleteSchedule(@PathVariable("id") int id) {
		scservice.remove(id);
		return ResponseEntity.ok("success");
	}
}
