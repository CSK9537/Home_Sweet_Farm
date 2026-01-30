package org.joonzis.user.service;

import org.joonzis.user.vo.UserVO;

public interface UserService {
	public void insert(UserVO vo);
	public  UserVO selectLogin(UserVO vo);
	public int delete(UserVO vo);
}
