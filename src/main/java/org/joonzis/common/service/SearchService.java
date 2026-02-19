package org.joonzis.common.service;

import java.util.List;

import org.joonzis.plant.dto.SimplePlantDTO;

public interface SearchService {
	// 커뮤니티 검색 리스트
	// 식물 검색 리스트
	public List<SimplePlantDTO> searchPlantList(String q);
	// 스토어 검색 리스트
	// 나의 식물 검색 리스트
	// 채팅 검색 리스트
	// Q&A 검색 리스트
}
