package org.joonzis.store.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ShoppingCartVO {
	private int user_id;
	private int product_id;
	private int product_count;
}
