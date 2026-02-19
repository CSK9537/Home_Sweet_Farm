package org.joonzis.plant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class SimplePlantDTO {
	// 식물 식별번호
	private int plant_id;
	// 식물 영어 이름
	private String plant_name;
	// 식물 한글 이름
	private String plant_name_kor;
	// 식물 기본 이미지
	private String plant_image;
	// 검색수
	private int plant_searchcount;
}
