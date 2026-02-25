package org.joonzis.community.vo;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BoardFileVO {
	private int file_id;
	private Integer board_id;
	private long file_size;
	private String original_name, saved_name, content_type, temp_key, sub_dir, file_kind, is_active, is_thumbnail;
	private Date reg_date, updated_at;
}
