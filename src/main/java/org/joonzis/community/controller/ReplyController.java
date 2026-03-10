package org.joonzis.community.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.joonzis.community.dto.ReplyDTO;
import org.joonzis.community.service.ReplyService;
import org.joonzis.community.vo.ReplyVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.log4j.Log4j;

@RestController
@RequestMapping("/replies")
@Log4j
public class ReplyController {

    @Autowired
    private ReplyService service;

    // 1. 댓글 등록 (POST)
    @PostMapping("/add")
    public ResponseEntity<String> addReply(@RequestBody ReplyVO vo, HttpSession session) {
        
        // 세션에서 로그인 정보를 직접 가져오는 것이 가장 안전합니다.
        // 만약 세션 속성명이 "loginUser" 라면 해당 객체에서 ID를 추출하세요.
        Object loginUser = session.getAttribute("loginUser"); 
        
        if (loginUser == null) {
            // 로그인이 안 된 경우 401(Unauthorized) 또는 403(Forbidden) 반환
            return new ResponseEntity<>("LOGIN_REQUIRED", HttpStatus.UNAUTHORIZED);
        }

        // VO에 세션의 유저 아이디를 강제로 세팅 (클라이언트가 보낸 값보다 세션 값이 우선)
        // vo.setUser_id(((UserVO)loginUser).getUser_id());

        log.info("댓글 등록 요청자 ID: " + vo.getUser_id());

        return service.register(vo) == 1 
            ? new ResponseEntity<>("success", HttpStatus.OK)
            : new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 2. 대댓글 목록 가져오기 (GET)
    @GetMapping(value = "/child/{parent_id}", produces = "application/json;charset=UTF-8")
    public List<ReplyDTO> getChildReplies(@PathVariable("parent_id") int parent_id) {
        return service.getChildList(parent_id);
    }

    // 3. 댓글 삭제 (DELETE)
    @DeleteMapping("/{reply_id}")
    public ResponseEntity<String> remove(@PathVariable("reply_id") int reply_id, HttpSession session) {
        int user_id = (int) session.getAttribute("loginUserId");
        return service.remove(reply_id, user_id) == 1
            ? new ResponseEntity<>("success", HttpStatus.OK)
            : new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }
}