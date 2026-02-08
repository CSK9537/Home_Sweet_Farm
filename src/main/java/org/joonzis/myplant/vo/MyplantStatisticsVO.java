package org.joonzis.myplant.vo;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class MyplantStatisticsVO {
	// 나의 식물 식별번호
	private int myplant_id;
	// 온도 센싱 데이터
	private double temperature;
	// 습도 센싱 데이터
	private double humidity;
	// 조도 센싱 데이터
	private double illumination;
	// 토양수분 센싱 데이터
	private double soil_moisture;
	// 센싱 시간
	private Date sensing_time;
}
