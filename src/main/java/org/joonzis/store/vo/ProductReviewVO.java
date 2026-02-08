package org.joonzis.store.vo;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductReviewVO {
	private int product_review_id;
	private int product_id;
	private int writer_id;
	private String review_content;
	private Date review_date;
	private int review_rate;
}
