package org.joonzis.plant.mapper;

import java.util.ArrayList;
import java.util.List;

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
public class CrawlMapperTests {
	
	@Autowired
	private CrawlMapper cmapper;
	
//	@Test
//	public void searchPlantsTest() {
//		log.info("select search plant names...");
//		List<String> result = new ArrayList<String>();
//		try {
//			result = cmapper.searchPlants();
//			for(String name : result) {
//				log.info(name);
//			}
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
	
//	@Test
//	public void insertSearchPlantNamesTest() {
//		log.info("insert plant names, PictureThis...");
//		try {
//			List<String> names = cmapper.searchPlants();
//			for(String name : names) {
//				cmapper.insertSearchPlantNames(name);
//				log.info(name + ", success!!!");
//			}
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
}
