package org.joonzis.common.mapper;

import java.util.ArrayList;
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
public class SearchMapperTests {
	
	@Autowired
	private SearchMapper smapper;
	
//	@Test
//	public void searchPlantsTest() {
//		log.info("search plants test...");
//		try {
//			List<SimplePlantDTO> list = new ArrayList<SimplePlantDTO>();
//			list = smapper.searchPlants("mons");
//			int i = 1;
//			for(SimplePlantDTO dto : list) {
//				log.info((i++) + "번째");
//				log.info(dto.getPlant_name());
//				log.info(dto.getPlant_name_kor());
//			}
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
}
