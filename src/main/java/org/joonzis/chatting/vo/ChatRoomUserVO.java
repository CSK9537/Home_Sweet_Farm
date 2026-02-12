package org.joonzis.chatting.vo;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomUserVO {
	private int user_id;				// 사용자 식별 번호
	private int room_id;				// 채팅방 식별 번호
	private Long last_read_msg_id;			// 마지막을 읽은 메세지 번호
	private Date joined_at;	// 채팅방 참여 시점
	private String is_active;				// 채팅방 활성화/비활성화
}
