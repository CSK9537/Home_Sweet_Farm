package org.joonzis.store.controller;

import java.util.List;

import org.joonzis.store.dto.ShoppingCartDTO;
import org.joonzis.store.service.ShoppingCartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.log4j.Log4j;

@Log4j
@Controller
@RequestMapping("store/cart")
public class WishController {
	@Autowired
	ShoppingCartService cService;
	
	// 장바구니 확인 페이지 이동
	@GetMapping("/list")
	public String cartList(@RequestParam("user_id")int user_id, Model model) {
		model.addAttribute("cart",cService.getShoppingCartByUserId(user_id));
		return "/store/cart";
	}
	
	// 장바구니 조회
	public ResponseEntity<List<ShoppingCartDTO>> getCartList(){
		
		return null;
	}
	// 장바구니 추가
	
	// 장바구니 개별 삭제
	
	// 장바구니 전체 삭제(비우기)
	
	// 장바구니에 담기 or 빼기
	@PutMapping(value = "/add/user/{user_id}/product/{product_id}",
				produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> modifyCartItem(
			@PathVariable("user_id") int user_id, 
			@PathVariable("product_id")int product_id,
			@RequestParam(value="type",defaultValue = "plus")String type){
		int result;
		if(type.equals("plus") || type.equals("")) {
			result = cService.addShoppingCart(user_id, product_id);
		} else if (type.equals("minus")) {
			result = cService.decreaseShopingCart(user_id, product_id);
		} else {
			return new ResponseEntity<String>("Parameter type is only 'plus' or 'minus'",HttpStatus.BAD_REQUEST);			
		}
		
		if (result >= 0) return new ResponseEntity<String>(HttpStatus.ACCEPTED);
		return new ResponseEntity<String>("Database does not changed",HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	// 찜목록 조회
	
	// 찜 여부 확인 (특정 상품 하나만)
	
	// 찜목록에 추가
	
	// 찜목록에서 삭제
	
	// 찜목록 전체 삭제
}
