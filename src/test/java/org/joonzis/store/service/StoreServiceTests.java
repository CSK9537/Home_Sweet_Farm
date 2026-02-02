package org.joonzis.store.service;

import java.util.List;

import org.joonzis.store.mapper.ProductMapperTests;
import org.joonzis.store.vo.ProductVO;
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
public class StoreServiceTests {
	@Autowired
	StoreService service;
	
//	@Test
//	public void addProductTest() {
//		log.info("StoreServiceTests::addProductTest()");
//		ProductVO vo = new ProductVO();
//		vo.setCategory_id(1);
//		vo.setProduct_name("서비스 테스트");
//		vo.setProduct_price(99999);
//		if(service.addNewProduct(vo) > 1) {
//			log.info("테스트 성공 : " + vo);
//		}
//		else {
//			log.info("테스트 실패");
//		}
//	}
	
//	@Test
//	public void getProductInfoTest() {
//		log.info("StoreServiceTests::getProductInfoTest()");
//		ProductVO vo = service.getProductInfo(22);
//		if(vo != null) {
//			log.info("테스트 성공 : " + vo.toString());	
//		}
//		else {
//			log.info("vo가 null임!!!");
//		}
//	}
	
//	@Test
//	public void getProductListTest() {
//		log.info("StoreServiceTests::getProductListTest()");
//		List<ProductVO> list = service.getProductList();
//		if(list.size() > 0) {
//			for (ProductVO product : list) {
//				log.info(product.toString());
//			}
//		}
//		else log.info("가져온 리스트의 길이가 0 이하임.");
//	}
	
//	@Test
//	public void updateProductInfoTest() {
//		log.info("StoreServiceTests::updateProductInfoTest()");
//		ProductVO vo = service.getProductInfo(21);
//		vo.setProduct_caution("주의사항");
//		vo.setProduct_description_brief("제품 간략 설명");
//		vo.setProduct_description_detail("제품 상세 설명");
//		vo.setProduct_remain(1);
//		
//		log.info("update 예정 데이터 : " + vo);
//		if(service.updateProductInfo(vo) > 0) {
//			log.info("update 완료");
//			log.info("update 이후 DB에 저장된 값" + service.getProductInfo(vo.getProduct_id()));
//		}
//		else {
//			log.info("update 결과가 0");
//		}
//	}
	
//	@Test
//	public void removeProductTest() {
//		log.info("StoreServiceTests::removeProductTest()");
//		int removeId = 21;
//		if(service.removeProduct(removeId) > 0) {
//			log.info("삭제된 ProductId : " + removeId);
//		}
//		else {
//			log.info("삭제된 행의 수가 0 이하임");
//		}
//	}
}
