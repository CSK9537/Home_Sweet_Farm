package org.joonzis.myplant.mapper;

import java.util.List;

import org.joonzis.myplant.dto.MyPlantDTO;

public interface MyPlantMapper {
	// 나의 식물 전체 목록 출력
	public List<MyPlantDTO> myPlantMain(int user_id);
	// 나의 식물 하나 출력
	public MyPlantDTO get(int myplant_id);
	// 나의 식물 추가
	public int insert(MyPlantDTO mpdto);
	// 나의 식물 수정
	public int update(MyPlantDTO mpdto);
	// 나의 식물 삭제
	public int delete(int myplant_id);
}
