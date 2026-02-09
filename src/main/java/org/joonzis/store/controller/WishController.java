package org.joonzis.store.controller;

import java.util.List;

import javax.websocket.server.PathParam;

import org.joonzis.store.dto.ShoppingCartDTO;
import org.joonzis.store.dto.WishListDTO;
import org.joonzis.store.service.ShoppingCartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.log4j.Log4j;

@Log4j
@RestController
@RequestMapping("store/cart")
public class WishController {
	@Autowired
	ShoppingCartService cService;
	
	// 장바구니 조회
	@GetMapping(
			value = "/getCart/user/{user_id}",
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<ShoppingCartDTO>> getCartList(
			@PathVariable("user_id") int user_id){
		return new ResponseEntity<List<ShoppingCartDTO>>(cService.getShoppingCartByUserId(user_id),HttpStatus.OK);
	}

	// 장바구니에 담기 or 빼기
	@PutMapping(value = "/addCart/user/{user_id}/product/{product_id}",
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
	// 장바구니에서 삭제
	@DeleteMapping(
			value = "/removeCart/user/{user_id}/product/{product_id}",
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> removeCartItem(
			@PathVariable("user_id") int user_id,
			@PathVariable("product_id") int product_id){
		int result = cService.deleteShopingCart(user_id, product_id);
		if(result > 0) return new ResponseEntity<String>("success", HttpStatus.OK);
		else return new ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	// 찜목록 조회
	@GetMapping(
			value = "getWish/user/{user_id}",
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<WishListDTO>> getWishList(
			@PathVariable("user_id")int user_id){
		return new ResponseEntity<List<WishListDTO>>(cService.getWishListByUserId(user_id),HttpStatus.OK);
	}
	
	// 찜 여부 확인 (특정 상품 하나만)
	@GetMapping(
			value = "Check/user/{user_id}/product/{product_id}")
	public ResponseEntity<String> isAlreadyWishList(
			@PathVariable("user_id") int user_id,
			@PathVariable("product_id") int product_id,
			@RequestParam("type")String type){
		String result = cService.checkAlreadyIn(user_id, product_id, type);
		return new ResponseEntity<String>(result, HttpStatus.OK);
	}
	
	// 찜목록
	@PostMapping(
			value = "/addWish/user/{user_id}/product/{product_id}")
	public ResponseEntity<String> addWishOrCart(
			@PathVariable("user_id")int user_id,
			@PathVariable("product_id") int product_id){
		int result = cService.addWishList(user_id, product_id);
		if(result > 0) return new ResponseEntity<String>("success", HttpStatus.OK);
		else return new ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	// 찜목록에서 삭제
	@DeleteMapping(
			value = "/removeWish/user/{user_id}/product/{product_id}")
	public ResponseEntity<String> removeWishOrCart(
			@PathVariable("user_id")int user_id,
			@PathVariable("product_id") int product_id){
		int result = cService.deleteWishList(user_id, product_id);
		if(result > 0) return new ResponseEntity<String>("success", HttpStatus.OK);
		else return new ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	// 장바구니 전체 삭제
	@DeleteMapping(
			value = "/removeAllCart/user/{user_id}")
	public ResponseEntity<String> removeAllCart(
			@PathParam("user_id") int user_id){
		int result = cService.deleteAllCart(user_id);
		if(result > 0) return new ResponseEntity<String>("success", HttpStatus.OK);
		else return new ResponseEntity<String>("Database does not changed", HttpStatus.INTERNAL_SERVER_ERROR);
	}
	// 찜목록 전체 삭제
	@DeleteMapping(
			value = "/removeAllWish/user/{user_id}")
	public ResponseEntity<String> removeAllWish(
			@PathParam("user_id") int user_id){
		int result = cService.deleteAllWish(user_id);
		if(result > 0) return new ResponseEntity<String>("success", HttpStatus.OK);
		else return new ResponseEntity<String>("Database does not changed", HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
