package org.joonzis.common.mapper;

import java.util.List;

import org.joonzis.plant.dto.SimplePlantDTO;

public interface SearchMapper {
	// 커뮤니티 검색 결과 출력
	
	// 식물 검색 결과 출력
	public List<SimplePlantDTO> searchPlants(String q);
	
	// 스토어 검색 결과 출력
	// 나의 식물 검색 결과 출력
	// 채팅 검색 결과 출력
	// Q&A 검색 결과 출력
}
