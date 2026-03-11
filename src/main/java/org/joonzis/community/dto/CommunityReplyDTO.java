package org.joonzis.community.dto;

import java.sql.Timestamp;

import lombok.Data;

@Data
public class CommunityReplyDTO {
	private int reply_id, board_id, user_id, like_cnt;
	private Integer parent_reply_id;
	private String content, writer, profile_filename;
	private Timestamp reg_date;
}
