package org.joonzis.myplant.service;

import java.util.List;

import org.joonzis.myplant.dto.MyPlantDTO;

public interface MyPlantService {
	public List<MyPlantDTO> getMyPlantMainList(int user_id);
	public MyPlantDTO get(int myplant_id);
	public void register(MyPlantDTO mpdto);
	public boolean modify(MyPlantDTO mpdto);
	public boolean remove(int myplant_id);
}