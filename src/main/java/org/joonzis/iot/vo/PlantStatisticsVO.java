package org.joonzis.iot.vo;



import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class PlantStatisticsVO {
    private Long myplantId;
    private double temperature;
    private double humidity;
    private double illumination;
    private double soilMoisture;
    private Date sensingTime;
	
}
