package org.joonzis.user.service;

import java.util.List;
import java.util.Map;

import org.joonzis.community.dto.CommunityPostCardDTO;
import org.joonzis.community.vo.ReplyVO;
import org.joonzis.user.vo.UserVO;

public interface MypageService {
	
	// 사용자가 작성한 글
	public List<CommunityPostCardDTO> selectMyPosts(int user_id);
	
	// 사용자가 작성한 댓글
	public List<ReplyVO> selectMyReply(int user_id);
	
//	// 사용자가 작성한 질문
//	public List<CommunityPostCardDTO> selectMyQuest(int user_id);
	
	//마이페이지 수정-닉네임, 주소
	public int updateMypage(UserVO vo);
	
	//마이페이지 수정-관심사 검색
	public List<Map<String,Object>> searchHashtag(String keyword);
	
	//마이페이지 수정-관심사 선택(저장)
	public int insertUserAspect(int userId, int hashtagId);
	
	//마이페이지 - 프로필 이미지 파일 이름 가져오기
	public String getProfile(int user_id);
	
	//마이페이지 수정-프로필 이미지 변경
	public boolean updateProfile(int user_id, String profile_filename);
	
	//마이페이지 - 자기소개 수정
	public int updateIntro(UserVO vo);
	
}
