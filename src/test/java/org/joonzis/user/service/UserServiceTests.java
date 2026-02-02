package org.joonzis.user.service;

import static org.junit.Assert.assertTrue;

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
//	public void testSelectLogin() {
//		int USER_ID = 3;
//		UserVO vo = uservice.selectLogin(USER_ID);
//	}
//	@Test
//	public void testFindIdByEmail() {
//		String EMAIL = "test@test.com";
//		uservice.findIdByEmail(EMAIL);
//	}
//	@Test
//	public void testFindIdByPhone() {
//		String PHONE = "12345678";
//		uservice.findIdByPhone(PHONE);
//	}
//	@Test
//	public void testExistUserByEmail() {
//		String USERNAME = "linwee";
//		String EMAIL = "test@test.com";
//		uservice.existUserByEmail(USERNAME, EMAIL);
//	}
//	@Test
//	public void testExistUserByPhone() {
//		String USERNAME = "linwee";
//		String PHONE = "12345678";
//		uservice.existUserByPhone(USERNAME, PHONE);
//	}
//	@Test
//	public void testUpdatePw() {
//		UserVO vo = new UserVO();
//		vo.setUSERNAME("LILI1357");
//		vo.setPASSWORD("LIN3333");
//		uservice.updatePw(vo);
//	}
//	@Test
//	public void testIsIdDuplicate() {
//		String USERNAME = "helen11";
//		boolean dup = 
//		uservice.isIdDuplicate(USERNAME);
//		assertTrue(dup);	
//	}
//	@Test
//	public void testInsert() {
//		UserVO vo = new UserVO();
//		vo.setUSER_ID(10);
//		vo.setUSERNAME("helen11");
//		vo.setPASSWORD("len3333");
//		vo.setNAME("helen");
//		vo.setEMAIL("len@email.com");
//		vo.setPHONE(13571357);
//		uservice.insert(vo);
//	}

}
