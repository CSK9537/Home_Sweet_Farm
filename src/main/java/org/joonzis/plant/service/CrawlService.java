package org.joonzis.plant.service;

import java.util.List;

public interface CrawlService {
	
	// 식물 이름 목록 DB 저장(PictureThis 기준)
	public void insertPlantNames(List<String> list);
	// 백과사전 전체 정보 입력(식물 이름 목록 DB 기반으로 PictureThis 백과사전 페이지 이동 후 DB 저장)
	public void insertTotalPlantData(List<String> list);
	// 관리가이드 전체 정보 입력(식물 이름 목록 DB 기반으로 PictureThis 관리가이드 페이지 이동 후 DB 저장)
	public void insertTotalGuideData(List<String> list);
}
