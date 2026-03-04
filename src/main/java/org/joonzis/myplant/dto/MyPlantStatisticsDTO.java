package org.joonzis.myplant.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class MyPlantStatisticsDTO {
	private int myplant_id;
	private Integer temperature;
	private Integer humidity;
	private Integer illumination;
	private Integer soil_moisture;
	private Date sensing_time;
}
