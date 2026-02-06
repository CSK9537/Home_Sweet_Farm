package org.joonzis.iot.service;

import java.util.List;

import org.joonzis.iot.dto.MyPlantMainDTO;
import org.joonzis.iot.vo.MyPlantVO;

public interface MyPlantService {
	List<MyPlantVO> getMyPlantsByUser(int userId);
	List<MyPlantMainDTO> getMyPlantMainList(int userId);
}
