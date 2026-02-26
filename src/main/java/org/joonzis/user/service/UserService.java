package org.joonzis.user.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.joonzis.user.dto.UserDTO;
import org.joonzis.user.vo.UserVO;
import org.springframework.transaction.annotation.Transactional;

public interface UserService {
	
	//데이터 넣기(회원가입)
	public void insert(UserVO vo, String aspectNames);
	//데이터 조회
	public  UserVO selectLogin(int user_id);
	//로그인
	public UserVO login(@Param("username")String username, @Param("password")String password);
	//데이터 삭제(회원 탈퇴)
	public int delete(UserVO vo);
	//아이디 찾기(이메일)
	public String findIdByEmail(@Param("email")String email);
	//아이디- 결과메시지
	public String findId(String name, String email);
	//비밀번호 찾기 대상 확인(이메일)
	public int existUserByEmail(@Param("username")String username,
							@Param("email")String email);
	//비밀번호 재설정
	public void resetPw(UserVO vo);

	//아이디 중복 체크
	public boolean isIdDuplicate(String username);
	
	public int countByUsername(String username);
	
	//자동로그인-아이디로 찾기(쿠키)
	public UserVO findByUsername(String username);
	//공개형 프로필
	//1) 닉네임, 프로필, 회원등급, 자기소개
	public UserDTO selectPublicProfile(int userId);
	
}
