package org.joonzis.chatting.controller;

import org.joonzis.chatting.vo.MsgVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(MsgVO msg) {
        // DB 저장 등 처리
        messagingTemplate.convertAndSend("/topic/room." + msg.getRoom_id(), msg);
    }
}
