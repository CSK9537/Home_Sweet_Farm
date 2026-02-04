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
//		//id가 중복 시 ('이미 존재하는 아이디입니다')
//		UserVO vo = new UserVO();
//		vo.setUsername("haribo12");
//		vo.setPassword("ribo3333");
//		vo.setConfirmPassword("ribo3333");//비밀번호 확인(없을 시 '비밀번호 확인이 일치하지 않습니다')
//		vo.setNickname("ribo");
//		vo.setName("haribo");
//		vo.setEmail("ribo@email.com");
//		vo.setPhone(13572468);
//		vo.setProfile_filename("haribo file");
//		vo.setBrith_date(java.sql.Date.valueOf("1998-08-20"));
//		uservice.insert(vo);
//	}
//	@Test
//	public void testSelectLogin() {
//		int user_id = 3;
//		UserVO vo = uservice.selectLogin(user_id);
//	}
//	@Test
//	public void testFindIdByEmail() {
//		String email = "test@test.com";
//		uservice.findIdByEmail(email);
//	}
//	@Test
//	public void testFindIdByPhone() {
//		String phone = "12345678";
//		uservice.findIdByPhone(phone);
//	}
//	@Test
//	public void testExistUserByEmail() {
//		String username = "linwee";
//		String email = "test@test.com";
//		uservice.existUserByEmail(username, email);
//	}
//	@Test
//	public void testExistUserByPhone() {
//		String username = "linwee";
//		String phone = "12345678";
//		uservice.existUserByPhone(username, phone);
//	}
//	@Test
//	public void testUpdatePw() {
//		UserVO vo = new UserVO();
//		vo.setUsername("LILI1357");
//		vo.setPassword("LIN3333");
//		uservice.updatePw(vo);
//	}

//	@Test
//	public void testIsIdDuplicate() {
//		String username = "helen11";
//		boolean dup = 
//		uservice.isIdDuplicate(username);
//		assertTrue(dup);	
//	}


}
