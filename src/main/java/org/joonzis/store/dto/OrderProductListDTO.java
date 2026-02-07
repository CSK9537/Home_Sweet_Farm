package org.joonzis.store.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class OrderProductListDTO {
	private int product_id;
	private String product_name;
	private int product_price;
	private int product_delivery_price;
	private int product_sale;
	
	private int product_count;
	
	private String saved_name;
}
