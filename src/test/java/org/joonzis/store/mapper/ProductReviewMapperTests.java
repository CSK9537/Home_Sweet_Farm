package org.joonzis.store.mapper;

import java.util.List;

import org.joonzis.store.dto.ProductReviewDTO;
import org.joonzis.store.vo.ProductReviewVO;
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
public class ProductReviewMapperTests {
	@Autowired
	ProductReviewMapper mapper;
	
//	@Test
//	public void insertReviewTest() {
//		log.info("ProductReviewMapperTests::insertReviewTest()");
//		ProductReviewVO vo = new ProductReviewVO();
//		vo.setProduct_id(2);
//		vo.setWriter_id(2);
//		vo.setReview_content("리뷰 테스트");
//		vo.setReview_rate(10);
//		int result = mapper.insertProductReview(vo);
//		if(result > 0) log.info("Insert 성공");
//		else log.info("Insert 실패");
//	}
	
//	@Test
//	public void getReviewTest() {
//		log.info("ProductReviewMapperTests::getReviewTest()");
//		int id = 1;
//		ProductReviewVO vo = mapper.getProductReview(id);
//		log.info("가져온 vo : " + vo);
//	}
	
//	@Test
//	public void getReviewListTest() {
//		log.info("ProductReviewMapperTests::getReviewListTest");
//		List<ProductReviewVO> list = mapper.getListProductReviews();
//		if(list.size() > 0) {
//			for (ProductReviewVO review : list) {
//				log.info(review);
//			}
//		}
//		else log.info("가져온 리스트의 길이가 0 이하임.");
//	}
	
//	@Test
//	public void updateReviewTest() {
//		ProductReviewVO vo = mapper.getProductReview(1);
//		vo.setReview_content(vo.getReview_content()+"@");
//		vo.setReview_rate(vo.getReview_rate()-1);
//		if(mapper.updateProductReview(vo) > 0) {
//			log.info("Update 완료");
//			log.info("수정 이후 : " + mapper.getProductReview(vo.getProduct_review_id()));
//		}
//		else {
//			log.info("Update가 이뤄지지 않음.");
//		}
//	}
	
//	@Test
//	public void getReviewListByProductIdTest() {
//		int product_id = 2;
//		List<ProductReviewDTO> list = mapper.getReviewListByProductId(product_id);
//		if(list.size() > 0) {
//			log.info("list의 길이가 0보다 긺.");
//			for (ProductReviewDTO review : list) {
//				log.info(review);
//			}
//		} else {
//			log.info("list의 길이가 0임");
//		}
//	}
	
//	@Test
//	public void getTopReviewTest() {
//		int product_id = 2;
//		ProductReviewDTO review = mapper.getFirstTopReview(product_id);
//		log.info("가져온 데이터 : " + review);
//	}
}
