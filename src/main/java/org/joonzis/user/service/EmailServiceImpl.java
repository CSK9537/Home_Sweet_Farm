package org.joonzis.user.service;

import java.security.SecureRandom;

import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import lombok.extern.log4j.Log4j;

@Log4j
@Service
public class EmailServiceImpl implements EmailService{

	@Autowired
	private JavaMailSender mailSender;
	
	@Override
	public String createRandomNumber() {
		SecureRandom sr = new SecureRandom();
		StringBuilder code = new StringBuilder();
		for (int i = 0; i < 6; i++) {
			code.append(sr.nextInt(10)); //0~9까지 숫자를 6번 붙여서 코드 생성
		}
		return code.toString();
	}
	@Override
	public boolean sendEmail(String email, String code) throws Exception {
		if(email.equals("") || email == null) {
			log.warn(this.getClass().getName() + "이메일이 유효하지 않음 : " +  email);
			return false;
		}
		if(code.equals("") || code == null) {
			log.warn(this.getClass().getName() + "코드가 유효하지 않음 : " + code);
			return false;
		}
		MimeMessage msg = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");
		helper.setFrom("jeonghogyun535@gmail.com");
		helper.setTo(email);
		helper.setSubject("Home_Sweet_Farm 이메일 인증 ");
		helper.setText("이메일 인증 코드 : " + code);
		
		mailSender.send(msg);
		return true;
	}
}
