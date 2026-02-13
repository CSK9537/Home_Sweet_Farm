package org.joonzis.myplant.service;

import java.util.List;

import org.joonzis.myplant.dto.MyPlantMainDTO;
import org.joonzis.myplant.vo.MyPlantVO;

public interface MyPlantService {
	
	List<MyPlantMainDTO> getMyPlantMainList(int userId);
	
	  // CRUD
    List<MyPlantVO> getList(int userId);
    MyPlantVO get(int myplantId);
    void register(MyPlantVO vo);
    boolean modify(MyPlantVO vo);
    boolean remove(int myplantId);
}
