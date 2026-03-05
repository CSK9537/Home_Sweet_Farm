package org.joonzis.myplant.service;

import java.util.List;

import org.joonzis.myplant.dto.MyPlantDTO;
import org.joonzis.myplant.dto.MyPlantMainDTO;

public interface MyPlantService {
	// 나의 식물 전체 목록
	public List<MyPlantMainDTO> getMyPlantMainList(int user_id);
	// 나의 식물 정보
	public MyPlantMainDTO get(int myplant_id);
	// 나의 식물 추가
	public boolean register(MyPlantDTO mpdto);
	// 나의 식물 수정
	public String modify(MyPlantDTO mpdto);
	// 나의 식물 삭제
	public boolean remove(int myplant_id);
	
}