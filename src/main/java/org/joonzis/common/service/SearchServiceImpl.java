package org.joonzis.common.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.joonzis.common.mapper.SearchMapper;
import org.joonzis.community.dto.CommunityPostCardDTO;
import org.joonzis.plant.dto.SimplePlantDTO;
import org.joonzis.qna.dto.QnaFaqDTO;
import org.joonzis.store.dto.ProductForListDTO;
import org.joonzis.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SearchServiceImpl implements SearchService{
	
	@Autowired
	private SearchMapper searchMapper;
	
	@Override
	// user_id로 유저 찾기
	public UserVO findUserbyId(int user_id) {
		UserVO uvo = searchMapper.findUserbyId(user_id);
		return uvo;
	}
	
	// 식물 검색 리스트
	@Override
	public List<SimplePlantDTO> searchPlantList10(String q) {
		List<SimplePlantDTO> plantSearchResult = searchMapper.searchPlants(q);
		return plantSearchResult;
	}
	
	// 1. 검색결과 - 식물
	@Override
	public List<SimplePlantDTO> searchPlants(String q) {
		return searchMapper.searchPlantName(q);
	}

	// 2. 검색결과 - 스토어
	@Override
	public List<ProductForListDTO> searchProducts(String q) {
		return searchMapper.searchProductName(q);
	}

	// 3. 검색결과 - 커뮤니티 (통합 검색)
	@Override
	public List<CommunityPostCardDTO> searchComms(String q) {
		
		List<CommunityPostCardDTO> resultList = new ArrayList<>();
		Set<Integer> seenIds = new HashSet<>(); // 중복 방지용 Set (게시글 ID 저장)

		// 1) 제목 검색
		for (CommunityPostCardDTO dto : searchMapper.searchCommTitle(q)) {
			if (seenIds.add(dto.getBoardId())) { // Set에 없던 ID면 추가
				resultList.add(dto);
			}
		}
		// 2) 내용 검색
		for (CommunityPostCardDTO dto : searchMapper.searchCommContent(q)) {
			if (seenIds.add(dto.getBoardId())) { 
				resultList.add(dto);
			}
		}
		// 3) 작성자 검색
		for (CommunityPostCardDTO dto : searchMapper.searchCommWriter(q)) {
			if (seenIds.add(dto.getBoardId())) { 
				resultList.add(dto);
			}
		}

		return resultList;
	}

	// 4. 검색결과 - QnA (통합 검색)
	@Override
	public List<QnaFaqDTO> searchQnas(String q) {
		
		List<QnaFaqDTO> resultList = new ArrayList<>();
		Set<Integer> seenIds = new HashSet<>(); // 중복 방지용 Set (게시글 ID 저장)

		// 1) 제목 검색
		for (QnaFaqDTO dto : searchMapper.searchQnaTitle(q)) {
			if (seenIds.add(dto.getId())) { 
				resultList.add(dto);
			}
		}
		// 2) 내용 검색
		for (QnaFaqDTO dto : searchMapper.searchQnaContent(q)) {
			if (seenIds.add(dto.getId())) { 
				resultList.add(dto);
			}
		}
		// 3) 작성자 검색
		for (QnaFaqDTO dto : searchMapper.searchQnaWriter(q)) {
			if (seenIds.add(dto.getId())) { 
				resultList.add(dto);
			}
		}

		return resultList;
	}
	
}
