package org.joonzis.common.service;

import java.util.List;

import org.joonzis.plant.dto.SimplePlantDTO;
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
public class SearchServiceTests {
	
	@Autowired
	private SearchService sservvice;
	
	@Test
	public void searchPlantListTest() {
		log.info("search plant list service test...");
		try {
			List<SimplePlantDTO> list = sservvice.searchPlantList("스킨");
		} catch (Exception e) {
			log.error(e);
		}
	}
}
