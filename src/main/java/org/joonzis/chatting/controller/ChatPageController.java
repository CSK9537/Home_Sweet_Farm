package org.joonzis.chatting.controller;

import javax.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ChatPageController {

    @GetMapping("/chat")
    public String goChatPage(HttpSession session) {
        // 1. "loginUser"라는 이름으로 세션 객체를 가져옵니다.
        org.joonzis.user.vo.UserVO loginUser = (org.joonzis.user.vo.UserVO) session.getAttribute("loginUser");
        
        System.out.println("[DEBUG] 현재 세션 객체: " + loginUser);
        
        if (loginUser == null) {
            System.out.println("[DEBUG] 세션 없음 -> 로그인 페이지로 리다이렉트");
            return "redirect:/user/login"; 
        }
        
        // 2. 로그인 성공 시, 기존 채팅 로직들이 "user_id"라는 이름을 기대하고 있으므로
        // 객체에서 ID만 추출해서 세션에 추가로 구워주면 편리합니다.
        session.setAttribute("user_id", loginUser.getUser_id());
        
        System.out.println("[DEBUG] 세션 존재 (ID: " + loginUser.getUser_id() + ") -> 채팅 페이지 입장");
        return "chat/chat"; 
    }
}