package org.joonzis.user.service;

import org.joonzis.user.dto.UserDTO;
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
		
		//1)비밀번호 확인
		if(vo.getPassword() == null || 
				!vo.getPassword().equals(vo.getConfirmPassword())) {
			throw new IllegalArgumentException("비밀번호 확인이 일치하지 않습니다.");
		}
		//2)아이디 중복 체크(예시)
		if(isIdDuplicate(vo.getUsername())) {
			throw new IllegalStateException("이미 존재하는 아이디입니다");
		}
		//3)마케팅 정보 수신 동의 처리
		//confirm_event: 0(미동의), 1(동의)
		vo.setConfirm_event(vo.getConfirm_event() == 1? 1 : 0);
		//4)DB insert
		int result = usermapper.insert(vo);
		if(result != 1) {
			throw new IllegalStateException("회원가입 실패");
		}
	}		
		


	@Override
	public UserVO selectLogin(int user_id) {
		return usermapper.selectLogin(user_id);
	}
	@Override
	public int delete(UserVO vo) {
		return usermapper.delete(vo);
	}
	@Override
	public String findIdByEmail(String email) {
		return usermapper.findIdByEmail(email);
	}
	@Override
	public String findIdByPhone(String phone) {
		return usermapper.findIdByPhone(phone);
	}
	@Override
	public int existUserByEmail(String username, String email) {
		return usermapper.existUserByEmail(username, email);
	}
	@Override
	public int existUserByPhone(String username, String phone) {
		return usermapper.existUserByPhone(username, phone);
	}
	@Override
	public void updatePw(UserVO vo) {
		usermapper.updatePw(vo);

	}
	@Override
	public boolean isIdDuplicate(String username) {
		return usermapper.countByUsername(username)>0;
	}
	@Override
	public int countByUsername(String username) {
		return usermapper.countByUsername(username);
	}
	@Override
	public UserDTO selectPublicProfile(int userId) {
		UserDTO dto =
		usermapper.selectPublicProfile(userId);
		
		
		
		return null;
	}

}
