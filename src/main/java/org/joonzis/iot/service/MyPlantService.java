package org.joonzis.iot.service;

import java.util.List;

import org.joonzis.iot.dto.MyPlantMainDTO;
import org.joonzis.iot.vo.MyPlantVO;

public interface MyPlantService {
	// 메인 화면 전용
	List<MyPlantMainDTO> getMyPlantMainList(int userId);
	
	// 나의 식물 CRUD관련
	List<MyPlantVO> getList(int userId);
	MyPlantVO get(int myplantId);
	void register(MyPlantVO vo);
	boolean modify(MyPlantVO vo);
	boolean remove(int myplantId);
}
