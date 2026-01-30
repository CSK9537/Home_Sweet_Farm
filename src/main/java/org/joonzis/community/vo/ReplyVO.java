package org.joonzis.community.vo;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReplyVO {
	private int reply_id, board_id, user_id,like_cnt;
	private String content;
	private Date reg_date;
	private char is_active;
}
