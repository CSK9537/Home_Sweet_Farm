package org.joonzis.user.mapper;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import org.joonzis.user.dto.UserDTO;
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
//	public void testInsert() {
//		UserVO vo = new UserVO();
//		vo.setUsername("jinny12");
//		vo.setPassword("ni3333");
//		vo.setNickname("nini");
//		vo.setName("jinny");
//		vo.setEmail("nini@email.com");
//		vo.setPhone(24681618);
//		vo.setProfile_filename("nini file");
//		vo.setBrith_date(java.sql.Date.valueOf("1997-11-23"));
//		int result = usermapper.insert(vo);
//	}
	
//	@Test
//	public void testSelectLogin() {
//		int user_id = 25;
//		UserVO vo = usermapper.selectLogin(user_id);
//	}
//	@Test
//	public void testFindIdByEmail() {
//		String email = "test@test.com";
//		usermapper.findIdByEmail(email);
//	}
//	@Test
//	public void testFindIdByPhone() {
//		String phone = "12345678";
//		usermapper.findIdByPhone(phone);
//	}
//	@Test
//	public void testExistUserByEmail() {
//		String username = "linwee";
//		String email = "test@test.com";
//		usermapper.existUserByEmail(username, email);
//	}
//	@Test
//	public void testExistUserByPhone() {
//		String username = "linwee";
//		String phone = "12345678";
//		usermapper.existUserByPhone(username, phone);
//	}
//	@Test
//	public void testUpdatePw() {
//		UserVO vo = new UserVO();
//		vo.setUsername("LILI1357");
//		vo.setPassword("LIN3333");
//		usermapper.updatePw(vo);
//	}

//	@Test
//	public void testCountByUsername() {
//		String username = "linwee";
//		usermapper.countByUsername(username);
//	}
//	
//	@Test
//	public void testConfirmEvent() {
//		UserVO vo = new UserVO();
//		String uname = "jinny_"+
//		System.currentTimeMillis();
//		vo.setUsername(uname);
//		vo.setPassword("ni3333");
//		vo.setNickname("nini");
//		vo.setName("jinny");
//		vo.setEmail("nini@email.com");
//		vo.setPhone(24681618);
//		vo.setProfile_filename("nini file");
//		vo.setBrith_date(java.sql.Date.valueOf("1997-11-23"));
//		vo.setConfirm_service(1);//서비스 이용약관 동의(필수)
//		vo.setConfirm_userinfo(1);//개인정보 처리방침 동의(필수)
//		vo.setConfirm_event(1);//마케팅정보 수신동의(선택)
//		usermapper.insert(vo);
//		UserVO saved =
//		usermapper.selectByUsername(uname);
//			System.out.println("서비스약관 동의: " + saved.getConfirm_service());
//			System.out.println("개인정보 동의: " + saved.getConfirm_userinfo());
//			System.out.println("마케팅 동의: " + saved.getConfirm_event());
//	}
//	
//	@Test
//	public void testSelectPublicProfile() {
//		int user_id = 65;
//		UserDTO dto = usermapper.selectPublicProfile(user_id);
//		
//		assertNotNull(dto);
//	}
//	@Test
//	public void testGetReplyCnt() {
//		int user_id = 65;
//		int cnt = 
//		usermapper.getReplyCnt(user_id);
//		System.out.println(cnt);
//	}
//	@Test
//	public void testGetViewCnt() {
//		int user_id = 65;
//		int cnt =
//		usermapper.getViewCnt(user_id);
//		assertTrue(cnt >= 0);
//		System.out.println(cnt);
//	}
//	@Test
//	public void testGetIsSelected() {
//		int user_id = 65;
//		int cnt =
//		usermapper.getIsSelected(user_id);
//		
//		assertTrue(cnt >= 0);
//		System.out.println(cnt);
//	}

}
