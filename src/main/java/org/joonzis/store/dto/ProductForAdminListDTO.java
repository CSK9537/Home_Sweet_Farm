package org.joonzis.store.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ProductForAdminListDTO {
	// 관리자용 조회 DTO
	private int product_id;
	private String product_name; 		// 상품명
	private int product_price;			// 상품 가격
	private int product_delivery_price; // 배달비
	private int product_sale;			// 세일
	private int product_remain;			// 상품 재고량
	private String category_name;		// 카테고리명
	
	private String saved_name; 			// 상품 썸네일 이미지

	private double product_rate;		// 상품 평점
	private int review_count;			// 리뷰 개수
	
	private int order_count;			// 주문 현황 수 -> 결제 상태가 DONE이고, 주문 상태가 CONFIRMED 또는 HOLD인 주문의 수
}
