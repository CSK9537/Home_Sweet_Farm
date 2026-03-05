package org.joonzis.plant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class PlantGuideDTO {
	private int plantId;
	private String plantName;
	private String imageUrl;

	private String humidityLevel;
	private String sunlightTolerance;
	private int tempMin;
	private int tempMax;
}
