package org.joonzis.user.service;

import java.util.List;

import org.joonzis.community.dto.CommunityPostCardDTO;
import org.joonzis.user.vo.UserVO;
import org.springframework.web.bind.annotation.RequestParam;

public interface MypageService {
	
	//마이페이지 수정-닉네임, 주소
	public int updateMypage(UserVO vo);
}
