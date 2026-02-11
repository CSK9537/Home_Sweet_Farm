package org.joonzis.mail;

import javax.mail.internet.MimeMessage;

import org.joonzis.user.mapper.UserMapperTests;
import org.joonzis.user.service.EmailService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import lombok.extern.log4j.Log4j;

@Log4j
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("file:src/main/webapp/WEB-INF/spring/root-context.xml")
public class MailSendTest {

//	@Autowired
//	private JavaMailSender mailSender;
	
//	@Test
//	public void mailSendTest() {
//		MimeMessage msg = mailSender.createMimeMessage();
//		MimeMessageHelper helper = null;
//		try {
//			helper = new MimeMessageHelper(msg, true, "UTF-8");			
//			helper.setFrom("jeonghogyun535@gmail.com"); //발신자(bean과 동일)
//			helper.setTo("jinjin75767@gmail.com"); // 수신자
//			helper.setSubject("서버 연결 테스트");
//			helper.setText("이 편지는 영국에서 시작되었으며, 행운을 가져다주는 편지입니다. 당신은 이 편지를 7일 안에 지인들에게 보내야하며...");
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//		
//		mailSender.send(msg);
//		log.info("이메일 발송 완료, 확인 바람");
//	}
	
//	@Autowired
//	EmailService service;
//	
//	@Test
//	public void emailServiceTest() {
//		String code = service.createRandomNumber();
//		log.info("랜덤 생성된 코드 :  " + code);
//		
//		try {
//			if(service.sendEmail("jinjin75767@gmail.com", code)) {
//				log.info("이메일 발송 테스트 성공");
//			} else {
//				log.error("이메일 발송 테스트 실패 : 결과값이 false");
//			}
//		} catch (Exception e) {
//			log.error("이메일 발송 테스트 실패 : 예외 발생");
//			e.printStackTrace();
//		}
//	}
	
}
