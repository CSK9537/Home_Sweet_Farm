package org.joonzis.store.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductForListDTO {
	
	// 상품 리스트 업을 할때 사용될 DTO
	private int product_id;
	private String product_name; 		// 상품명
	private int product_price;			// 상품 가격
	private int product_delivery_price; // 배달비
	private int product_sale;			// 세일
	
	private String saved_name; 			// 상품 썸네일 이미지

	private double product_rate;		// 상품 평점
	private int review_count;			// 리뷰 개수
}
