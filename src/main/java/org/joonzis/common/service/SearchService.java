package org.joonzis.common.service;

import java.util.List;

import org.joonzis.community.dto.CommunityPostCardDTO;
import org.joonzis.plant.dto.SimplePlantDTO;
import org.joonzis.qna.dto.QnaFaqDTO;
import org.joonzis.store.dto.ProductForListDTO;
import org.joonzis.user.vo.UserVO;

public interface SearchService {
	
	// user_id로 유저 찾기
	public UserVO findUserbyId(int user_id);
	
	// 식물 검색 리스트 10개만
	public List<SimplePlantDTO> searchPlantList10(String q);
	
	// 검색결과 - 식물
	public List<SimplePlantDTO> searchPlants(String q);
	// 검색결과 - 스토어
	public List<ProductForListDTO> searchProducts(String q);
	// 검색결과 - 커뮤니티
	public List<CommunityPostCardDTO> searchComms(String q);
	// 검색결과 - QnA
	public List<QnaFaqDTO> searchQnas(String q);
	
	
}
