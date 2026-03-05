package org.joonzis.myplant.mapper;

import java.time.LocalDateTime;
import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.joonzis.myplant.dto.MyPlantStatisticsDTO;

public interface MyPlantStatisticsMapper{
	List<MyPlantStatisticsDTO> findSensorDataByMyplantId(@Param("myplant_id") int myplant_id);
}
