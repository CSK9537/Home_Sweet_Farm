package org.joonzis.user.mapper;

import org.apache.ibatis.annotations.Param;
import org.joonzis.user.vo.UserVO;

public interface UserMapper {
	
	//데이터 넣기
	public int insert(UserVO vo);
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
						@Param("email")String email);
	
	//비밀번호 찾기 대상 확인(전화번호)
	public int existUserByPhone(@Param("username")String username,
			@Param("phone")String phone);
	
	//비밀번호 재설정
	public void updatePw(UserVO vo);

	//아이디 중복 체크
	public int countByUsername(@Param("username")String username);
	
	//마케팅수신동의 테스트용 조회
	public UserVO selectByUsername(String username);
	
}
