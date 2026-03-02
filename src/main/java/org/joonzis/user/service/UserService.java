package org.joonzis.user.service;

import org.joonzis.user.dto.UserDTO;
import org.joonzis.user.vo.UserVO;

public interface UserService {
	
	//데이터 넣기(회원가입)
	public void insert(UserVO vo, String aspectNames);
	//데이터 조회
	public UserVO selectLogin(int user_id);
	//로그인
	public UserVO login(String username, String password);
	//데이터 삭제(회원 탈퇴)
	public int delete(UserVO vo);
	//아이디 찾기(이메일)
	public String findIdByEmail(String email);
	//비밀번호 찾기 대상 확인(이메일)
	public boolean existUserByEmail(String username, String email);
	//이메일로 유저정보 가져오기
	public UserVO findUserByEmail(String email);
	//비밀번호 재설정
	public boolean resetPw(UserVO vo);

	//아이디 중복 체크
	public boolean isIdDuplicate(String username);
	
	//이메일 중복 체그
	public boolean isEmailDuplicate(String email);
	
	public int countByUsername(String username);
	
	//자동로그인-아이디로 찾기(쿠키)
	public UserVO findByUsername(String username);
	
	//마이페이지
	//1) 내 정보 조회
	public UserVO selectUser(int User_id);
	
	//공개형 프로필
	//1) 닉네임, 프로필, 회원등급, 자기소개
	public UserDTO selectPublicProfile(int userId);
	
}
