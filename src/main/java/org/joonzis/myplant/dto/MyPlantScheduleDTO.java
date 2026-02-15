package org.joonzis.myplant.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class MyPlantScheduleDTO {
	private int schedule_id;
	private int myplant_id;
	private Date myplant_schedule_date;
	private String myplant_schedule_do;
}
