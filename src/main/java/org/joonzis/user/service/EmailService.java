package org.joonzis.user.service;

public interface EmailService {
	public String createRandomNumber(); 						// 랜덤 숫자 생성
	public boolean sendEmail(String email, String code) throws Exception; 	// 이메일 보내기
}
