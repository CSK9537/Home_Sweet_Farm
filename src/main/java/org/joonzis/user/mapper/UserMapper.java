package org.joonzis.user.mapper;

import org.joonzis.user.vo.UserVO;

public interface UserMapper {
	
	//데이터 넣기
	public void insert(UserVO vo);
	//데이터 조회
	public  UserVO selectLogin(int USER_ID);
	//데이터 삭제
	public int delete(UserVO vo);
}
