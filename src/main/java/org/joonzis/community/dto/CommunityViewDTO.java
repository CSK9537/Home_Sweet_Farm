package org.joonzis.community.dto;

import lombok.Data;

@Data
public class CommunityViewDTO {
	private int board_id, user_id, view_cnt, like_cnt, reply_cnt;
	private Integer category_id;
	private String title, content, writer;
	private Data reg_date, update_date;
}
