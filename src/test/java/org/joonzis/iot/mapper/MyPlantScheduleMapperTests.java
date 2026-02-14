package org.joonzis.iot.mapper;


import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.util.Date;
import java.util.List;

import org.joonzis.myplant.dto.MyPlantScheduleDTO;
import org.joonzis.myplant.mapper.MyPlantScheduleMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import lombok.extern.log4j.Log4j;


@Log4j
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {
    "file:src/main/webapp/WEB-INF/spring/root-context.xml"})
public class MyPlantScheduleMapperTests {
	
	
//	@Autowired
//	private MyPlantScheduleMapper mapper;
	
//	@Test
//	public void insertTests() {
//		ScheduleVO vo = new ScheduleVO();
//		vo.setMyplantId(12);
//		vo.setScheduleDate(new Date());
//		vo.setScheduleDo("분갈이");
//		
//		mapper.insert(vo);
//	}
	
//	@Test
//	public void getListTests() {
//		List<ScheduleVO> list = mapper.getListByMyPlant(1);
//		
//		assertNotNull(list);
//		list.forEach(System.out::println);
//	}
	
//	@Test
//	public void updateTests() {
//		
//		ScheduleVO vo = new ScheduleVO();
//		vo.setScheduleId(9);
//		vo.setScheduleDate(new Date());
//		vo.setScheduleDo("물주기");
//		
//		int result = mapper.update(vo);
//		assertEquals(1, result);
//	}
}
