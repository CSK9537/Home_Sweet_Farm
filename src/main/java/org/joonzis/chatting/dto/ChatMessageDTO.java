package org.joonzis.chatting.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageDTO {// 메세지 출력
	private Long msg_id;
	private int room_id;				
	private int sender_id;			
	private String content;
	private String msg_type;			
	private String original_name;		
	private String saved_name;
	private String file_path;			
	private int file_size;
	private Date created_at;
	private String upload_group_id;		// 파일 그룹 아이디
}
