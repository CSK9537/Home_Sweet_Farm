package org.joonzis.store.mapper;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.joonzis.store.dto.OrderDTO;
import org.joonzis.store.dto.OrderProductListDTO;
import org.joonzis.store.vo.OrderCardVO;
import org.joonzis.store.vo.OrderProductListVO;
import org.joonzis.store.vo.OrderTransperVO;
import org.joonzis.store.vo.OrderVO;
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
public class OrderMapperTests {

	@Autowired
	OrderMapper mapper;
	
//	@Test
//	public void insertOrderTest() {
//		log.info("주문 내역 INSERT 테스트");
//		OrderVO vo = new OrderVO();
//		vo.setOrder_id("InsertTestOrderId");
//		vo.setPaymentkey("InsertOrderTestPaymentKey");
//		vo.setType("브랜드페이");
//		vo.setMethod("카드");
//		vo.setStatus("READY");
//		vo.setApprovedat("2026.02.05");
//		vo.setUser_id(2);
//		vo.setOrder_amount(10000);
//		vo.setTotalamount(9000);
//		if(mapper.insertOrder(vo) > 0) log.info("Insert 성공");
//		else log.info("Insert 실패");
//	}
	
//	@Test
//	public void insertOrderProductListTest() {
//		Map<Integer, Integer> products = new HashMap<Integer, Integer>();
//		products.put(2, 2);
//		products.put(3, 1);
//		products.put(4, 3);
//		
//		OrderProductListVO vo = new OrderProductListVO();
//		vo.setOrder_id("InsertTestOrderId");
//		
//		products.forEach((product_id,product_count)->{
//			vo.setProduct_id(product_id);
//			vo.setProduct_count(product_count);
//			log.info(vo);
//			log.info("result : " + mapper.insertOrderProductList(vo));
//		});
//		log.info("상품 리스트 Insert 테스트 완료");
//	}
	
//	@Test
//	public void insertOrderCardTest() {
//		OrderCardVO vo = new OrderCardVO();
//		vo.setOrder_id("InsertTestOrderId");
//		vo.setIssuercode("TEST");
//		vo.setAcquirercode("TEST");
//		vo.setCardnumber("*******************");
//		vo.setInstallmentplanmonths(0);
//		vo.setApproveno("20260205");
//		vo.setUsercardpoint("N");
//		vo.setCardtype("체크");
//		vo.setOwnertype("개인");
//		
//		if(mapper.insertOrderCard(vo) > 0) {
//			log.info("카드 정보 Insert 테스트 완료");
//		} else {
//			log.info("카드 정보 Insert 테스트 실패");
//		}
//	}
	
//	@Test
//	public void insertOrderTransferTest() {
//		OrderTransperVO vo = new OrderTransperVO();
//		vo.setOrder_id("InsertTestOrderId");
//		vo.setBankcode("TEST");
//		vo.setSettlementstatus("Test");
//		
//		if(mapper.insertOrderTransper(vo) > 0) log.info("테스트 성공");
//		else log.info("테스트 실패");
//	}
	
//	@Test
//	public void getOrderTest() {
//		String order_id = "InsertTestOrderId";
//		OrderDTO dto = mapper.getOrder(order_id);
//		if(dto != null) {
//			log.info(dto);
//			for (OrderProductListDTO product : dto.getProduct_list()) {
//				log.info(product);
//			}
//		}
//	}
	
//	@Test
//	public void getOrderListTest() {
//		String user = "user";
//		String product = "product";
//		int param = 2;
//		
//		log.info("조회 타입 : " + user);
//		List<OrderDTO> list = mapper.getOrderList(param, user);
//		if(list.size() > 0) {
//			for (OrderDTO orderDTO : list) {
//				log.info(orderDTO);
//			}
//		}
//		
//		log.info("조회 타입 : "+ product );
//		list = mapper.getOrderList(param, product);
//		if(list.size() > 0) {
//			for (OrderDTO orderDTO : list) {
//				log.info(orderDTO);
//			}
//		}
//	}
}
