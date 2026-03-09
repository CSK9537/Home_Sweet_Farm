package org.joonzis.user.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.joonzis.community.dto.CommunityPostCardDTO;
import org.joonzis.community.vo.ReplyVO;
import org.joonzis.user.dto.MyPageItemDTO;
import org.joonzis.user.dto.MyPageReplyDTO;
import org.joonzis.user.vo.UserVO;

public interface MypageMapper {
	
	public int countMyPosts(@Param("userId") String userId, @Param("tab") String tab);
	public List<MyPageItemDTO> selectMyPosts(@Param("userId") String userId, @Param("tab") String tab, @Param("offset") int offset, @Param("pageSize") int pageSize);

	public int countMyQuestions(@Param("userId") String userId, @Param("tab") String tab);
	public List<MyPageItemDTO> selectMyQuestions(@Param("userId") String userId, @Param("tab") String tab, @Param("offset") int offset, @Param("pageSize") int pageSize);
    
	public int countMyAnswers(@Param("userId") String userId, @Param("tab") String tab);
	public List<MyPageItemDTO> selectMyAnswers(@Param("userId") String userId, @Param("tab") String tab, @Param("offset") int offset, @Param("pageSize") int pageSize);
    
	public int countMyReplys(@Param("userId") String userId, @Param("tab") String tab);
	public List<MyPageReplyDTO> selectMyReplys(@Param("userId") String userId, @Param("tab") String tab, @Param("offset") int offset, @Param("pageSize") int pageSize);
    
	//마이페이지 수정
	public int updateMypage(UserVO vo);
	
	//마이페이지 수정-관심사 검색
	public List<Map<String,Object>> searchHashtag(String keyword);
		
	//마이페이지 수정-관심사 선택(저장)
	public int insertUserAspect(@Param("userId")int userId, @Param("hashtagId")int hashtagId);
	
	//마이페이지-프로필 이미지 파일 이름 가져오기
	public String getProfile(int user_id);
	//마이페이지 수정-프로필 이미지 변경
	public int updateProfile(@Param("user_id") int user_id, @Param("profile_filename") String profile_filename);
	
	//마이페이지 - 자기소개 수정
	public int updateIntro(UserVO vo);
	
}
