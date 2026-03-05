package org.joonzis.user.scheduler;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import org.joonzis.user.mapper.UserMapper;
import org.joonzis.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.extern.apachecommons.CommonsLog;

@CommonsLog
@Component
public class UserDelationScheduler {
	
	@Autowired
	UserMapper mapper;
	
	// 30분마다 정리(원하면 조절)
	@Scheduled(cron = "0 */30 * * * *")
	public void userStateChecking() {
		// enable이 0이고, 마지막 로그인으로부터 1년이 넘은 계정 정보들
		List<UserVO> userList = mapper.selectUserListByEnable();
		
		// 삭제할 유저 PK 리스트
		List<Integer> deleteList = new ArrayList<Integer>();
		
		for (UserVO userVO : userList) {
			deleteList.add(userVO.getUser_id());
		}
		
		// 일괄 삭제
		int result = mapper.deletionUserByList(deleteList);
		
		log.warn("삭제된 비활성 계정 수 : " + result);
	}
}
