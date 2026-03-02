package org.joonzis.store.controller;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.joonzis.store.dto.ShoppingCartDTO;
import org.joonzis.store.dto.WishListDTO;
import org.joonzis.store.service.ShoppingCartService;
import org.joonzis.store.service.StoreService;
import org.joonzis.store.vo.ProductVO;
import org.joonzis.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import lombok.extern.log4j.Log4j;

@Log4j
@Controller
@RequestMapping("store/cart")
public class WishController {
	@Autowired
	ShoppingCartService cService;
	@Autowired
	StoreService sService;	
	// 장바구니 조회
	@GetMapping(
			value = "/getCart",
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<ShoppingCartDTO>> getCartList(
			HttpSession session){
		int user_id = ((UserVO)session.getAttribute("loginUser")).getUser_id();
		return new ResponseEntity<List<ShoppingCartDTO>>(cService.getShoppingCartByUserId(user_id),HttpStatus.OK);
	}

	// 장바구니에 담기 or 빼기
	@RequestMapping(
			method = {RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE},
			value = "/modifyCart/product/{product_id}",
			produces = "text/plain;charset=UTF-8")
	public ResponseEntity<String> modifyCartItem( 
			@PathVariable("product_id")int product_id,
			@RequestParam(value="type",defaultValue = "plus")String type,
			HttpSession session){
		int user_id = ((UserVO)session.getAttribute("loginUser")).getUser_id();
		
		int result;
		if(type.equals("plus") || type.equals("")) {
			result = cService.addShoppingCart(user_id, product_id);
		} else if (type.equals("minus")) {
			result = cService.decreaseShopingCart(user_id, product_id);
		} else {
			return new ResponseEntity<String>("Parameter type is only 'plus' or 'minus'",HttpStatus.BAD_REQUEST);			
		}
		
		// UX를 위해 수량이 수정된 상품의 이름을 응답
		if (result >= 0) {
			ProductVO vo = sService.getProductInfo(product_id);
			return new ResponseEntity<String>(vo.getProduct_name(), HttpStatus.OK);
		}
		return new ResponseEntity<String>("fail", HttpStatus.INTERNAL_SERVER_ERROR);
	}
	// 장바구니에서 삭제
	@DeleteMapping(
			value = "/removeCart/product/{product_id}",
			produces = "text/plain;charset=UTF-8")
	public ResponseEntity<String> removeCartItem(
			@PathVariable("product_id") int product_id,
			HttpSession session){
		int user_id = ((UserVO)session.getAttribute("loginUser")).getUser_id();
		int result = cService.deleteShopingCart(user_id, product_id);
		
		// UX 향상을 위해삭제된 상품 이름 가져오기(테스트)
		ProductVO vo = sService.getProductInfo(product_id);
		
		if(result > 0) return new ResponseEntity<String>(vo.getProduct_name(), HttpStatus.OK);
		else return new ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	// 찜목록 조회
	@GetMapping(
			value = "/getWish",
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<WishListDTO>> getWishList(
			HttpSession session){
		int user_id = ((UserVO)session.getAttribute("loginUser")).getUser_id();
		return new ResponseEntity<List<WishListDTO>>(cService.getWishListByUserId(user_id),HttpStatus.OK);
	}
	
	// 찜 여부 확인 (특정 상품 하나만)
	@GetMapping(
			value = "Check/product/{product_id}",
			produces = "text/plain;charset=UTF-8")
	public ResponseEntity<String> isAlreadyWishList(
			@PathVariable("product_id") int product_id,
			@RequestParam("type")String type,
			HttpSession session){
		int user_id = ((UserVO)session.getAttribute("loginUser")).getUser_id();
		String result = cService.checkAlreadyIn(user_id, product_id, type);
		return new ResponseEntity<String>(result, HttpStatus.OK);
	}
	
	// 찜목록 추가
	@PostMapping(
			value = "/addWish/product/{product_id}",
			produces = "text/plain;charset=UTF-8")
	public ResponseEntity<String> addWishOrCart(
			@PathVariable("product_id") int product_id,
			HttpSession session){
		int user_id = ((UserVO)session.getAttribute("loginUser")).getUser_id();
		try {
			cService.addWishList(user_id, product_id);			
		} catch (DuplicateKeyException e) {
			e.printStackTrace();
			log.error("이미 찜목록에 추가됨 : 유저=" + user_id + "상품=" + product_id);
			return new ResponseEntity<String>("이미 찜목록에 추가됨",HttpStatus.INTERNAL_SERVER_ERROR);			
		}
		return new ResponseEntity<String>("success", HttpStatus.OK);
	}
	
	// 찜목록에서 삭제
	@DeleteMapping(
			value = "/removeWish/product/{product_id}",
			produces = "text/plain;charset=UTF-8")
	public ResponseEntity<String> removeWishOrCart(
			@PathVariable("product_id") int product_id,
			HttpSession session){
		int user_id = ((UserVO)session.getAttribute("loginUser")).getUser_id();
		try {
			int result = cService.deleteWishList(user_id, product_id);
			
			// 찜목록에서 삭제한 이후 상품 이름 가져오기
			ProductVO vo = null;
			if(result > 0) {
				vo = sService.getProductInfo(product_id);
			}
			return new ResponseEntity<String>(vo.getProduct_name(), HttpStatus.OK);
			
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// 장바구니 전체 삭제
	@DeleteMapping(
			value = "/removeAllCart",
			produces = "text/plain;charset=UTF-8")
	public ResponseEntity<String> removeAllCart(HttpSession session){
		int user_id = ((UserVO)session.getAttribute("loginUser")).getUser_id();
		try {
			cService.deleteAllCart(user_id);			
			return new ResponseEntity<String>("success", HttpStatus.OK);			
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<String>("Database does not changed", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	// 찜목록 전체 삭제
	@DeleteMapping(
			value = "/removeAllWish",
			produces = "text/plain;charset=UTF-8")
	public ResponseEntity<String> removeAllWish(HttpSession session){
		int user_id = ((UserVO)session.getAttribute("loginUser")).getUser_id();
		try {
			cService.deleteAllWish(user_id);			
			return new ResponseEntity<String>("success", HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<String>("Database does not changed", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	// 찜목록에서 장바구니로 이동
	@RequestMapping(
			method = { RequestMethod.PUT, RequestMethod.POST, RequestMethod.DELETE },
			value="/moveToCart/product/{product_id}",
			produces = "text/plain;charset=UTF-8")
	public ResponseEntity<String> moveToCart(
			HttpSession session,
			@PathVariable("product_id") int product_id){
		int user_id = ((UserVO)session.getAttribute("loginUser")).getUser_id();
		try {
			cService.moveToCart(user_id, product_id);
			return new ResponseEntity<String>("success", HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
