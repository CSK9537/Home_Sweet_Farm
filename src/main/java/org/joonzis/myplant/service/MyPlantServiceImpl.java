package org.joonzis.myplant.service;

import java.util.List;

import org.joonzis.myplant.dto.MyPlantDTO;
import org.joonzis.myplant.mapper.MyPlantMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MyPlantServiceImpl implements MyPlantService {

	    @Autowired
	    private MyPlantMapper mapper;

	    @Override
	    public List<MyPlantDTO> getMyPlantMainList(int user_id) {
	        return mapper.myPlantMain(user_id);
	    }

	    @Override
	    public MyPlantDTO get(int myplant_id) {
	        return mapper.get(myplant_id);
	    }

	    @Override
	    public void register(MyPlantDTO mpdto) {
	        mapper.insert(mpdto);
	    }

	    @Override
	    public boolean modify(MyPlantDTO mpdto) {
	        return mapper.update(mpdto) == 1;
	    }

	    @Override
	    public boolean remove(int myplant_id) {
	        return mapper.delete(myplant_id) == 1;
	    }
	

	
}
