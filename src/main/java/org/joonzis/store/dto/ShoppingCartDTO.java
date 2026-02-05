package org.joonzis.store.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ShoppingCartDTO {
	private int user_id;
	private String nickname;
	
	private int product_id;
	private String product_name;
	private int product_price;
	private String product_description_brief;
	private int product_remain;
	
	private int product_count; // 장바구니에 해당 상품을 개수
	
	private String thumbnail;	// saved_name에 별침 부여해서 썸네일 이미지라는 것을 드러냈음
}
