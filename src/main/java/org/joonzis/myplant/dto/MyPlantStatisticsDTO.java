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
	private double temperature;
	private double humidity;
	private double illumination;
	private double soil_moisture;
	private Date sensing_time;
}
