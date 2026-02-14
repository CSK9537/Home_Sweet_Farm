package org.joonzis.myplant.service;

import java.util.List;

import org.joonzis.myplant.dto.MyPlantScheduleDTO;

public interface MyPlantScheduleService {
	public List<MyPlantScheduleDTO> getListByMyPlant(int myplant_id);
	public void register(MyPlantScheduleDTO scdto);
	public boolean modify(MyPlantScheduleDTO scdto);
	public boolean remove(int schedule_id);
}
