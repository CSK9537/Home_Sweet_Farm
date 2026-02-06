package org.joonzis.iot.domain;



import java.util.Date;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlantStatistics {
    private Long myplantId;
    private Double temperature;
    private Double humidity;
    private int illumination;
    private int soilMoisture;
    private Date sensingTime;
	
}
