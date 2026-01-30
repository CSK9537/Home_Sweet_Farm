package org.joonzis.user.mapper;

import org.joonzis.user.vo.UserVO;

public interface UserMapper {
	
	public void insert(UserVO vo);
	public  UserVO selectLogin(UserVO vo);
	public int delete(UserVO vo);
}
