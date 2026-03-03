package org.joonzis.myplant.service;

import java.util.List;

import org.joonzis.myplant.dto.MyPlantMainDTO;
import org.joonzis.myplant.mapper.MyPlantMapperTests;
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
public class MyPlantServiceTests {
	
	@Autowired
	private MyPlantService mpservice;
	
//	@Test
//	public void getMyPlantMainListTest() {
//		log.info("Get MyPlant Main List Test...");
//		try {
//			List<MyPlantMainDTO> dtolist = mpservice.getMyPlantMainList(242);
//			for(MyPlantMainDTO dto : dtolist) {
//				log.info(dto);
//			}
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
}
