package org.joonzis.iot.repository;

import java.util.List;

import org.joonzis.iot.dto.MyPlantMainDTO;
import org.joonzis.iot.vo.MyPlantVO;

public interface MyPlantMapper {
	List<MyPlantVO> selectMyPlantsByUser(int userId);
	List<MyPlantMainDTO> selectMyPlantMain(int userId);
}
