package org.joonzis.chatting.controller;

import javax.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ChatPageController {

    @GetMapping("/chat")
    public String goChatPage(
    		@RequestParam(required = false) Integer room_id,
    		@RequestParam(required = false) Integer target_id,
    		@RequestParam(required = false) String target_name,
    		HttpSession session,
    		Model model) {
        org.joonzis.user.vo.UserVO loginUser = (org.joonzis.user.vo.UserVO) session.getAttribute("loginUser");
        
        if (loginUser == null) {
            return "redirect:/user/login"; 
        }
        
        session.setAttribute("user_id", loginUser.getUser_id());
        
        if(room_id !=null) {
        	model.addAttribute("room_id", room_id);
        }else if(target_id != null) {
        	model.addAttribute("room_id", 0);
        	model.addAttribute("target_id", target_id);
        	model.addAttribute("target_name", target_name);
        }
        
        return "chat/chat"; 
    }
}