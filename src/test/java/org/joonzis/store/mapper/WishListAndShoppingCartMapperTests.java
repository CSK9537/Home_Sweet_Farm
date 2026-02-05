package org.joonzis.store.mapper;

import java.util.List;

import org.joonzis.store.dto.ShoppingCartDTO;
import org.joonzis.store.dto.WishListDTO;
import org.joonzis.store.vo.ShoppingCartVO;
import org.joonzis.store.vo.WishListVO;
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
public class WishListAndShoppingCartMapperTests {
	@Autowired
	WishListAndShoppingCartMapper mapper;
	
//	@Test
//	public void insertWishListTest() {
//		WishListVO vo = new WishListVO();
//		vo.setUser_id(2);
//		vo.setProduct_id(2);
//		if(mapper.insertWishList(vo) > 0) {
//			log.info("Insert 성공!");
//		} else {
//			log.info("Insert 성공...");
//		}
//	}
	
	// 이 밑에 코드들은 아직 실행해보지 않은 테스트 코드들
//	@Test
//	public void getWishListByUserIdTest() {
//		int user_id = 2;
//		List<WishListDTO> list = mapper.getWishListByUserId(user_id);
//		if(list.size() > 0) {
//			for (WishListDTO wishListDTO : list) {
//				log.info("가져온 찜목록 데이터 : " + wishListDTO);
//			}
//		} else {
//			log.info("리스트의 길이가 0임.");
//		}
//	}
	
//	@Test
//	public void getWishListByProductIdTest() {
//		int product_id = 2;
//		List<WishListDTO> list = mapper.getWishListByProductId(product_id);
//		if(list.size() > 0) {
//			for (WishListDTO wishListDTO : list) {
//				log.info("가져온 찜목록 데이터 : " + wishListDTO);
//			}
//		} else {
//			log.info("리스트의 길이가 0임.");
//		}
//	}
	
//	@Test
//	public void deleteWishList() {
//		WishListVO vo = new WishListVO();
//		vo.setUser_id(2);
//		vo.setProduct_id(2);
//		log.info("삭제 테스트 실행 결과 : " + mapper.deleteWishList(vo) + "개의 행이 삭제 됨.");
//	}
	
//	@Test
//	public void insertShoppingCartTest() {
//		ShoppingCartVO vo = new ShoppingCartVO();
//		vo.setUser_id(2);
//		vo.setProduct_id(2);
//		if(mapper.insertShoppingCart(vo) > 0) {
//			log.info("Insert 성공!");
//		} else {
//			log.info("Insert 실패...");
//		}
//	}

//	@Test
//	public void getShoppingCartByUserIdTest() {
//		int user_id = 2;
//		List<ShoppingCartDTO> list = mapper.getShoppingCartByUserId(user_id);
//		if(list.size() > 0) {
//			for (ShoppingCartDTO shoppingCartDTO : list) {
//				log.info("가져온 장바구니 데이터 : " + shoppingCartDTO);
//			}
//		} else {
//			log.info("리스트의 길이가 0임.");
//		}
//	}
	
//	@Test
//	public void getShoppingCartByProductIdTest() {
//		int product_id = 2;
//		List<ShoppingCartDTO> list = mapper.getShoppingCartByProductId(product_id);
//		if(list.size() > 0) {
//			for (ShoppingCartDTO shoppingCartDTO : list) {
//				log.info("가져온 장바구니 데이터 : " + shoppingCartDTO);
//			}
//		} else {
//			log.info("리스트의 길이가 0임.");
//		}
//	}
	
//	@Test
//	public void deleteShoppingCart() {
//		log.info("장바구니 삭제 테스트 실행 결과 : " + mapper.deleteShopingCart(2, 2) + "개의 행이 삭제 됨.");
//	}

//	@Test
//	public void upsertCartTest() {
//		log.info("upsert 결과1 : " + mapper.upsertShoppingCart(2, 2));
//		log.info("upsert 결과2 : " + mapper.upsertShoppingCart(2, 2));
//	}
	
//	@Test
//	public void getWishListTest() {
//		int param = 2;
//		String product = "product";
//		String user = "user";
//		
//		List<WishListDTO> list = mapper.getWishList(param, product);
//		log.info("파라미터 값 : " + param);
//		log.info("조회 타입 : " + product);
//		if(list.size() > 0) {
//			for (WishListDTO wishListDTO : list) {
//				log.info(wishListDTO);
//			}
//		} else {
//			log.info("리스트의 길이가 0임");
//		}
//		
//		list = mapper.getWishList(param, user);
//		log.info("조회 타입 : " + user);
//		if(list.size() > 0) {
//			for (WishListDTO wishListDTO : list) {
//				log.info(wishListDTO);
//			}
//		} else {
//			log.info("리스트의 길이가 0임");
//		}
//	}
	
//	@Test
//	public void getShoppingCartTest() {
//		int param = 2;
//		String product = "product";
//		String user = "user";
//		
//		List<ShoppingCartDTO> list = mapper.getShoppingCart(param, product);
//		log.info("파라미터 값 : " + param);
//		log.info("조회 타입 : " + product);
//		if(list.size() > 0) {
//			for (ShoppingCartDTO dto : list) {
//				log.info(dto);
//			}
//		} else {
//			log.info("리스트의 길이가 0임");
//		}
//		
//		list = mapper.getShoppingCart(param, user);
//		log.info("조회 타입 : " + user);
//		if(list.size() > 0) {
//			for (ShoppingCartDTO dto : list) {
//				log.info(dto);
//			}
//		} else {
//			log.info("리스트의 길이가 0임");
//		}
//	}
}
