package org.joonzis.plant.mapper;

import org.joonzis.plant.dto.GuideDTO;

public interface GuideMapper {
	// 가이드 정보 입력
	public int insertGuideInfo(GuideDTO gdto);
	// 가이드 정보 출력(plant_id)
	public GuideDTO getGuideInfo(int plant_id);
}
