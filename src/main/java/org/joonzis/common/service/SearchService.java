package org.joonzis.common.service;

import java.util.List;

import org.joonzis.community.vo.BoardVO;
import org.joonzis.plant.dto.SimplePlantDTO;
import org.joonzis.store.vo.ProductVO;

public interface SearchService {
	// 커뮤니티 검색 리스트
	// 제목
	public List<BoardVO> searchBoardListByTitle(String q);
	// 내용
	public List<BoardVO> searchBoardListByContent(String q);
	// 작성자
	public List<BoardVO> searchBoardListByWriter(String q);
	
	// 식물 검색 리스트
	public List<SimplePlantDTO> searchPlantList(String q);
	
	// 스토어 검색 리스트
	public List<ProductVO> searchProductList(String q);
	
	// Q&A 검색 리스트
	
}
