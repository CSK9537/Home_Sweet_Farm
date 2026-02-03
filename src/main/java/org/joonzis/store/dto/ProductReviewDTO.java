package org.joonzis.store.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductReviewDTO {
	private int product_review_id;
	private String review_content;
	private Date review_date;
	private int review_rate;
	private int writer_id;
	private String nickname;
}
