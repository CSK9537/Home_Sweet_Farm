package org.joonzis.user.mapper;

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
public class UserMapperTests {
	@Autowired
	private UserMapper usermapper;
	
//	@Test
//	public void testSelectLogin() {
//		int USER_ID = 25;
//		UserVO vo = usermapper.selectLogin(USER_ID);
//	}
//	@Test
//	public void testFindIdByEmail() {
//		String EMAIL = "test@test.com";
//		usermapper.findIdByEmail(EMAIL);
//	}
//	@Test
//	public void testFindIdByPhone() {
//		String PHONE = "12345678";
//		usermapper.findIdByPhone(PHONE);
//	}
//	@Test
//	public void testExistUserByEmail() {
//		String USERNAME = "linwee";
//		String EMAIL = "test@test.com";
//		usermapper.existUserByEmail(USERNAME, EMAIL);
//	}
//	@Test
//	public void testExistUserByPhone() {
//		String USERNAME = "linwee";
//		String PHONE = "12345678";
//		usermapper.existUserByPhone(USERNAME, PHONE);
//	}
//	@Test
//	public void testUpdatePw() {
//		UserVO vo = new UserVO();
//		vo.setUSERNAME("LILI1357");
//		vo.setPASSWORD("LIN3333");
//		usermapper.updatePw(vo);
//	}
//	@Test
//	public void testCountByUsername() {
//		String USERNAME = "linwee";
//		usermapper.countByUsername(USERNAME);
//	}
//	@Test
//	public void testInsert() {
//		UserVO vo = new UserVO();
//		vo.setUSER_ID(9);
//		vo.setUSERNAME("hariri");
//		vo.setPASSWORD("nari3333");
//		vo.setNAME("하리");
//		vo.setEMAIL("hari@email.com");
//		vo.setPHONE(24682468);
//		usermapper.insert(vo);
//	}
}
