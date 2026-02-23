package org.joonzis.common.service;

import java.util.List;

import org.joonzis.common.mapper.SearchMapper;
import org.joonzis.community.vo.BoardVO;
import org.joonzis.plant.dto.SimplePlantDTO;
import org.joonzis.store.vo.ProductVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SearchServiceImpl implements SearchService{
	
	@Autowired
	private SearchMapper smapper;
	
	// 커뮤니티 검색 리스트
	// 제목
	@Override
	public List<BoardVO> searchBoardListByTitle(String q) {
		List<BoardVO> boardSearchByTitleResult = smapper.searchBoardsByTitle(q);
		return boardSearchByTitleResult;
	}
	// 내용
	@Override
	public List<BoardVO> searchBoardListByContent(String q) {
		List<BoardVO> boardSearchByContentResult = smapper.searchBoardsByContent(q);
		return boardSearchByContentResult;
	}
	// 작성자
	@Override
	public List<BoardVO> searchBoardListByWriter(String q) {
		List<BoardVO> boardSearchByWriterResult = smapper.searchBoardsByWriter(q);
		return boardSearchByWriterResult;
	}
	
	// 식물 검색 리스트
	@Override
	public List<SimplePlantDTO> searchPlantList(String q) {
		List<SimplePlantDTO> plantSearchResult = smapper.searchPlants(q);
		return plantSearchResult;
	}
	
	// 스토어 검색 리스트
	@Override
	public List<ProductVO> searchProductList(String q) {
		List<ProductVO> productSearchResult = smapper.searchProducts(q);
		return productSearchResult;
	}
	// Q&A 검색 리스트
}
