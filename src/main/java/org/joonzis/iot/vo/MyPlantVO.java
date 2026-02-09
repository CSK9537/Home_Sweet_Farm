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
}
