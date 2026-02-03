package org.joonzis.store.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class WishListDTO {
	private int user_id;
	private String nickname;
	
	private int product_id;
	private String product_name;
	private int product_price;
	private String product_description_brief;
	private int product_reamin;
	
	private String thumbnail;	// saved_name에 별침 부여해서 썸네일 이미지라는 것을 드러냈음
}
