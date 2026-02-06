package org.joonzis.user.controller;

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
	@GetMapping("/join")
	public String joinForm() {
		return "userTest/join";
	}
	
	//2)회원가입 처리
	@PostMapping("/join")
	public String joinProcess(UserVO vo) {
		uservice.insert(vo);
		return "redirect:/userTest/login";
		}
	
	//3)로그인 화면
	@GetMapping("/login")
	public String loginForm() {
		return "/userTest/login";
	}
	
	//4)로그인 처리
	@PostMapping("/login")
	public String loginProcess(@RequestParam int user_id,
								HttpSession session, Model model) {
		UserVO vo = uservice.selectLogin(user_id);
		if (vo == null) {
			model.addAttribute("msg", "로그인 실패");
			return "userTest/login";
		}
			model.addAttribute("loginUser", vo);
			return "redirect:/";
		}
	
	//5)회원 탈퇴
	@PostMapping("/delete")
	public String delete(UserVO vo, HttpSession session) {
		
		uservice.delete(vo);
		
		session.invalidate();//탈퇴 후 세션 제거
		
		return "redirect:";
	}
	
	/*
	 * 아이디&비밀번호 찾기
	 * */
	
	//1)화면요청용 컨트롤러
		@GetMapping("/find-id")
		public String findIdForm() {
			return "/userTest/findId";
		}
		@GetMapping("/find-pw")
		public String findPwForm() {
			return "/userTest/findPw";
		}
	
	//2)아이디 찾기(이메일)
	@GetMapping("/find-id/email")
	@ResponseBody
	public String findIdByEmail(@RequestParam String email) {
		return uservice.findIdByEmail(email);
	}
	
	//3)아이디 찾기(전화번호)
	@GetMapping("/find-id/phone")
	@ResponseBody
	public String findIdByPhone(@RequestParam String phone) {
		return uservice.findIdByPhone(phone);
	}
	
	//4)비밀번호 찾기 대상 확인(이메일)
	@GetMapping("/find-pw/email")
	@ResponseBody
	public int existByEmail(@RequestParam String username, 
									@RequestParam String phone) {
		return uservice.existUserByEmail(username, phone);
	}
	
	//5)비밀번호 찾기 대상 확인(전화번호)
	@GetMapping("/find-pw/phone")
	@ResponseBody
	public int existByPhone(@RequestParam String username,
							@RequestParam String phone) {
		return uservice.existUserByPhone(username, phone);
	}

	//6)비밀번호 재설정
	@PostMapping("/find-pw/reset")
	public String resetPw(UserVO vo) {
		uservice.updatePw(vo);
		return "redirect:/user/login";
	}
	//7)아이디 중복체크
	@GetMapping("/id-check")
	@ResponseBody
	public boolean idCheck(@RequestParam String username) {
		return uservice.isIdDuplicate(username);
	}
	//8)공개형 프로필
	@GetMapping("/profile/{userId}")
	public String publicProfile(@PathVariable int userId, Model model) {
		UserDTO profile =
		uservice.selectPublicProfile(userId);
		return "userTest/publicProfile";
	}
	}
