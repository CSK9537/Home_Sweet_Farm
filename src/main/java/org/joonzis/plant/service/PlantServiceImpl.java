package org.joonzis.plant.service;

import java.util.List;

import org.joonzis.plant.mapper.GuideMapper;
import org.joonzis.plant.mapper.PlantMapper;
import org.joonzis.plant.vo.GuideVO;
import org.joonzis.plant.vo.PlantVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PlantServiceImpl implements PlantService{
	
	@Autowired
	private PlantMapper pmapper;
	@Autowired
	private GuideMapper gmapper;
	
	// 식물 이름으로 식별번호 가져오기
	private int plantId(String plant_name) {
		return pmapper.getPlantId(plant_name);
	}
	
	// 식물 메인 페이지(rank등수 이상)
	@Override
	public List<PlantVO> plantListByRank(int rank) {
		return pmapper.getPlantListByRank(rank);
	}
	
	// 백과사전 DB에서 데이터 출력
	@Override
	public PlantVO plantInfo(String plant_name) {
		int plant_id = plantId(plant_name);
		return pmapper.getPlantInfo(plant_id);
	}
	
	// 관리가이드 DB에서 데이터 출력
	@Override
	public GuideVO guideInfo(String plant_name) {
		int plant_id = plantId(plant_name);
		return gmapper.getGuideInfo(plant_id);
	}
}
