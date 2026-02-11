package org.joonzis.plant.service;

import java.util.List;

import org.joonzis.plant.vo.GuideVO;
import org.joonzis.plant.vo.PlantVO;

public interface PlantService {
	// 식물 메인 페이지(rank등수 이상)
	public List<PlantVO> plantListByRank(int rank);
	// 식물 메인 페이지 하위 목록 리턴(rank등수 제외, 총 리스트 수 : total, 처음 갯수 : index)
	public List<PlantVO> plantListByRandom(int rank, int total, int index);
	public List<PlantVO> plantListByRandomPlus(int num);
	// 백과사전 DB에서 데이터 출력
	public PlantVO plantInfo(String plant_name);
	// 관리가이드 DB에서 데이터 출력
	public GuideVO guideInfo(String plant_name);
}
