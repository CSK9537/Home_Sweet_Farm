package org.joonzis.chatting.vo;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MsgVO {
	private Long msg_id;				// 메세지 식별 번호
	private int room_id;				// 채팅방 식별 번호
	private int sender_id;				// 발신자 식별 번호
	private int file_size;				// 파일 크기
	private String content;				// 내용
	private String msg_type;			// 메세지의 타입(텍스트/이미지/파일)
	private String original_name;		// 파일 원본명
	private String saved_name;			// 파일 저장명(UUID)
	private String file_path;			// 파일 경로
	private LocalDateTime created_at;	// 작성 시간
	private char is_active;				// 메세지 활성화/비활성화
}
