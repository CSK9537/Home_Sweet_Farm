package org.joonzis.store.service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.joonzis.store.mapper.NewOrderMapperTests;
import org.joonzis.store.vo.OrderCardVO;
import org.joonzis.store.vo.OrderProductListVO;
import org.joonzis.store.vo.PaymentInfoVO;
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
public class OrderServiceTests {
	@Autowired
	OrderService service;
	
//	@Test
//	public void beforePayTest() {
//		String order_id = "Test2";
//		List<OrderProductListVO> products = new ArrayList<OrderProductListVO>();
//		products.add(new OrderProductListVO(order_id, 2, 1));
//		products.add(new OrderProductListVO(order_id, 3, 3));
//		products.add(new OrderProductListVO(order_id, 4, 2));
//		try {
//			service.addOrderBeforePay("Test2", 2, 0, 50000, null, "아무 주소", products);			
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//	}
	
//	@Test
//	public void afterPayTest() {
//		String order_id = "Test2";
//		PaymentInfoVO vo = new OrderCardVO(order_id, "TEST", null, "********************", 0, null ,"N","체크","개인");
//		try {
//			service.AfterPay(order_id, "DONE", "TestPaymentKey", "NOMAL", "카드", 50000, "2026-02-11T14:40:00+09:00", vo);
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//	}
	
//	@Test
//	public void cancelOrderTest() {
//		
//	}
}
