package org.joonzis.store.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductCategoryVO {
	private int category_id;
	private String category_name;
}
