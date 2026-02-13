package org.joonzis.myplant.service;

import java.util.List;

import org.joonzis.myplant.vo.ScheduleVO;

public interface MyPlantScheduleService {
	List<ScheduleVO> getListByMyPlant(int myplantId);
    void register(ScheduleVO vo);
    boolean modify(ScheduleVO vo);
    boolean remove(int scheduleId);
}
