package org.joonzis.community.vo;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BoardHashtagListVO {
	private Integer board_hashtag_id;
    private String board_hashtag_name, is_active;
    private Date reg_date;
}
