package org.joonzis.iot.service;

import java.util.List;

import org.joonzis.iot.dto.MyPlantMainDTO;
import org.joonzis.iot.repository.MyPlantMapper;
import org.joonzis.iot.vo.MyPlantVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MyPlantServiceImpl implements MyPlantService {
	@Autowired
	private MyPlantMapper mapper;
	
	@Override
	public List<MyPlantVO> getMyPlantsByUser(int userId){
		return mapper.selectMyPlantsByUser(userId);
	}

	@Override
	public List<MyPlantMainDTO> getMyPlantMainList(int userId) {
		return mapper.selectMyPlantMain(userId);
	}
	
}
