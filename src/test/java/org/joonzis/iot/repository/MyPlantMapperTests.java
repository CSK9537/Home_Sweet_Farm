package org.joonzis.iot.repository;

import static org.junit.Assert.assertNotNull;

import java.util.List;

import org.joonzis.iot.dto.MyPlantMainDTO;
import org.joonzis.iot.vo.MyPlantVO;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {
    "file:src/main/webapp/WEB-INF/spring/root-context.xml"
})
public class MyPlantMapperTests {
	@Autowired
	private MyPlantMapper mapper;
	
//	@Test
//	public void selectMyPlantMainListTests() {
//		int userId = 1;
//		
//		List<MyPlantVO> list = mapper.selectMyPlantMainList(userId);
//		for(MyPlantVO vo : list) {
//			System.out.println(vo);
//		}
//	}

    @Test
    public void testGetMyPlantMainList() {
        int userId = 1; // 실제 존재하는 유저 ID

        List<MyPlantMainDTO> list = mapper.selectMyPlantMain(userId);

        assertNotNull(list);

        list.forEach(plant -> {
            System.out.println("==== 나의 식물 ====");
            System.out.println("ID: " + plant.getMyplantId());
            System.out.println("이름: " + plant.getMyplantName());
            System.out.println("식물명: " + plant.getPlantName());
            System.out.println("온도: " + plant.getTemperature());
            System.out.println("습도: " + plant.getHumidity());
            System.out.println("토양수분: " + plant.getSoilMoisture());
            System.out.println("측정시간: " + plant.getSensingTime());
        });
    }
}
