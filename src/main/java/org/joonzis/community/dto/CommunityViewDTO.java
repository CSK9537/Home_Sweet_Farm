package org.joonzis.community.dto;

import java.sql.Date;

import lombok.Data;

@Data
public class CommunityViewDTO {
	private int board_id, user_id, view_cnt, like_cnt, reply_cnt;
	private Integer category_id;
	private String board_type, title, content, writer;
	private Date reg_date, update_date;
}
