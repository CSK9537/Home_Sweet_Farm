package org.joonzis.plant.service;

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
	
	@Test
	public void insertPlantNamesTest() {
		log.info("insert plant name...");
		try {
			log.info("service 작동 중...");
			cservice.insertPlantNames();
		} catch (Exception e) {
			log.error(e);
		}
	}
}
