package org.joonzis.user.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.joonzis.community.dto.CommunityPostCardDTO;
import org.joonzis.community.service.CommunityMainService;
import org.joonzis.community.vo.ReplyVO;
import org.joonzis.user.service.MypageService;
import org.joonzis.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.log4j.Log4j;

@Log4j
@RestController
@RequestMapping("/user/myPage")
public class MyPageController {

	@Autowired
	MypageService mpService;
	@Autowired
	CommunityMainService cmService;
	
	// 사용자가 작성한 글
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@GetMapping(
			value = "/posts",
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<CommunityPostCardDTO>> writedPosts(
			HttpSession session){
		List<CommunityPostCardDTO> postList = null;
		
		UserVO user = (UserVO)session.getAttribute("loginUser");
		if(user == null) {
			return new ResponseEntity(HttpStatus.BAD_GATEWAY);
		}
		int user_id = user.getUser_id();
		
		
		// 커뮤니티 서비스에 user_id를 파라미터로 요청 부분 추가 예정!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		
		if(postList != null)
			return new ResponseEntity<List<CommunityPostCardDTO>>(postList, HttpStatus.OK);
		else
			return new ResponseEntity<List<CommunityPostCardDTO>>(HttpStatus.OK);
	}
	
	// 사용자가 작성한 댓글
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@GetMapping(
			value = "/replys" ,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<ReplyVO>> wirtedReplys(
			HttpSession session){
		List<ReplyVO> replyList = null;
		
		UserVO user = (UserVO)session.getAttribute("loginUser");
		if(user == null) {
			return new ResponseEntity(HttpStatus.BAD_GATEWAY);
		}
		int user_id = user.getUser_id();
		
		// 커뮤니티 서비스에 user_id를 파라미터로 요청 부분 추가 예정!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		
		if(replyList != null)
			return new ResponseEntity<List<ReplyVO>>(replyList, HttpStatus.OK);
		else
			return new ResponseEntity<List<ReplyVO>>(HttpStatus.OK);
	}
	
	// 사용자가 작성한 질문
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@GetMapping(
			value = "/questions",
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<CommunityPostCardDTO>> wirteQ(
			HttpSession session){
		List<CommunityPostCardDTO> quesList = null;
		
		UserVO user = (UserVO)session.getAttribute("loginUser");
		if(user == null) {
			return new ResponseEntity(HttpStatus.BAD_GATEWAY);
		}
		int user_id = user.getUser_id();
		
		// 커뮤니티 서비스에 user_id를 파라미터로 요청 부분 추가 예정!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		
		if(quesList != null)
			return new ResponseEntity<List<CommunityPostCardDTO>>(quesList, HttpStatus.OK);
		else
			return new ResponseEntity<List<CommunityPostCardDTO>>(HttpStatus.OK);
	}
	// 사용자가 작성한 답변
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@GetMapping(
			value = "/answers",
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<CommunityPostCardDTO>> writeAn(
			HttpSession session){
		List<CommunityPostCardDTO> answerList = null;
		
		UserVO user = (UserVO)session.getAttribute("loginUser");
		if(user == null) {
			return new ResponseEntity(HttpStatus.BAD_GATEWAY);
		}
		int user_id = user.getUser_id();
		
		// 커뮤니티 서비스에 user_id를 파라미터로 요청 부분 추가 예정!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		
		if(answerList != null)
			return new ResponseEntity<List<CommunityPostCardDTO>>(answerList, HttpStatus.OK);
		else
			return new ResponseEntity<List<CommunityPostCardDTO>>(HttpStatus.OK);
	}
	/*
	 * 마이페이지
	 * */
	//마이페이지 수정-닉네임, 주소
	@PostMapping("/update")
	@ResponseBody
	public String updateMypage(@RequestParam(required=false) String nickname, 
								@RequestParam(required=false) String address,
								HttpSession session) {
		
		UserVO loginUser = (UserVO)session.getAttribute("loginUser");
		if(loginUser == null) return "no-session";
		
		int userId = loginUser.getUser_id();
		
		UserVO vo = new UserVO();
		vo.setUser_id(userId);
		vo.setNickname(nickname);
		vo.setAddress(address);
		
		mpService.updateMypage(vo);
		
		return "ok";
	}
	
	//마이페이지 수정-관심사 검색
	@GetMapping("/hashtag")
	@ResponseBody
	public List<Map<String,Object>> search(@RequestParam String keyword){
		return mpService.searchHashtag(keyword);
	}
	
	//마이페이지 수정-관심사 선택(저장)
	@PostMapping("/aspect")
	@ResponseBody
	public Map<String,Object> saveAspect(HttpSession session,
										@RequestParam("hashtagId") int hashtagId){
		Map<String, Object> res = new HashMap<>();

	    
		UserVO loginUser = (UserVO) session.getAttribute("loginUser");
	    if (loginUser == null) {
	        res.put("ok", false);
	        res.put("msg", "no-session");
	        return res;
	    }

	    int userId = loginUser.getUser_id();

	    // 1) 중복이면 0, 새로 추가면 1 반환하도록 구현 추천
	    int inserted = mpService.insertUserAspect(userId, hashtagId);

	    res.put("ok", true);
	    res.put("inserted", inserted); // 1=추가됨, 0=이미있음(무시)
	    return res;	
	}
	
}
