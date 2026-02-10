package org.joonzis.iot.service;

import java.util.List;

import org.joonzis.iot.mapper.MyPlantScheduleMapper;
import org.joonzis.iot.vo.ScheduleVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MyPlantScheduleServiceImpl implements MyPlantScheduleService {
	
	@Autowired
	private MyPlantScheduleMapper mapper;
	
	@Override
	public List<ScheduleVO> getListByMyPlant(int myplantId) {
		return mapper.getListByMyPlant(myplantId);
	}

	@Override
	public void register(ScheduleVO vo) {
		 mapper.insert(vo);
	}

	@Override
	public boolean modify(ScheduleVO vo) {
		return mapper.update(vo) == 1;
	}

	@Override
	public boolean remove(int scheduleId) {
		return mapper.delete(scheduleId) == 1;
	}
	
}
