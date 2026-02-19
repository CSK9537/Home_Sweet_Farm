package org.joonzis.plant.service;

import java.util.List;

import org.joonzis.plant.dto.GuideDTO;
import org.joonzis.plant.dto.PlantDTO;
import org.joonzis.plant.dto.SimplePlantDTO;

public interface PlantService {
	// 식물 메인 페이지(rank등수 이상)
	public List<SimplePlantDTO> plantListByRank(int rank);
	// 식물 메인 페이지 하위 목록 리턴(rank등수 제외, 총 리스트 수 : total, 처음 갯수 : index)
	public List<SimplePlantDTO> plantListByRandom(int rank, int total, int index);
	public List<SimplePlantDTO> plantListByRandomPlus(int num);
	// 백과사전 DB에서 데이터 출력
	public PlantDTO plantInfo(String plant_name);
	// 관리가이드 DB에서 데이터 출력
	public GuideDTO guideInfo(String plant_name);
}
