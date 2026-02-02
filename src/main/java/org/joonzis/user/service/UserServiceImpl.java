package org.joonzis.user.service;

import org.joonzis.user.mapper.UserMapper;
import org.joonzis.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.log4j.Log4j;

@Log4j
@Service
public class UserServiceImpl implements UserService{
	@Autowired
	private UserMapper usermapper;
	
	@Override
	public void insert(UserVO vo) {
		usermapper.insert(vo);
	}
	@Override
	public UserVO selectLogin(int USER_ID) {
		return usermapper.selectLogin(USER_ID);
	}
	@Override
	public int delete(UserVO vo) {
		return usermapper.delete(vo);
	}

}
