package org.joonzis.store.controller;

import java.util.List;

import org.joonzis.store.dto.OrderDTO;
import org.joonzis.store.dto.OrderWrapper;
import org.joonzis.store.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import lombok.extern.log4j.Log4j;

@Log4j
@Controller
@RequestMapping("store/order")
public class OrderController {
	@Autowired
	OrderService oService;
	
	// 주문 내역 추가
	@PostMapping(
			value = "/add/{user_id}",
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> addOrder(@RequestBody OrderWrapper oWrapper){
		try {
			oService.addOrder(oWrapper);
			return new ResponseEntity<String>("success",HttpStatus.OK);
		} catch (RuntimeException e) {
			e.printStackTrace();
			return new ResponseEntity<String>(e.getMessage(), HttpStatus.BAD_REQUEST);
		}
	}
	
	// 주문 내역 조회
	@GetMapping(
			value = "/getDetail/{order_id}",
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<OrderDTO> getOrderDetail(@PathVariable("order_id")String order_id){
		return new ResponseEntity<OrderDTO>(oService.getOrderDetail(order_id), HttpStatus.OK);
	}
	
	// 유저의 주문 내역 리스트 조회
	@GetMapping(
			value = "/getList/user_id/{user_id}}",
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<OrderDTO>> getOrderListByUserId(@PathVariable("user_id")int user_id){
		List<OrderDTO> list = oService.getOrderListByUserId(user_id);
		return new ResponseEntity<List<OrderDTO>>(list,HttpStatus.OK);
	}
	
	// 상품 기준 주문 내역 리스트 조회
	@GetMapping(
			value = "/getList/product_id/{product_id}}",
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<OrderDTO>> getOrderListByProductId(@PathVariable("product_id")int product_id){
		List<OrderDTO> list = oService.getOrderListByProductId(product_id);
		return new ResponseEntity<List<OrderDTO>>(list,HttpStatus.OK);
	}
}
