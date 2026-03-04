package org.joonzis.myplant.mapper;

import java.util.List;

import org.joonzis.myplant.dto.MyPlantMainDTO;
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
public class MyPlantMapperTests {
	
	@Autowired
	private MyPlantMapper mpmapper;
	
//	@Test
//	public void myPlantMainTest() {
//		log.info("My Plant Main Test...");
//		try {
//			List<MyPlantMainDTO> dtolist = mpmapper.myPlantMain(242);
//			for(MyPlantMainDTO dto : dtolist) {
//				log.info(dto.getMyplant_name());
//				log.info(dto.getPlant_name());
//				log.info(dto.getPlant_name_kor());
//			}
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
	
//	@Test
//	public void getTest() {
//		log.info("get Test...");
//		try {
//			MyPlantMainDTO dto = mpmapper.get(20);
//			log.info(dto.getMyplant_name());
//			log.info(dto.getPlant_name());
//			log.info(dto.getPlant_name_kor());
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
}
