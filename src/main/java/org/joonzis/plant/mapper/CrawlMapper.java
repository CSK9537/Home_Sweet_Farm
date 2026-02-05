package org.joonzis.plant.mapper;

import java.util.List;

public interface CrawlMapper {
	// 식물 이름 목록 가져오기
	public List<String> searchPlants();
	// PictureThis 기반 식물 이름 저장
	public int insertSearchPlantNames(String plant_name);
}
