package org.joonzis.myplant.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class MyPlantDTO {
	private int myplant_id;
	private int user_id;
	private int plant_id;
	private String myplant_name;
	private Date myplant_regdate;
}
