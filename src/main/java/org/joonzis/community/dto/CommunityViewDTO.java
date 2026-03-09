package org.joonzis.community.dto;

import java.sql.Date;

import lombok.Data;

@Data
public class CommunityViewDTO {
	private int board_id, user_id, view_cnt, like_cnt, reply_cnt;
	private Integer category_id, price;
	private String board_type, title, content, writer, hashtags, trade_status;
	private Date reg_date, update_date;
}
