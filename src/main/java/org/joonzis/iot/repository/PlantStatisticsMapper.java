package org.joonzis.iot.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.joonzis.iot.vo.PlantStatisticsVO;

@Mapper
public interface PlantStatisticsMapper{
	void insert(PlantStatisticsVO statistics);

    PlantStatisticsVO findLatestByMyplantId(Long myplantId);

    List<PlantStatisticsVO> findByPeriod(
            @Param("myplantId") Long myplantId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}
