package org.joonzis.plant.service;

import java.util.List;

import org.joonzis.plant.vo.GuideVO;
import org.joonzis.plant.vo.PlantVO;

public interface PlantService {
	// 식물 메인 페이지(rank등수 이상)
	public List<PlantVO> plantListByRank(int rank);
	// 백과사전 DB에서 데이터 출력
	public PlantVO plantInfo(String plant_name);
	// 관리가이드 DB에서 데이터 출력
	public GuideVO guideInfo(String plant_name);
}
