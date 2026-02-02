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
	public UserVO selectLogin(int USER_ID) {
		return usermapper.selectLogin(USER_ID);
	}
	@Override
	public int delete(UserVO vo) {
		return usermapper.delete(vo);
	}
	@Override
	public String findIdByEmail(String EMAIL) {
		return usermapper.findIdByEmail(EMAIL);
	}
	@Override
	public String findIdByPhone(String PHONE) {
		return usermapper.findIdByPhone(PHONE);
	}
	@Override
	public int existUserByEmail(String USERNAME, String EMAIL) {
		return usermapper.existUserByEmail(USERNAME, EMAIL);
	}
	@Override
	public int existUserByPhone(String USERNAME, String PHONE) {
		return usermapper.existUserByPhone(USERNAME, PHONE);
	}
	@Override
	public void updatePw(UserVO vo) {
		usermapper.updatePw(vo);
	}
	@Override
	public boolean isIdDuplicate(String USERNAME) {
		return usermapper.countByUsername(USERNAME)>0;
	}
	@Override
	public int countByUsername(String USERNAME) {
		return usermapper.countByUsername(USERNAME);
	}
	@Override
	public void insert(UserVO vo) {
		
		if(isIdDuplicate(vo.getUSERNAME())) {
			throw new IllegalStateException("이미 존재하는 아이디입니다");
		}
		usermapper.insert(vo);
	}
}
