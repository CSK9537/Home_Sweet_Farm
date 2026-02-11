package org.joonzis.plant.service;

import java.util.ArrayList;
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
	
	// 식물 하위 목록
	private List<PlantVO> plbr = new ArrayList<PlantVO>();
	// 전역 호출 - 등수, 전체갯수, 갯수 기본값
	private int rank = 3;
	private int total = 72;
	private int index = 12;
	
	// 식물 이름으로 식별번호 가져오기
	private int plantId(String plant_name) {
		return pmapper.getPlantId(plant_name);
	}
	
	// 식물 메인 페이지(rank등수 이상)
	@Override
	public List<PlantVO> plantListByRank(int rank) {
		return pmapper.getPlantListByRank(rank);
	}
	
	// 식물 메인 페이지 하위 목록 리턴(rank등수 제외, 총 리스트 수 : total, 처음 갯수 : index)(랜덤리스트 초기화도 겸함)
	@Override
	public List<PlantVO> plantListByRandom(int rank, int total, int index) {
		this.rank = rank;
		this.total = total;
		this.index = index;
		plbr = pmapper.getPlantListByRandom(rank, total);
		List<PlantVO> firstList = plbr.subList(0, index);
		return firstList;
	}
	
	// 식물 메인 페이지 하위 추가 목록 (num개 만큼)
	@Override
	public List<PlantVO> plantListByRandomPlus(int num){
		if(index + num <= plbr.size()) {
			List<PlantVO> plantList = plbr.subList(index, index + num);
			index += num;
			return plantList;
		}else if(index < plbr.size()) {
			List<PlantVO> plantList = plbr.subList(index, plbr.size());
			index = 0;
			plbr = pmapper.getPlantListByRandom(rank, total);
			return plantList;
		}else {
			plbr = pmapper.getPlantListByRandom(rank, total);
			index = 0;
			List<PlantVO> plantList = plbr.subList(0, index);
			return plantList;
		}
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
