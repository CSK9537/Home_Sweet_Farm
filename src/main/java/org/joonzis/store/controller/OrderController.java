package org.joonzis.store.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.joonzis.store.dto.OrderDTO;
import org.joonzis.store.dto.PaymentDTO;
import org.joonzis.store.service.OrderService;
import org.joonzis.store.vo.OrderProductListVO;
import org.joonzis.store.vo.PaymentInfoVO;
import org.joonzis.user.vo.UserVO;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.log4j.Log4j;

@Log4j
@RestController
@RequestMapping("store/order")
public class OrderController {
	@Autowired
	OrderService oService;
	
	// 특정 주문 내역 조회
	@GetMapping(
			value = "/getDetail/{order_id}",
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<OrderDTO> getOrderDetail(@PathVariable("order_id")String order_id){
		return new ResponseEntity<OrderDTO>(oService.getOrderDetail(order_id), HttpStatus.OK);
	}
	
	// 유저의 주문 내역 리스트 조회
	@GetMapping(
			value = "/getList",
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<OrderDTO>> getOrderListByUserId(HttpSession session){
//		int user_id = ((UserVO)session.getAttribute("loginUser")).getUser_id();
		int user_id = 2;
		List<OrderDTO> list = oService.getOrderListByUserId(user_id);
		return new ResponseEntity<List<OrderDTO>>(list,HttpStatus.OK);
	}
	
	// 상품 기준 주문 내역 리스트 조회
	@GetMapping(
			value = "/getList/product_id/{product_id}",
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<OrderDTO>> getOrderListByProductId(@PathVariable("product_id")int product_id){
		List<OrderDTO> list = oService.getOrderListByProductId(product_id);
		return new ResponseEntity<List<OrderDTO>>(list,HttpStatus.OK);
	}
	
	// 결제 승인 이전
	@PostMapping(
			value = "/ready",
			produces = "text/plain;charset=UTF-8;")
	public ResponseEntity<String> readyOrder(
			HttpSession session,
			@RequestBody Map<String, Object> map
			){
//		int user_id = ((UserVO)session.getAttribute("loginUser")).getUser_id();
		int user_id = 2;
		
		int use_point = (int)map.get("use_point");
		int order_amount = (int)map.get("order_amount");
		Integer accumulate_point = (Integer)map.get("accumulate_point");
		String delivery_addr = (String)map.get("delivery_addr");
		
		// List<OrderProductListVO> 변환
		ObjectMapper mapper = new ObjectMapper();
		List<OrderProductListVO> products = mapper.convertValue(map.get("products"), new TypeReference<List<OrderProductListVO>>() {});

		String order_id = oService.createRandomOrderId(); // UUID 생성
		try {
			oService.addOrderBeforePay(order_id, user_id, use_point, order_amount, accumulate_point, delivery_addr, products);
			return new ResponseEntity<String>(order_id, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	// 결제 승인
	@PostMapping(
			value = "/confirm",
			produces = "text/plain;charset=UTF-8")
	public ResponseEntity<String> confirmOrder(@RequestBody Map<String, Object> map, HttpSession session){
//		int user_id = ((UserVO)session.getAttribute("loginUser")).getUser_id();
		int user_id = 2;
		String paymentKey = (String)map.get("paymentKey");
		String orderId = (String)map.get("orderId");
		int amount = Integer.parseInt(map.get("amount").toString());

		PaymentDTO payment = null;
		PaymentInfoVO paymentInfo = null;
		try {
			payment = oService.confirmPayment(paymentKey, orderId, amount, user_id);
			log.info("payment : "+payment);
			log.info("card : " + payment.getCard());
			if(payment.getMethod().equals("카드"))paymentInfo = payment.getCard();
			else if (payment.getMethod().equals("계좌이체"))paymentInfo = payment.getTransfer();
			else if (payment.getMethod().equals("간편결제")) paymentInfo =payment.getCard();
			else throw new RuntimeException("지원하지 않는 결제 방식");
			
			oService.AfterPay(
					orderId, payment.getStatus(), paymentKey, payment.getType(), 
					payment.getMethod(), payment.getTotalAmount(), payment.getRequestedAt(), paymentInfo);
			
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<String>("success", HttpStatus.ACCEPTED);
	}
	
	// 결제 취소
	@PostMapping(
			value = "/cancel",
			produces = "text/plain;charset=UTF-8")
	public ResponseEntity<String> cancelOrder(
			@RequestBody String paymentKey,
			@RequestBody String orderId,
			@RequestBody String reason){
		int result = 0;
		try {
			result = oService.cancelOrder(paymentKey, reason, orderId);
			if(result > 0) return new ResponseEntity<String>(HttpStatus.ACCEPTED);
			else throw new RuntimeException("결제 취소가 이루어지지 않음");
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
}
