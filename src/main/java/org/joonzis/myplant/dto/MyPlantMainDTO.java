package org.joonzis.myplant.dto;

import lombok.Data;

@Data
public class MyPlantMainDTO {
	 // tbl_myplant
    private int myplantId;
    private String myplantName;
    private java.util.Date myplantRegdate;

    // tbl_plant
    private int plantId;
    private String englishName;
    private String koreanName;
    private String imageUrl;
}
