package org.joonzis.myplant.mapper;

import java.time.LocalDateTime;
import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.joonzis.myplant.dto.MyPlantStatisticsDTO;

public interface MyPlantStatisticsMapper{
	// 나의 식물 상태 입력
	public void insert(MyPlantStatisticsDTO stdto);
	// 나의 식물 상태(가장 최근) 출력
	public MyPlantStatisticsDTO findLatestByMyplantId(int myplant_id);
	// 나의 식물 상태(기간) 출력
	public List<MyPlantStatisticsDTO> findByPeriod(
		@Param("myplantId") int myplant_id,
		@Param("start") LocalDateTime start,
		@Param("end") LocalDateTime end
    );
}
