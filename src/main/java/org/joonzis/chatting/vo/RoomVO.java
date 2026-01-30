package org.joonzis.chatting.vo;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomVO {
	private int room_id, receiver_id, sender_id;
	private LocalDateTime created_at;
}
