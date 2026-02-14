package org.joonzis.plant.service;

import java.util.List;

import org.joonzis.plant.dto.PlantDTO;
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
//			List<PlantDTO> plantlist = pservice.plantListByRank(50);
//			int i = 0;
//			for(PlantDTO pdto : plantlist) {
//				log.info(++i);
//				log.info(pdto);
//			}
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
	
//	@Test
//	public void plantListByRandomTest() {
//		log.info("plant list by random test...");
//		try {
//			List<PlantDTO> plantlist = pservice.plantListByRandom(3, 72, 12);
//			int i = 0;
//			for(PlantDTO pdto : plantlist) {
//				log.info(++i);
//				log.info(pdto);
//			}
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
	
//	@Test
//	public void plantListByRandomPlusTest() {
//		log.info("plant list by random plus test...");
//		try {
//			List<PlantDTO> plantlistplus = pservice.plantListByRandomPlus(12);
//			int i = 0;
//			for(PlantDTO pdto : plantlistplus) {
//				log.info(++i);
//				log.info(pdto);
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
