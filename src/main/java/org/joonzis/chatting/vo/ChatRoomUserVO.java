package org.joonzis.chatting.vo;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomUserVO {
	private int user_id, room_id;
	private Long last_read_msg;
	private LocalDateTime joined_at;
	private char is_active;
}
