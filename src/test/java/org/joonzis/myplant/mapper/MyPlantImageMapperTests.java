package org.joonzis.myplant.mapper;

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
public class MyPlantImageMapperTests {

	@Autowired
	private MyPlantImageMapper mapper;
	
//	@Test
//	public void updateImgAddrTest() {
//		log.info("Update Img Addr Test...");
//		try {
//			int result = mapper.updateImgAddr("testtesttest", 62);
//			log.info(result);
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
	
//	@Test
//	public void getImgAddrTest() {
//		log.info("Get Img Addr Test...");
//		try {
//			String result = mapper.getImgAddr(62);
//			log.info(result);
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
}
