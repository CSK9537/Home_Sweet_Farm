package org.joonzis.plant.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class PlantVO {
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
	// 설명
	private String plant_description;
	// 종
	private String plant_species;
	// 속
	private String plant_genus;
	// 과
	private String plant_family;
	// 목
	private String plant_order;
	// 강
	private String plant_class;
	// 문
	private String plant_phylum;
	// 독성
	private String plant_toxicity;
	// 수명
	private String plant_lifespan;
	// 종류
	private String plant_type;
	// 식물 높이
	private String plant_height;
	// 꼭대기 지름
	private String plant_spread;
	// 줄기 색상
	private String plant_stemcolor;
	// 잎 색깔
	private String plant_leafcolor;
	// 잎 종류
	private String plant_leaftype;
	// 꽃 색깔
	private String plant_flowercolor;
	// 꽃 지름
	private String plant_flowersize;
	// 개화 시기
	private String plant_bloomtime;
	// 과일 색
	private String plant_fruitcolor;
	// 수확 시기
	private String plant_harvesttime;
	// 이상적 최저 온도
	private int plant_temperature_imin;
	// 이상적 최고 온도
	private int plant_temperature_imax;
	// 휴면
	private String plant_dormancy;
	// 성장기
	private String plant_growthseason;
	// 성장률
	private String plant_growthrate;
	// 환경 보호 가치 (Environmental Protection Value)
	private String plant_culture_epv;
	// 경제적 가치 (Economic Value)
	private String plant_culture_ev;
	// 미용 개선 가치 (Beauty Improvement Value)
	private String plant_culture_biv;
	// 정원 용도 (Garden Use)
	private String plant_culture_gu;
	// 상징 (Symbolism)
	private String plant_culture_symbolism;
	// 흥미로운 사실들 (Interesting Facts)
	private String plant_culture_if;
}