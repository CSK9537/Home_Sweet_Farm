package org.joonzis.myplant.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.joonzis.myplant.dto.MyPlantStatisticsDTO;

public interface MyPlantStatisticsMapper{
	List<MyPlantStatisticsDTO> getStatistics(@Param("myplant_id") int myplant_id, @Param("range") String range);
}
