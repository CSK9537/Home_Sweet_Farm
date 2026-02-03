package org.joonzis.chatting.vo;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomVO {
	private int room_id;				// 채팅방 식별 번호
	private LocalDateTime created_at;	// 채팅방 생성 시간
	private int user1_id;				// 유저1 유저 식별 번호
	private int user2_id;				// 유저2 유저 식별 번호
}
