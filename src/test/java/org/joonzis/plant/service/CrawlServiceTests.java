package org.joonzis.plant.service;

import java.util.ArrayList;
import java.util.List;

import org.joonzis.plant.mapper.CrawlMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import lombok.extern.log4j.Log4j;

@Log4j
@RunWith(SpringJUnit4ClassRunner.class) 
@ContextConfiguration( 
		"file:src/main/webapp/WEB-INF/spring/root-context.xml")
public class CrawlServiceTests {
	
	@Autowired
	private CrawlService cservice;
	
	@Autowired
	private CrawlMapper cmapper;
	
//	// 소수 데이터로 식물 이름 입력 테스트
//	@Test
//	public void insertPlantNamesTest() {
//		log.info("insert plant name...");
//		try {
//			log.info("service 작동 중...");
//			List<String> tmplist = new ArrayList<String>();
//			tmplist.add("Austromyrtus");
//			tmplist.add("Azara");
//			tmplist.add("Avena");
//			tmplist.add("Aeonium");
//			cservice.insertPlantNames(tmplist);
//			log.info("service 성공!!!");
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
	
//	// 식물 이름 DB 실제 입력
//	@Test
//	public void insertPlantNames() {
//		log.info("insert plant name...");
//		try {
//			log.info("service 작동 중...");
//			List<String> list = cmapper.searchPlants();
//			cservice.insertPlantNames(list);
//			log.info("service 성공!!!!!!!!!!!!!!!!!!!!!!!!!!");
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
	
//	// 소수 데이터로 백과사전 입력 테스트
//	@Test
//	public void insertTotalPlantDataTest() {
//		log.info("insert plant data...");
//		try {
//			log.info("service 작동 중...");
//			List<String> tmplist = new ArrayList<String>();
//			tmplist.add("Abelia chinensis");
//			tmplist.add("Abelia uniflora");
//			tmplist.add("Abelmoschus esculentus");
//			tmplist.add("Abelmoschus sagittifolius");
//			tmplist.add("Ceropegia linearis subsp. Woodii");
//			tmplist.add("Abies alba");
//			tmplist.add("Abies balsamea");
//			tmplist.add("Abies concolor");
//			tmplist.add("Abies nordmanniana");
//			tmplist.add("Abies firma");
//			cservice.insertTotalPlantData(tmplist);
//			log.info("service 성공!!!");
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
	
}
