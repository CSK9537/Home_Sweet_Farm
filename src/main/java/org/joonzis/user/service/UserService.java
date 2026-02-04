package org.joonzis.user.service;

import org.apache.ibatis.annotations.Param;
import org.joonzis.user.dto.UserDTO;
import org.joonzis.user.vo.UserVO;

public interface UserService {
	
	//데이터 넣기
	public void insert(UserVO vo);
	//데이터 조회
	public  UserVO selectLogin(int user_id);
	//데이터 삭제
	public int delete(UserVO vo);
	//아이디 찾기(이메일)
	public String findIdByEmail(@Param("email")String email);
	//아이디 찾기(전화번호)
	public String findIdByPhone(@Param("phone")String phone);
	//비밀번호 찾기 대상 확인(이메일)
	public int existUserByEmail(@Param("username")String username,
							@Param("phone")String phone);
	//비밀번호 찾기 대상 확인(전화번호)
	public int existUserByPhone(@Param("username")String username,
							@Param("phone")String phone);
	//비밀번호 재설정
	public void updatePw(UserVO vo);

	//아이디 중복 체크
	public boolean isIdDuplicate(String username);
	
	public int countByUsername(String username);
	
	//공개형 프로필
	//1) 닉네임, 프로필, intro, gradeId
	public UserDTO selectPublicProfile(int userId);
	
}
