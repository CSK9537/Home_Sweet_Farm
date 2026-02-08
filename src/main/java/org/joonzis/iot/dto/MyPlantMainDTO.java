package org.joonzis.iot.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MyPlantMainDTO {
	private int myplantId;
    private String myplantName;

    private int plantId;
    private String plantName;

    private double temperature;
    private double humidity;
    private double illumination;
    private double soilMoisture;

    private Date sensingTime;
}
