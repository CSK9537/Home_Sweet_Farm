package org.joonzis.common.mapper;

import java.util.List;

import org.joonzis.community.vo.BoardVO;
import org.joonzis.plant.dto.SimplePlantDTO;
import org.joonzis.store.vo.ProductVO;
import org.joonzis.user.vo.UserVO;

public interface SearchMapper {
	
	// user_id로 유저 찾기
	public UserVO findUserbyId(int user_id);
	
	// 커뮤니티 검색 결과 출력
	// 제목 검색
	public List<BoardVO> searchBoardsByTitle(String q);
	// 내용 검색
	public List<BoardVO> searchBoardsByContent(String q);
	// 작성자 검색
	public List<BoardVO> searchBoardsByWriter(String q);
	
	// 식물 검색 결과 출력
	public List<SimplePlantDTO> searchPlants(String q);
	
	// 스토어 검색 결과 출력
	public List<ProductVO> searchProducts(String q);
	
	// Q&A 검색 결과 출력
}
