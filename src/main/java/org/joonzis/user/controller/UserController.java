package org.joonzis.user.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.joonzis.user.dto.UserDTO;
import org.joonzis.user.service.UserService;
import org.joonzis.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
	
	/*
	 * 회원가입&로그인, 탈퇴
	 * */
	
	//1)회원가입 화면
	@GetMapping("/join")
	public String joinForm() {
		return "user/JoinUser";
	}
	
	//2)회원가입 처리
	@PostMapping("/join") 
	public String joinProcess(
			UserVO vo, HttpSession session,
			@RequestParam(value ="aspectNames", required=false)String aspectNames,
			@RequestParam(value ="brith_date_js", required=false) String brith_date_js, Model model) {
	    try {
	    	// yyyy-MM-dd 형식의 문자열을 java.sql.Date로 변환
			if (brith_date_js != null && !brith_date_js.isEmpty()) {
		        vo.setBrith_date(java.sql.Date.valueOf(brith_date_js));
		    }
			uservice.insert(vo, aspectNames);
			session.setAttribute("msg", "회원가입 완료");
			return "user/JoinSuccess";
		} catch (Exception e) {
			model.addAttribute("msg", "회원가입 실패");
			model.addAttribute("vo", vo);
			return "user/JoinUser"; //회원가입 화면으로 다시 돌아감
		}
	}
	
		
	//3)로그인 화면
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
	
	//4)로그인 처리
	@PostMapping("/login")
	public String loginProcess(@RequestParam String username,
								@RequestParam String password,
								@RequestParam(defaultValue = "N") String rememberMe,//체크 안 해도 에러 나지 않게 처리
								HttpSession session, 
								HttpServletResponse response,//서버-> 브라우저로 보냄(쿠키 등)
								Model model) {
		
		UserVO vo = uservice.login(username, password);
		if (vo == null) {
			model.addAttribute("loginErrorMsg", "아이디 또는 비밀번호가 올바르지 않습니다.");
		return "user/login";
		}
		session.setAttribute("loginUser", vo);
		
		//체크하면 쿠키 저장(30일):자동 로그인
		if(rememberMe != null) {
			Cookie c = new Cookie("rememberId", username);//rememberId:쿠키이름, username:쿠키 값
			c.setMaxAge(60*60*24*30); //유효기간 30일
			c.setPath("/"); //경로
			response.addCookie(c);
		}
		return "redirect:/";
	}
	
	//5)로그아웃
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
	
	//6)회원 탈퇴
	@PostMapping("/delete")//url 입력하면(즉, get방식으로 하면) 허용되지 않는 메소드(405)뜸
	public String delete(UserVO vo, HttpSession session) {
		
		uservice.delete(vo);
		
		session.invalidate();//탈퇴 후 세션 제거
		
		return "redirect:";
	}
	
	//7)아이디 중복 확인
	@GetMapping(value = "/checkId", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Map<String, Boolean> checkId(@RequestParam("username") String username) {
		     boolean isDuplicate = uservice.isIdDuplicate(username.trim());
		     return Collections.singletonMap("duplicate", isDuplicate);
		    }
	
	//8)이메일 중복 확인
	@GetMapping(value = "/checkEmail", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Map<String, Boolean> checkEmail(@RequestParam("email") String email) {
		     boolean isDuplicate = uservice.isEmailDuplicate(email.trim());
		     return Collections.singletonMap("duplicate", isDuplicate);
		    }
		 
	/*
	 * 아이디 찾기, 비밀번호 찾기
	 * */
	
	//1)아이디 찾기(이메일)-비동기 방식
	@GetMapping(value="/findId/email", 
	produces = "text/plain; charset=UTF-8")
	@ResponseBody
	public String findIdByEmail(@RequestParam String name,
								@RequestParam String email) {
		String id = uservice.findIdByEmail(name, email);
		return(id == null || id.isBlank()) ? "NOT_FOUND" : id;
	}
	
//	// 2) 이메일 인증코드 체크
//	@PutMapping("/email/check/{code}")
//	@ResponseBody
//	public String checkEmailCode(@PathVariable String code,
//	                             HttpSession session) {
//
//	    String savedCode = (String) session.getAttribute("emailCode");
//
//	    // 세션에 코드 없으면 실패
//	    if(savedCode == null) {
//	        return "fail";
//	    }
//
//	    // 코드 비교
//	    if(savedCode.equals(code)) {
//	        return "verified";
//	    }
//
//	    return "fail";
//	}
	
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
