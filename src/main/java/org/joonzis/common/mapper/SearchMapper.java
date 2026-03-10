package org.joonzis.common.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.joonzis.community.dto.CommunityPostCardDTO;
import org.joonzis.plant.dto.SimplePlantDTO;
import org.joonzis.qna.dto.QnaFaqDTO;
import org.joonzis.store.dto.ProductForListDTO;
import org.joonzis.user.vo.UserVO;

public interface SearchMapper {
	
	// user_id로 유저 찾기
	public UserVO findUserbyId(int user_id);
	
	// 식물 검색 결과 출력
	public List<SimplePlantDTO> searchPlants(String q);
	
	
	
	// ==========================================
	// 1. 식물 검색
	// ==========================================
	// 검색: 식물 이름 (영어명, 한글명 통합)
	public List<SimplePlantDTO> searchPlantName(@Param("q") String q);

	// ==========================================
	// 2. 스토어(제품) 검색
	// ==========================================
	// 검색: 제품 이름
	public List<ProductForListDTO> searchProductName(@Param("q") String q);

	// ==========================================
	// 3. 커뮤니티 검색
	// ==========================================
	// 검색: 커뮤니티 글 제목
	public List<CommunityPostCardDTO> searchCommTitle(@Param("q") String q);
	// 검색: 커뮤니티 글 내용
	public List<CommunityPostCardDTO> searchCommContent(@Param("q") String q);
	// 검색: 커뮤니티 글 작성자 (아이디 + 닉네임)
	public List<CommunityPostCardDTO> searchCommWriter(@Param("q") String q);

	// ==========================================
	// 4. QnA 검색
	// ==========================================
	// 검색: QnA 제목
	public List<QnaFaqDTO> searchQnaTitle(@Param("q") String q);
	// 검색: QnA 내용
	public List<QnaFaqDTO> searchQnaContent(@Param("q") String q);
	// 검색: QnA 작성자 (아이디 + 닉네임)
	public List<QnaFaqDTO> searchQnaWriter(@Param("q") String q);
}
