package org.joonzis.plant.service;

import java.util.List;

public interface CrawlService {
	
	// 식물 이름 목록 DB 저장(PictureThis 기준)
	public void insertPlantNames(List<String> list);
	// 백과사전 정보 입력(식물 이름 목록 DB 기반으로 백과사전 페이지 이동 후 DB 저장)
	// 관리가이드 정보 입력(식물 이름 목록 DB 기반으로 관리가이드 페이지 이동 후 DB 저장)
}
