package org.joonzis.store.vo;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ProductImageVO {
	private int file_id;
	private int product_id;
	private String original_name;
	private String saved_name;
	private Date reg_date;
	private int file_size;
	private String is_thumbnail;
}
