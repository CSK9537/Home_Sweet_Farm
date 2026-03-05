package org.joonzis.user.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.joonzis.user.vo.UserVO;

public interface MypageMapper {
	
	//마이페이지 수정-닉네임, 주소
	public int updateMypage(UserVO vo);
	
	//마이페이지 수정-관심사 검색
	public List<Map<String,Object>> searchHashtag(String keyword);
		
	//마이페이지 수정-관심사 선택(저장)
	public int insertUserAspect(@Param("userId")int userId, @Param("hashtagId")int hashtagId);
}
