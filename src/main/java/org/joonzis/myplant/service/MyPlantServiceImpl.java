package org.joonzis.myplant.service;

import java.util.List;

import org.joonzis.myplant.dto.MyPlantMainDTO;
import org.joonzis.myplant.mapper.MyPlantMapper;
import org.joonzis.myplant.vo.MyPlantVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MyPlantServiceImpl implements MyPlantService {

	    @Autowired
	    private MyPlantMapper mapper;

	    @Override
	    public List<MyPlantMainDTO> getMyPlantMainList(int userId) {
	        return mapper.selectMyPlantMainList(userId);
	    }

	    @Override
	    public List<MyPlantVO> getList(int userId) {
	        return mapper.getList(userId);
	    }

	    @Override
	    public MyPlantVO get(int myplantId) {
	        return mapper.get(myplantId);
	    }

	    @Override
	    public void register(MyPlantVO vo) {
	        mapper.insert(vo);
	    }

	    @Override
	    public boolean modify(MyPlantVO vo) {
	        return mapper.update(vo) == 1;
	    }

	    @Override
	    public boolean remove(int myplantId) {
	        return mapper.delete(myplantId) == 1;
	    }
	

	
}
