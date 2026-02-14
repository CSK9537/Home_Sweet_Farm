package org.joonzis.plant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class GuideDTO {
	// 식물 식별번호
	private int plant_id;
	// 관리 팁
	private String guide_caretip;
	// 강도(인성)
	private String guide_toughness;
	// 관리 수준
	private String guide_carelevel;
	// 관리 난이도
	private String guide_caredifficulty;
	// 수명
	private String guide_lifespan;
	// 급수 일정(주기)
	private String guide_watering_schedule;
	// 햇빛 요건
	private String guide_sunlight_requirements;
	// 토양 종류
	private String guide_soil_type;
	// 토양 ph
	private String guide_soil_ph;
	// 심는 시기
	private String guide_planting_time;
	// 내한성 구역
	private String guide_hardinesszone;
	// 독성
	private String guide_toxicity;
	// 급수 습도 수준
	private String guide_watering_humiditylevel;
	// 급수 내용
	private String guide_watering_content;
	// 일조량 허용 오차
	private String guide_sunlight_tolerance;
	// 일조량 내용
	private String guide_sunlight_content;
	// 이상적 최저 온도
	private int guide_temperature_imin;
	// 이상적 최고 온도
	private int guide_temperature_imax;
	// 허용 오차 최저 온도
	private int guide_temperature_tmin;
	// 허용 오차 최고 온도
	private int guide_temperature_tmax;
	// 온도 내용
	private String guide_temperature_content;
	// 토양 구성
	private String guide_soil_composition;
	// 토양 내용
	private String guide_soil_content;
	// 비료 내용
	private String guide_fertilizing_content;
	// 가지치기 시기
	private String guide_pruning_time;
	// 가지치기 장점
	private String guide_pruning_benefits;
	// 가지치기 내용
	private String guide_pruning_content;
	// 번식 시기
	private String guide_propagation_time;
	// 번식 유형
	private String guide_propagation_type;
	// 번식 내용
	private String guide_propagation_content;
	// 옮겨심기 시기
	private String guide_transplanting_time;
	// 옮겨심기 내용
	private String guide_transplanting_content;
	// 심기 내용
	private String guide_planting_content;
	// 분갈이 일정
	private String guide_repotting_schedule;
	// 분갈이 내용
	private String guide_repotting_content;
	// 수확 시기
	private String guide_harvest_time;
	// 수확 내용
	private String guide_harvest_content;
}
