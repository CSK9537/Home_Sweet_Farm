package org.joonzis.store.vo;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class OrderProductListVO {
	private String order_id;
	private int product_id;
	private int product_count;
}
