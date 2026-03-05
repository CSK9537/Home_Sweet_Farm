package org.joonzis.qna.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class QnaAnswerDTO {
	private int board_id;
	private int user_id;
	private int like_cnt;
	private int reply_cnt;
	private Integer category_id;
	private String title;
	private String content;
	private String writer;
	private Date reg_date;
	private Date update_date;
	
	private String is_selected; // "Y"/"N"으로 채택 여부를 확인
}
