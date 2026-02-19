package org.joonzis.plant.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.joonzis.plant.dto.PlantDTO;
import org.joonzis.plant.dto.SimplePlantDTO;

public interface PlantMapper {
	// 식물 정보 입력
	public int insertPlantInfo(PlantDTO pdtd);
	// 식물 번호 목록 가져오기
	public List<Integer> getPlantIdList();
	// 식물 목록 가져오기(rank등수 이상)
	public List<SimplePlantDTO> getPlantListByRank(int rank);
	// rank등수 제외 식물 목록 num개
	public List<SimplePlantDTO> getPlantListByRandom(@Param("rank") int rank, @Param("total") int total);
	// 식물 이름으로 식별번호 가져오기
	public int getPlantId(String plant_name);
	// 식물 정보 출력(plant_id)
	public PlantDTO getPlantInfo(int plant_id);
}
