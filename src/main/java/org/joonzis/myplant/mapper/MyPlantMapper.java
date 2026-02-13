package org.joonzis.myplant.mapper;

import java.util.List;

import org.joonzis.myplant.dto.MyPlantMainDTO;
import org.joonzis.myplant.vo.MyPlantVO;

public interface MyPlantMapper {
	 // 메인
    List<MyPlantMainDTO> selectMyPlantMainList(int userId);

    // CRUD
    List<MyPlantVO> getList(int userId);
    MyPlantVO get(int myplantId);
    int insert(MyPlantVO vo);
    int update(MyPlantVO vo);
    int delete(int myplantId);
}
