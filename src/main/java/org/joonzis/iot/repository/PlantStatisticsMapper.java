package org.joonzis.iot.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.joonzis.iot.domain.PlantStatistics;

@Mapper
public interface PlantStatisticsMapper{
	void insert(PlantStatistics statistics);

    PlantStatistics findLatestByMyplantId(Long myplantId);

    List<PlantStatistics> findByPeriod(
            @Param("myplantId") Long myplantId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}
