package org.joonzis.community.vo;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LikeVO {
	private int like_id, user_id, target_id;
	private char target_type;
	private Date reg_date;
}
