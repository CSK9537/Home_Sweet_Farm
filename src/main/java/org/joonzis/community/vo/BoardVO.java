package org.joonzis.community.vo;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BoardVO {
	private int board_id, user_id,  view_count, reply_cnt, like_count;
	private Integer category_id,  parent_id, price;
	private String title, content, board_type, is_active, is_selected, trade_status;
	private Date reg_date, update_date;
}
