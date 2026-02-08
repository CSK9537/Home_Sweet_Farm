package org.joonzis.chatting.controller;

import org.joonzis.chatting.dto.ChatSendDTO;
import org.joonzis.chatting.service.ChatService;
import org.joonzis.chatting.vo.MsgVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private ChatService chatService;
    

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(ChatSendDTO dto) {
        System.out.println("WS HIT");
        MsgVO msgVO = new MsgVO();
        msgVO.setSender_id(dto.getSender_id());
        msgVO.setContent(dto.getContent());

        MsgVO savedMsg = chatService.sendMessage(
            dto.getSender_id(),
            dto.getReceiver_id(),
            msgVO
        );

        messagingTemplate.convertAndSend(
            "/topic/room." + msgVO.getRoom_id(),
            savedMsg
        );
    }
}
