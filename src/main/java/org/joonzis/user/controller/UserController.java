package org.joonzis.user.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.joonzis.user.dto.UserDTO;
import org.joonzis.user.service.UserService;
import org.joonzis.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
	@GetMapping("/JoinUser")
	public String joinForm() {
		return "user/JoinUser";
	}
	
	@PostMapping("/JoinUser") 
	public String joinProcess(
			UserVO vo, 
			@RequestParam(value ="aspectNames", required=false)String aspectNames,
			@RequestParam(value ="brith_date_js", required=false) String brith_date_js, Model model) {
	    try {
	    	// yyyy-MM-dd 형식의 문자열을 java.sql.Date로 변환
			if (brith_date_js != null && !brith_date_js.isEmpty()) {
		        vo.setBrith_date(java.sql.Date.valueOf(brith_date_js));
		    }
			uservice.insert(vo, aspectNames);
			return "redirect:/user/login";
		} catch (Exception e) {
			model.addAttribute("vo", vo);
			return "user/JoinUser"; //회원가입 화면으로 다시 돌아감
		}
	}
	
	
	
	//3)로그인 화면
	@GetMapping("/login")
	public String loginForm() {
		return "user/login";
	}
	
	//4)로그인 처리
	@PostMapping("/login")
	public String loginProcess(@RequestParam String username,
								@RequestParam String password,
								HttpSession session, Model model) {
		UserVO vo = uservice.login(username, password);
		if (vo == null) {
			model.addAttribute("msg", "로그인 실패");
			return "user/login";
		}
			session.setAttribute("loginUser", vo);
			return "redirect:/";
		}
	
	//5)로그아웃
	@GetMapping("/logout")
	public String logout(HttpSession session) {
		session.invalidate();
		return "redirect:/";
	}
	
	//6)회원 탈퇴
	@PostMapping("/delete")//url 입력하면(즉, get방식으로 하면) 허용되지 않는 메소드(405)뜸
	public String delete(UserVO vo, HttpSession session) {
		
		uservice.delete(vo);
		
		session.invalidate();//탈퇴 후 세션 제거
		
		return "redirect:";
	}
	
	
	//아이디 중복 체크
		@GetMapping(value="/checkId", produces = "application/json")
		@ResponseBody
		public Map<String, Boolean> 
		checkId(@RequestParam String username) 
		{
		    boolean isDuplicate = 
		    uservice.isIdDuplicate(username);
		    return Map.of("duplicate", isDuplicate);
		}
	
	
	//1)화면요청용 컨트롤러
		@GetMapping("/findId")
		public String findIdForm() {
			return "/user/findId";
		}
		
		@GetMapping("/findPw")
		public String findPwForm() {
			return "/user/findPw";
		}

	//2)아이디 찾기(이메일)-비동기 방식
	@GetMapping("/findId/email")//url예시: http://localhost:8081/user/find-id/email?email=test@test.com
	@ResponseBody
	public String findIdByEmail(@RequestParam String email) {
		return uservice.findIdByEmail(email);
	}
	
	//3)아이디 찾기(전화번호)
	@GetMapping("/findId/phone") //url예시: http://localhost:8081/user/find-id/phone?phone=13571357
	@ResponseBody
	public String findIdByPhone(@RequestParam String phone) {
		return uservice.findIdByPhone(phone);
	}
	
	//4)비밀번호 찾기 대상 확인(이메일)
	@GetMapping("/findPw/email") //url예시: http://localhost:8081/user/find-pw/email?username=linwee&email=test@test.com
	@ResponseBody
	public int existByEmail(@RequestParam String username, 
									@RequestParam String email) {
		return uservice.existUserByEmail(username, email);
	}
	
	//5)비밀번호 찾기 대상 확인(전화번호)
	@GetMapping("/findPw/phone") //url예시: http://localhost:8081/user/find-pw/phone?username=linwee&phone=12345678
	@ResponseBody
	public int existByPhone(@RequestParam String username,
							@RequestParam String phone) {
		return uservice.existUserByPhone(username, phone);
	}

	//6)비밀번호 재설정
	// 비밀번호 재설정 화면 보여주기
	@GetMapping("/find-pw/reset")
	public String resetPwPage() {
	    return "/userTest/resetPw"; // resetPw.jsp
	}

	// 실제 비밀번호 변경 처리
	@PostMapping("/find-pw/reset")
	public String resetPw(UserVO vo) {
		uservice.updatePw(vo);
		return "redirect:/user/login";
	}
	//7)아이디 중복체크
	@GetMapping("/id-check") //url예시: http://localhost:8081/user/id-check?username=linwee
	@ResponseBody
	public boolean idCheck(@RequestParam String username) {
		return uservice.isIdDuplicate(username);
	}
	//8)공개형 프로필
	@GetMapping("/profile/{userId}") //url예시: http://localhost:8081/user/profile/65
	public String publicProfile(@PathVariable int userId, Model model) {
		UserDTO profile =
		uservice.selectPublicProfile(userId);
		return "userTest/publicProfile";
	}
	}
