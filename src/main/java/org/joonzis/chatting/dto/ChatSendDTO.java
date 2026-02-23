package org.joonzis.chatting.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatSendDTO {// 웹소켓 입력용 
    private Integer roomId;
    private int senderId;
    private int receiverId;
    private String content;
}
