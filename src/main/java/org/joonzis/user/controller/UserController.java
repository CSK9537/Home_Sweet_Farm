package org.joonzis.user.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.joonzis.user.service.UserService;
import org.joonzis.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import lombok.extern.log4j.Log4j;

@Log4j
@Controller
@RequestMapping("/user")
public class UserController {
	
	@Autowired
	private UserService uservice;

	// 회원가입 화면
	@GetMapping("/join")
	public String joinForm() {
		return "user/JoinUser";
	}
	
	// 회원가입 처리
	@PostMapping("/join") 
	public String joinProcess(
			UserVO vo, Model model,
			@RequestParam(value ="aspectNames", required=false)String aspectNames,
			@RequestParam(value ="brith_date_js", required=false) String brith_date_js) {
	    try {
	    	// yyyy-MM-dd 형식의 문자열을 java.sql.Date로 변환
			if (brith_date_js != null && !brith_date_js.isEmpty()) {
		        vo.setBrith_date(java.sql.Date.valueOf(brith_date_js));
		    }
			uservice.insert(vo, aspectNames);
			return "user/JoinSuccess";
		} catch (Exception e) {
			model.addAttribute("msg", "회원가입 실패");
			return "user/JoinUser"; //회원가입 화면으로 다시 돌아감
		}
	}
	
	// 로그인 화면
	@GetMapping("/login")
	public String loginForm(HttpServletRequest request,
					HttpSession session) {
		
		//이미 로그인 상태면 홈으로 이동
		if(session.getAttribute("loginUser") != null) {
			return "redirect:/";
		}
		//*자동 로그인 시, 쿠키 필요함
		Cookie[] cookies = request.getCookies();//쿠키들 배열 처리
		if(cookies != null) {
			for (Cookie c : cookies) { //쿠키 목록 확인
				if("rememberId".equals(c.getName())) {//rememberId: 자동 로그인용 쿠키 이름
					String username = c.getValue();//쿠키 값 가져옴
					UserVO vo = uservice.findByUsername(username);//DB에서 사용자 조회
					if(vo != null) {//vo에 유저 있음 자동 로그인
						session.setAttribute("loginUser", vo);
						return "redirect:/";//로그인 완료 시 홈으로 이동
					}
				}
			}
		}
		return "user/login";
	}
	
	// 로그인 처리
	@PostMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public ResponseEntity<Map<String, Object>> loginProcess(@RequestBody Map<String, String> loginData,
															HttpSession session, 
															HttpServletResponse response) {
		
		String username = loginData.get("username");
		String password = loginData.get("password");
		String rememberMe = loginData.getOrDefault("rememberMe", "N"); // 값이 없으면 "N"
		
		Map<String, Object> result = new HashMap<>();
		
		UserVO vo = uservice.login(username, password);
		
		if (vo == null) {
			result.put("success", false);
			return ResponseEntity.ok(result);
		}
		
		// 로그인 성공 시
		session.setAttribute("loginUser", vo);
		
		if ("Y".equals(rememberMe)) { 
			Cookie c = new Cookie("rememberId", username);
			c.setMaxAge(60 * 60 * 24 * 30);
			c.setPath("/"); 
			response.addCookie(c);
		} else {
			Cookie c = new Cookie("rememberId", "");
			c.setMaxAge(0);
			c.setPath("/");
			response.addCookie(c);
		}
		
		result.put("success", true);
		result.put("redirectUrl", "/");
		return ResponseEntity.ok(result);
	}

	
	// 마이페이지 이동
	@GetMapping("/mypage")
	public String moveMypage() {
		return "user/Mypage";
	}
	
	// 로그아웃
	@GetMapping("/logout")
	public String logout(HttpSession session,
			HttpServletResponse response) {
		
		//로그아웃 후 쿠키 삭제
		Cookie c = new Cookie("rememberId", "");
		c.setMaxAge(0);
		c.setPath("/");
		response.addCookie(c);
		
		session.invalidate();//세션 종료
		
		return "redirect:/";
	}
	
	// 회원 탈퇴
	@PostMapping("/delete")//url 입력하면(즉, get방식으로 하면) 허용되지 않는 메소드(405)뜸
	public String delete(UserVO vo, HttpSession session) {
		
		uservice.delete(vo);
		
		session.invalidate();//탈퇴 후 세션 제거
		
		return "redirect:";
	}
	
	// 아이디 중복 확인
	@GetMapping(value = "/checkId", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Map<String, Boolean> checkId(@RequestParam("username") String username) {
		     boolean isDuplicate = uservice.isIdDuplicate(username.trim());
		     return Collections.singletonMap("duplicate", isDuplicate);
		    }
	
	// 이메일 중복 확인
	@GetMapping(value = "/checkEmail", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Map<String, Boolean> checkEmail(@RequestParam("email") String email) {
		     boolean isDuplicate = uservice.isEmailDuplicate(email.trim());
		     return Collections.singletonMap("duplicate", isDuplicate);
		    }
		 
	/*
	 * 아이디 찾기, 비밀번호 찾기
	 * */
	

	
	//2)비밀번호 찾기 대상 확인(아이디+이메일)
	@GetMapping(value="/findPw/email", 
	produces = "text/plain; charset= UTF-8") 
	@ResponseBody
	public String checkPwTarget(@RequestParam String username, 
									@RequestParam String email) {
		int exists = uservice.existUserByEmail(username, email);
		return exists == 1 ? "OK" : "NOT_FOUND";
	}

	//6)비밀번호 재설정(아이디 + 이메일 + 새 비번)
	@GetMapping(value="/find-pw/reset", 
	produces = "text/plain; charset= UTF-8")
	public String resetPw(UserVO vo) {
		int exists = uservice.existUserByEmail(vo.getUsername(), vo.getEmail());
		if(exists != 1)
	    return "NOT_FOUND";
	    uservice.resetPw(vo);
		return "OK";
	}

	//7)아이디 중복체크
	@GetMapping("/id-check") //url예시: http://localhost:8081/user/id-check?username=linwee
	@ResponseBody
	public boolean idCheck(@RequestParam String username) {
		return uservice.isIdDuplicate(username);
	}
	
	@GetMapping("/me")
	@ResponseBody
	public UserVO getCurrentUser(HttpSession session) {
	    UserVO loginUser = (UserVO) session.getAttribute("loginUser");
	    if (loginUser == null) {
	        throw new RuntimeException("로그인 필요");
	    }
	    return loginUser;
	}
	
	
	/*
	 * 프로필
	 * */
	//1)공개형 프로필
	@GetMapping("/profile/{userId}") //url예시: http://localhost:8081/user/profile/65
	public String publicProfile(@PathVariable int userId, Model model) {
		// UserDTO profile =
		uservice.selectPublicProfile(userId);
		return "userTest/publicProfile";
		}
	}
