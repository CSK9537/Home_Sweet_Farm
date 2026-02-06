package org.joonzis.iot.dto;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SensorDataDTO {
	private Long myplantId;
    private Double temperature;
    private Double humidity;
    private Integer illumination;
    private Integer soilMoisture;
    
    // 선택(보내면 사용, 안 보내면 서버에서 처리)
    private Date sensingTime;
    
}
