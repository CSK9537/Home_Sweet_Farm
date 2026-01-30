package org.joonzis.chatting.vo;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MsgVO {
	private Long msg_id;
	private int room_id, sender_id, file_size;
	private String clob, msg_type, original_name, saved_name, file_path;
	private LocalDateTime created_at;
	private char is_active;
}
