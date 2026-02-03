package org.joonzis.myplant.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class MyplantVO {
	// 나의 식물 식별번호
	private int myplant_id;
	// 유저 식별번호
	private int user_id;
	// 식물 식별 번호
	private String plant_id;
	// 나의 식물 이름
	private String myplant_name;
	// 등록일
	private String myplant_regdate;
}
