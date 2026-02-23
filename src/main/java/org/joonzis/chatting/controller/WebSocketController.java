package org.joonzis.chatting.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.joonzis.chatting.dto.ChatSendDTO;
import org.joonzis.chatting.service.ChatService;
import org.joonzis.chatting.service.MsgService;
import org.joonzis.chatting.vo.MsgVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import lombok.extern.log4j.Log4j;

@Log4j
@Controller
public class WebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private ChatService chatService;
    @Autowired
    private MsgService msgService;
    

    @GetMapping("/chat")
    public String chatPage(
            Integer testUser_id,
            javax.servlet.http.HttpSession session
    ) {

        // 테스트용 로그인 강제 세션 세팅
        if (testUser_id != null) {
            session.setAttribute("user_id", testUser_id);
            log.info("TEST LOGIN user_id = " + testUser_id);
        }

        return "chat/chat";
    }
    


    @MessageMapping("/chat.sendMessage")
    public void sendMessage(ChatSendDTO dto) {

        if(dto == null) return;

        MsgVO msgVO = new MsgVO();
        msgVO.setContent(dto.getContent());

        MsgVO savedMsg = chatService.sendMessage(
            dto.getSenderId(),
            dto.getReceiverId(),
            msgVO
        );
        System.out.println("savedMsg = " + savedMsg);
        Map<String, Object> msgMap = new HashMap<>();
        msgMap.put("msg_id", savedMsg.getMsg_id());
        msgMap.put("room_id", savedMsg.getRoom_id());
        msgMap.put("sender_id", savedMsg.getSender_id());
        msgMap.put("receiver_id", dto.getReceiverId());
        msgMap.put("content", savedMsg.getContent());
        msgMap.put("msg_type", "TEXT");
        msgMap.put("created_at", savedMsg.getCreated_at());

        messagingTemplate.convertAndSend("/topic/room." + savedMsg.getRoom_id(), msgMap);
        messagingTemplate.convertAndSend("/topic/user." + dto.getReceiverId(), msgMap);
        messagingTemplate.convertAndSend("/topic/user." + savedMsg.getSender_id(), msgMap);
    }




}
