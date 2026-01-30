package org.joonzis.community.vo;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BoardFileVO {
	private int file_id, board_id, file_size;
	private String original_name, saved_name, content_type;
	private Date reg_date;
	private char is_thumbnail;
}
