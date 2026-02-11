package org.joonzis.store.mapper;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import lombok.extern.log4j.Log4j;
import oracle.sql.TIMESTAMP;

@Log4j
@RunWith(SpringJUnit4ClassRunner.class) 
@ContextConfiguration( 
		"file:src/main/webapp/WEB-INF/spring/root-context.xml")
public class NewOrderMapperTests {

	@Autowired
	OrderMapper mapper;
	
//	@Test
//	public void addOrderTest() {
//		int result = mapper.addOrderBeforePay(
//				"Test", 2, 0, 10000, null, "경기도 성남시 분당구 판교역로 166 (백현동, 카카오 판교 아지트) B동 15층 101호");
//		
//		log.info("DB 삽입 결과 : " + result);
//		log.info("DB SELECT : " + mapper.getOrder("Test"));
//	}
//	@Test
//	public void updateOrderTest() {
//		int result = mapper.updateAfterPayByOrderId("Test", "DONE", "TestPaymentKey", "브랜드페이", "카드", 10000, new TIMESTAMP());
//		log.info("DB 수정 결과 : " + result);
//		log.info("DB SELECT : " + mapper.getOrder("Test"));
//	}
}
