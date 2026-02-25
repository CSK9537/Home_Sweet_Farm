package org.joonzis.myplant.service;

import java.util.List;

import org.joonzis.myplant.dto.MyPlantDTO;

public interface MyPlantService {
	// 나의 식물 전체 목록
	public List<MyPlantDTO> getMyPlantMainList(int user_id);
	// 나의 식물 정보
	public MyPlantDTO get(int myplant_id);
	// 나의 식물 추가
	public String register(MyPlantDTO mpdto);
	// 나의 식물 수정
	public String modify(MyPlantDTO mpdto);
	// 나의 식물 삭제
	public String remove(int myplant_id);
	
	public void insertMyPlant(String username, int plantId);
}