package org.joonzis.plant.mapper;

import java.util.List;

import org.joonzis.plant.vo.PlantVO;

public interface PlantMapper {
	// 식물 정보 입력
	public int insertPlantInfo(PlantVO pvo);
	// 식물 번호 목록 가져오기
	public List<Integer> plantIdList();
	// 식물 정보 출력(plant_id)
	public PlantVO getPlantInfo(int plant_id);
}
