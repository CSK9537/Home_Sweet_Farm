package org.joonzis.user.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.joonzis.user.service.EmailService;
import org.joonzis.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.log4j.Log4j;

@Log4j
@RestController
@RequestMapping("/email")
public class EmailAuthController {
	@Autowired
	private EmailService emailer;
	@Autowired
	private UserService uservice;
	
	@PostMapping(
			value = "/send",
			produces = "text/plain;charset=UTF-8")
	public ResponseEntity<String> sendEmail(
			@RequestBody String email,
			HttpSession session){
		String code = emailer.createRandomNumber();
		log.info("생성된 코드 : " + code);
		log.info("전달 받은 이메일 : " + email);
		try {
			if(!emailer.sendEmail(email, code)) throw new RuntimeException("이메일 발송에 실패함");
			session.setAttribute("code", code);
			session.setAttribute("authEmail", email);
			return new ResponseEntity<String>(HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@PutMapping(
			value = "/check/{userInput}",
			produces = "application/json;charset=UTF-8")
	public ResponseEntity<Map<String, String>> checkCode(
	        @PathVariable("userInput") String userInput,
	        HttpSession session) {
	    
	    Map<String, String> result = new HashMap<>();
	    String code;
	    String email;
	    
	    try {
	        code = session.getAttribute("code").toString();
	        email = session.getAttribute("authEmail").toString();
	    } catch (NullPointerException e) {
	        log.error(e.getMessage());
	        log.error("세션에 코드가 없음, 올바르지 않는 과정의 요청");
	        result.put("message", "올바르지 않는 요청");
	        return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
	    }
	    
	    if (userInput.equals(code)) {
	        session.setAttribute("emailVerifiedStatus", "true");
	        
	        String userId = uservice.findIdByEmail(email);
	        String userPw = "";
	        
	        result.put("message", "verified");
	        result.put("userId", userId);
	        result.put("userPw", userPw);
	        
	        return new ResponseEntity<>(result, HttpStatus.ACCEPTED);            
	    } else {
	        log.info("유저의 입력 : " + userInput);
	        log.info("세션에 저장된 코드 : " + code);
	        
	        result.put("message", "reject");
	        return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
	    }
	}
	
	@PostMapping(value = "/clearSession")
	public ResponseEntity<String> clearSession(HttpSession session) {
		
		session.removeAttribute("authEmail");
		session.removeAttribute("code");
		session.removeAttribute("emailVerifiedStatus");
		
		return new ResponseEntity<>("cleared", HttpStatus.OK);
	}
}
