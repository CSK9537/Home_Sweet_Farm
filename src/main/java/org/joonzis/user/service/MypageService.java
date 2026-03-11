package org.joonzis.user.service;

import java.util.List;
import java.util.Map;

import org.joonzis.community.dto.CommunityPostCardDTO;
import org.joonzis.community.vo.ReplyVO;
import org.joonzis.user.dto.MyPageItemDTO;
import org.joonzis.user.dto.MyPageReplyDTO;
import org.joonzis.user.vo.UserVO;

public interface MypageService {
	
	public int getMyPostsCount(String userId, String tab);
	public List<MyPageItemDTO> getMyPosts(String userId, String tab, int page, int pageSize);
    
    public int getMyQuestionsCount(String userId, String tab);
    public List<MyPageItemDTO> getMyQuestions(String userId, String tab, int page, int pageSize);
    
    public int getMyAnswersCount(String userId, String tab);
    public List<MyPageItemDTO> getMyAnswers(String userId, String tab, int page, int pageSize);
    
    public int getMyReplysCount(String userId, String tab);
    public List<MyPageReplyDTO> getMyReplys(String userId, String tab, int page, int pageSize);
	
	//마이페이지-개인 정보 수정
	public boolean updateMypage(UserVO vo);
	
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
