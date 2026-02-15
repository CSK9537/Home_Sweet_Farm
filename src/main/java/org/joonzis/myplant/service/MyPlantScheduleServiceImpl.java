package org.joonzis.myplant.service;

import java.util.List;

import org.joonzis.myplant.dto.MyPlantScheduleDTO;
import org.joonzis.myplant.mapper.MyPlantScheduleMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MyPlantScheduleServiceImpl implements MyPlantScheduleService {
	
	@Autowired
	private MyPlantScheduleMapper scmapper;
	
	@Override
	public List<MyPlantScheduleDTO> getListByMyPlant(int myplant_id) {
		return scmapper.getListByMyPlant(myplant_id);
	}

	@Override
	public void register(MyPlantScheduleDTO scdto) {
		scmapper.insert(scdto);
	}

	@Override
	public boolean modify(MyPlantScheduleDTO scdto) {
		return scmapper.update(scdto) == 1;
	}
	
	@Override
	public boolean remove(int schedule_id) {
		return scmapper.delete(schedule_id) == 1;
	}
	
}
