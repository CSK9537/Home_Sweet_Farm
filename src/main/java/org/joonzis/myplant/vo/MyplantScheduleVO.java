package org.joonzis.myplant.vo;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class MyplantScheduleVO {
	// 나의 식물 식별번호
	private int myplant_id;
	// 일정 날짜
	private Date myplant_schedule_date;
	// 상세 일정(어떤 일정인지)
	// 'W' = watering = 물주기
	// 'N' = nutritional supplements = 영양제
	// 'R' = repotting = 분갈이
	private char myplant_schedule_do;
}
