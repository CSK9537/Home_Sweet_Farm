package org.joonzis.user.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import org.joonzis.user.dto.UserDTO;
import org.joonzis.user.mapper.UserMapper;
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
	
	@Autowired
	private UserMapper usermapper;
	
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
//	@Test
//	public void testConfirmEvent() {
//		UserVO vo = new UserVO();
//		String uname = "jinny_"+
//		System.currentTimeMillis();
//		vo.setUsername(uname);
//		vo.setPassword("ni3333");
//		vo.setConfirmPassword("ni3333");//비밀번호 확인
//		vo.setNickname("nini");
//		vo.setName("jinny");
//		vo.setEmail("nini@email.com");
//		vo.setPhone(24681618);
//		vo.setProfile_filename("nini file");
//		vo.setBrith_date(java.sql.Date.valueOf("1997-11-23"));
//		vo.setConfirm_service(1);//서비스 이용약관 동의(필수)
//		vo.setConfirm_userinfo(1);//개인정보 처리방침 동의(필수)
//		vo.setConfirm_event(1); //마케팅 수신 동의(선택)
//		//1)서비스 insert
//		uservice.insert(vo);
//		//2)mapper로 다시 조회
//		UserVO saved =
//			usermapper.selectByUsername(uname);
//		//3)출력해서 확인
//		System.out.println("서비스약관 동의: " + saved.getConfirm_service());
//		System.out.println("개인정보 동의: " + saved.getConfirm_userinfo());
//		System.out.println("마케팅 동의: " + saved.getConfirm_event());
//	}
//	
//	@Test
//	public void testPublicProfile() {
//		int user_id = 2;
//		UserDTO dto = 
//		uservice.selectPublicProfile(user_id);
//		
//		assertNotNull(dto);
//		assertEquals(user_id, dto.getUser_id());
//	}

}
