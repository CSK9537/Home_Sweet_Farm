package org.joonzis.user.service;

import org.joonzis.user.vo.UserVO;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import lombok.extern.log4j.Log4j;

@Log4j
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("file:src/main/webapp/WEB-INF/spring/root-context.xml")
public class UserServiceTests {
	@Autowired
	private UserService uservice;
	
//	@Test
//	public void testInsert() {
//		UserVO vo = new UserVO();
//		vo.setUSER_ID(1111);
//		vo.setNAME("lins");
//		uservice.insert(vo);
//	}
//	@Test
//	public void testSelectLogin() {
//		int USER_ID = 3;
//		UserVO vo = uservice.selectLogin(USER_ID);
//	}
	
	
	

}
