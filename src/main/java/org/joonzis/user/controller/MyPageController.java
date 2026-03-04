package org.joonzis.user.controller;

import java.util.List;

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
import org.springframework.web.bind.annotation.RequestMapping;
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
}
