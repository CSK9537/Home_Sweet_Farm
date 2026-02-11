package org.joonzis.iot.mapper;





import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.util.List;

import org.joonzis.iot.mapper.MyPlantMapper;
import org.joonzis.iot.vo.MyPlantVO;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.log4j.Log4j;


@Log4j
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {
    "file:src/main/webapp/WEB-INF/spring/root-context.xml"
})
public class MyPlantMapperTests {
	@Autowired
	private MyPlantMapper mapper;
	
//	 @Test
//	  public void insertTest() {
//
//	        MyPlantVO vo = new MyPlantVO();
//	        vo.setUserId(2);      // ⚠ DB에 실제 존재하는 user_id
//	        vo.setPlantId(2);     // ⚠ DB에 실제 존재하는 plant_id
//	        vo.setMyplantName("테스트식물");
//
//	        mapper.insert(vo);
//
//	        System.out.println("생성된 myplantId = " + vo.getMyplantId());
//
//	        assertNotNull(vo.getMyplantId());
//	        assertTrue(vo.getMyplantId() > 0);
//	    }
//	 @Test
//	 public void readTest() {
//	     int myplantId = 12; // DB에 실제 존재하는 값
//
//	     MyPlantVO vo = mapper.get(myplantId);
//
//	     assertNotNull(vo);
//	     System.out.println(vo);
//	 }	
		@Test
		public void updateTests() {
			 MyPlantVO vo = new MyPlantVO();
			    vo.setUserId(2);
			    vo.setPlantId(2);
			    vo.setMyplantName("수정전");

			    mapper.insert(vo);

			    int id = vo.getMyplantId();

			    vo.setMyplantId(id);
			    vo.setMyplantName("수정후");

			    mapper.update(vo);

		}
}
