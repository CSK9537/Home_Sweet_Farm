package org.joonzis.myplant.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.joonzis.myplant.vo.ScheduleVO;

public interface MyPlantScheduleMapper {
	 	List<ScheduleVO> getListByMyPlant(@Param("myplantId") int myplantId);
	    int insert(ScheduleVO vo);
	    int update(ScheduleVO vo);
	    int delete(@Param("scheduleId") int scheduleId);
}
