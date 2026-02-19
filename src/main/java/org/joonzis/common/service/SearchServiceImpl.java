package org.joonzis.common.service;

import java.util.List;

import org.joonzis.common.mapper.SearchMapper;
import org.joonzis.plant.dto.SimplePlantDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SearchServiceImpl implements SearchService{
	
	@Autowired
	private SearchMapper smapper;
	
	// 커뮤니티 검색 리스트
	// 식물 검색 리스트
	@Override
	public List<SimplePlantDTO> searchPlantList(String q) {
		List<SimplePlantDTO> plantSearchResult = smapper.searchPlants(q);
		return plantSearchResult;
	}
	// 스토어 검색 리스트
	// 나의 식물 검색 리스트
	// 채팅 검색 리스트
	// Q&A 검색 리스트
}
