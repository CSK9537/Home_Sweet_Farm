package org.joonzis.plant.service;

import java.util.List;

import org.joonzis.plant.vo.PlantVO;
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
public class PlantServiceTests {
	
	@Autowired
	private PlantService pservice;
	
//	@Test
//	public void plantListByRankTest() {
//		log.info("plant list by rank test...");
//		try {
//			List<PlantVO> plantlist = pservice.plantListByRank(50);
//			int i = 0;
//			for(PlantVO pvo : plantlist) {
//				log.info(++i);
//				log.info(pvo);
//			}
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
	
//	@Test
//	public void plantInfoTest() {
//		log.info("plant info test...");
//		try {
//			log.info(pservice.plantInfo("Monstera deliciosa"));
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
	
//	@Test
//	public void guideInfoTest() {
//		log.info("guide info test...");
//		try {
//			log.info(pservice.guideInfo("Monstera deliciosa"));
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
}
