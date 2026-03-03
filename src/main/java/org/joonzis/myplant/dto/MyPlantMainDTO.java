package org.joonzis.myplant.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class MyPlantMainDTO {
	private int myplant_id;
	private String myplant_name;
	private Date myplant_regdate;
	private long day_passed;
	private int plant_id;
	private String plant_name;
	private String plant_name_kor;
	private String plant_image;
}
