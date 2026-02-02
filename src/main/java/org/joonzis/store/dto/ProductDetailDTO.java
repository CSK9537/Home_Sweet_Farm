package org.joonzis.store.dto;

import java.util.List;

import lombok.Data;

import lombok.NoArgsConstructor;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductDetailDTO {
	
	// 제품 상세 페이지를 위한 DTO
	
	private int product_id;						// 고유 식별자
	private String product_name;				// 제품명
	private int product_price;					// 제품 가격
	private int product_delivery_price;			// 배달비
	private int product_remain;					// 남은 재고량
	private String product_description_brief;	// 간략한 제품 설명
	private String product_description_detail;	// 제품의 상세 설명
	private String product_caution;				// 제품 주의 사항
	private int product_sale;					// 세일
	
	private List<String> image_list;			// 상품 이미지들
	
	private double product_rate;				// 상품 평점
	private int review_count;					// 리뷰 개수
}
