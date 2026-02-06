package org.joonzis.chatting.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// 웹소켓 입력용 
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatSendDTO {
	private int sender_id;
	private int receiver_id;
	private String content;
}
