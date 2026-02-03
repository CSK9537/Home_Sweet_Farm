package org.joonzis.store.mapper;

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
//			log.info("Insert 완료!");
//		} else {
//			log.info("Insert 실패...");
//		}
//	}
	
	@Test
	public void getWishListByUserIdTest() {
		
	}
}
