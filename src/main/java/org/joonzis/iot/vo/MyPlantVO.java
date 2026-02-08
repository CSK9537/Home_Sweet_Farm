package org.joonzis.iot.vo;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MyPlantVO {
	private int myplantId;
    private int userId;
    private int plantId;

    private String myplantName;
    private Date myplantRegdate;
    
    // 최신 센서 데이터 (없을 수도 있음)
    private double temperature;
    private double humidity;
    private double illumination;
    private double soilMoisture;
    private Date sensingTime;
}
