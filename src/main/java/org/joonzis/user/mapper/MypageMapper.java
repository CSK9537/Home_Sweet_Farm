package org.joonzis.user.mapper;

import org.apache.ibatis.annotations.Param;
import org.joonzis.user.vo.UserVO;

public interface MypageMapper {
	
	//마이페이지 수정-닉네임, 주소
	public int updateMypage(UserVO vo);
}
