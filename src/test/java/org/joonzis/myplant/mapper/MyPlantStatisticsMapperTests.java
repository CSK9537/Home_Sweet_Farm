package org.joonzis.myplant.mapper;

import java.util.List;

import org.joonzis.myplant.dto.MyPlantStatisticsDTO;
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
public class MyPlantStatisticsMapperTests {
	@Autowired
	private MyPlantStatisticsMapper mappper;
	
//	@Test
//	public void findSensorDataByMyplantIdTest() {
//		log.info("Find Sensor Data By Myplant Id Test...");
//		try {
//			List<MyPlantStatisticsDTO> dtolist = mappper.findSensorDataByMyplantId(22);
//			for(MyPlantStatisticsDTO dto : dtolist) {
//				log.info(dto.getMyplant_id());
//				log.info(dto.getSensing_time());
//			}
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
}
