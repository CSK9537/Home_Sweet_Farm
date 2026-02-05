package org.joonzis.community.vo;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BoardVO {
	private int board_id, category_id,user_id,  view_count, reply_cnt, like_count, parent_id;
	private String title, content;
	private Date reg_date, update_date;
	private char board_type, is_active, is_selected;
}
