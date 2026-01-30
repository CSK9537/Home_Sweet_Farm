package org.joonzis.store.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ProductVO {
	private int product_id;						// 고유 식별자
	private int category_id;					// 상품 카테고리
	private String product_name;				// 제품명
	private int product_price;					// 제품 가격
	private int product_delivery_price;			// 배달비
	private int product_remain;					// 남은 재고량
	private String product_description_brief;	// 간략한 제품 설명
	private String product_descriptioin_datail;	// 제품의 상세 설명
	private String product_caution;				// 제품 주의 사항
}
