package org.joonzis.user.service;


import org.joonzis.user.dto.UserDTO;
import org.joonzis.user.mapper.UserMapper;
import org.joonzis.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.log4j.Log4j;

@Log4j
@Service
public class UserServiceImpl implements UserService{
	
	@Autowired
	private UserMapper usermapper;
	
	@Override
	@Transactional
	public void insert(UserVO vo, String aspectNames) {
	    
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
		
		int newUserId = usermapper.findUserIdByUsername(vo.getUsername());
		
		
		if(result != 1) {
			throw new IllegalStateException("회원가입 실패");
		}
		//관심사(중간테이블) 저장
		//aspectNames 예: "다육식물, 병해충, 비료"
		if(aspectNames == null || aspectNames.trim().isEmpty()) return;
		
		String[] names = aspectNames.split(",");
			for(String raw : names) {
				String name = raw.trim();
				if(name.isEmpty())
				continue;
				Integer hashtagId = usermapper.findHashtagIdByName(name);
				
				if(hashtagId == null) {
					usermapper.insertHashtag(name);
				hashtagId = usermapper.findHashtagIdByName(name);
				}
		//관심사 (중간 테이블)insert
		usermapper.insertUserAspect(newUserId, hashtagId);
		}
	}
	
	@Override
	public UserVO selectLogin(int user_id) {
		return usermapper.selectLogin(user_id);
	}
	@Override
	public UserVO login(String username, String password) {
		return usermapper.login(username, password);
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
	public boolean existUserByEmail(String username, String email) {
		return usermapper.existUserByEmail(username, email)>0;
	}
	@Override
	public UserVO findUserByEmail(String email) {
		return usermapper.findUserByEmail(email);
	}
	@Override
	public boolean resetPw(UserVO vo) {
		return usermapper.resetPw(vo)>0;
	}
	@Override
	public boolean isIdDuplicate(String username) {
		return usermapper.countByUsername(username)>0;
	}
	@Override
	public boolean isEmailDuplicate(String email) {
		return usermapper.countByEmail(email)>0;
	}
	@Override
	public int countByUsername(String username) {
		return usermapper.countByUsername(username);
	}
	@Override
	public UserVO findByUsername(String username) {
		return usermapper.findByUsername(username);
	}
	
	@Override
	public UserDTO selectPublicProfile(int user_id) {
		UserDTO dto =
		usermapper.selectPublicProfile(user_id);
		if(dto == null) {
			throw new IllegalArgumentException("존재하지 않는 회원");
		}
		
		dto.setReply_cnt(usermapper.getReplyCnt(user_id));
		dto.setView_cnt(usermapper.getViewCnt(user_id));
		
		return dto;
	}

}
