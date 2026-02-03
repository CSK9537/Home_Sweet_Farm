package org.joonzis.store.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class SearchProductDTO {
	// 검색용 DTO
	// 프론트에서 담겨서 Mapper까지 보내는 용도
	private Integer minPrice;
	private Integer maxPrice;
	private Integer minSale;
	private Integer maxSale;
	private Integer categoryId;		// int를 쓰면 기본 값인 0이 쿼리의 검색 조건에 들어가버리기 때문에 Integer를 사용
	private String keyword;
}
