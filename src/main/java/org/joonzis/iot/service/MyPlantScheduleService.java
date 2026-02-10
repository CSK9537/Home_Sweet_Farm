package org.joonzis.iot.service;

import java.util.List;

import org.joonzis.iot.vo.ScheduleVO;

public interface MyPlantScheduleService {
	List<ScheduleVO> getListByMyPlant(int myplantId);
    void register(ScheduleVO vo);
    boolean modify(ScheduleVO vo);
    boolean remove(int scheduleId);
}
