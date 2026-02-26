package org.joonzis.user.mapper;

import org.apache.ibatis.annotations.Param;
import org.joonzis.user.dto.UserDTO;
import org.joonzis.user.vo.UserVO;

public interface UserMapper {
	
	//회원가입
	public int insert(UserVO vo);
	
	//관심사
	//1)user-id 조회
	public int findUserIdByUsername(@Param("username")String username);
	//2)해시태그 id 조회
	public Integer findHashtagIdByName(@Param("hashtag_name") String hashtag_name);
	//3)해시태그 테이블 insert
	public int insertHashtag(@Param("hashtag_name") String hashtag_name);
	//4)관심사 중간 테이블 insert
	public int insertUserAspect(@Param("user_id") int userId,
								@Param("hashtag_id") int hashtagId);
	//5)관심사  중간 테이블 delete
	public int deleteUserAspect(@Param("user_id") int user_id);
	
	//데이터 조회
	public  UserVO selectLogin(int user_id);
	
	//로그인
	public UserVO login(@Param("username")String username, @Param("password")String password);
	
	//데이터 삭제
	public int delete(UserVO vo);
	
	//아이디 찾기(이메일)
	public String findIdByEmail(@Param("email")String email);
	//비밀번호 찾기 대상 확인(이메일)
	public int existUserByEmail(@Param("username")String username,
						@Param("email")String email);
	
	//비밀번호 재설정
	public void resetPw(UserVO vo);

	//아이디 중복 체크
	public int countByUsername(@Param("username")String username);
	
	//이메일 중복 체크
	public int countByEmail(String email);
	
	//마케팅수신동의 테스트용 조회
	public UserVO selectByUsername(String username);
	
	//자동로그인-아이디로 찾기(쿠키)
	public UserVO findByUsername(String username);
		
		
	//공개형 프로필
	//1) 닉네임, 프로필, 회원등급, 자기소개
	public UserDTO selectPublicProfile(int user_id);
	
	//2) 전체 답변수
	public int getReplyCnt(int user_id);
	
	//3)조회수
	public int getViewCnt(int user_id);
	
	//4)채택 답변(수)
	public int getIsSelected(int user_id);
	
	//유저 닉네임 조회
    public String findNicknameById(@Param("user_id")int user_id);
    
}
