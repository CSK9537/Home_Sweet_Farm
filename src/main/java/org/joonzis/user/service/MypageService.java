package org.joonzis.user.service;

import java.util.List;
import java.util.Map;

import org.joonzis.community.dto.CommunityPostCardDTO;
import org.joonzis.user.vo.UserVO;

public interface MypageService {
	
	//마이페이지 수정-닉네임, 주소
	public int updateMypage(UserVO vo);
	
	//마이페이지 수정-관심사 검색
	public List<Map<String,Object>> searchHashtag(String keyword);
	
	//마이페이지 수정-관심사 선택(저장)
	public int insertUserAspect(int userId, int hashtagId);
}
