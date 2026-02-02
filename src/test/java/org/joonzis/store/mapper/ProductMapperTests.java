package org.joonzis.store.mapper;

import java.util.List;

import org.joonzis.store.dto.ProductDetailDTO;
import org.joonzis.store.dto.ProductForListDTO;
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
public class ProductMapperTests {
	@Autowired
	private ProductMapper mapper;
	
//	@Test
//	public void insertTest() {
//		log.info(this.getClass().toString() + "::insertTest()");
//		
//		ProductVO vo = new ProductVO();
//		vo.setCategory_id(1);
//		vo.setProduct_name("테스트 상품");
//		vo.setProduct_price(10000);
//		
//		log.info(this.getClass().toString() + "::TestVO : " + vo.toString());
//		
//		if(mapper.insertTest(vo) > 1) {
//			log.info("Insert 테스트 성공!");
//		} else {
//			log.info("Insert 테스트 실패...");
//		}
//	}

//	@Test
//	public void getTest() {
//		log.info(this.getClass()+"::getTest()");
//		
//		ProductVO vo = mapper.selectOne(1);
//		
//		if(vo != null) {
//			log.info("테스트 성공!");
//			log.info(vo);
//		}
//		else {
//			log.info("테스트 실패...");
//		}
//	}
	
//	@Test
//	public void getListTest() {
//		log.info(this.getClass()+"::getListTest()");
//		
//		List<ProductVO> list = mapper.selectList();
//		
//		if(list.size() > 0) {
//			log.info("테스트 성공!");
//			for (ProductVO productVO : list) {
//				log.info(productVO);
//			}
//		}
//		else {
//			log.info("테스트 실패...");
//		}
//	}
	
//	@Test
//	public void updateTest() {
//		log.info(this.getClass()+"::updateTest()");
//		
//		List<ProductVO> list = mapper.selectList();
//		int updateId = 0;
//		ProductVO vo = null;
//		for (ProductVO productVO : list) {
//			if(productVO.getProduct_name().equals("테스트 상품")) {
//				updateId = productVO.getProduct_id();
//				vo = productVO;
//			}
//		}
//		
//		vo.setProduct_name(vo.getProduct_name()+"@");
//		
//		log.info("수정된 vo : " + vo);
//		
//		if(mapper.updateTest(vo) > 0) {
//			log.info("테스트 성공!");
//		} else {
//			log.info("테스트 실패...");
//		}
//	}
	
//	@Test
//	public void deleteTest() {
//		log.info(this.getClass()+"::deleteTest()");
//		
//		List<ProductVO> list = mapper.selectList();
//		int deleteId = 0;
//		for (ProductVO productVO : list) {
//			if(productVO.getProduct_name().equals("테스트 상품")) deleteId = productVO.getProduct_id();
//		}
//		
//		log.info("deleteId : " + deleteId);
//		
//		if(mapper.deleteTest(deleteId) > 0) {
//			log.info("테스트 성공!");
//		}
//	}
	
//	@Test
//	public void getProductForListDTOTest() {
//		log.info("ProductMapper::getProductForListDTOTest()");
//		List<ProductForListDTO> list = mapper.getProductListByCategoryId(1);
//		if(list.size() > 0) {
//			for (ProductForListDTO dto : list) {
//				log.info("가져온 데이터 : " + dto);
//			}
//		}
//		else log.info("데이터 리스트의 길이가 0 이하!");
//	}
	
//	@Test
//	public void getProductDetailTest() {
//		log.info("ProductMapperTests::getProductDetail()");
//		ProductDetailDTO dto = mapper.getProductDetail(2);
//		if(dto != null) {
//			log.info("이미지 이름들");
//			for (String image_name : dto.getImage_list()) {
//				log.info(image_name);
//			}
//			log.info("가져온 데이터 : " + dto);
//		} else {
//			log.info("가져온 데이터가 없음");
//		}
//	}
	
//	@Test
//	public void getProductListOnSaleTest() {
//		List<ProductForListDTO> list = mapper.getProductListOnSale();
//		if(list.size()>0) {
//			for (ProductForListDTO product : list) {
//				log.info(product);
//				log.info("상품 원래 가격 : " + product.getProduct_price());
//				log.info("세일 후 가격 : " + (product.getProduct_price() - product.getProduct_price() * (product.getProduct_sale()*0.01)));
//			}
//		} else {
//			log.info("list가 비어있음.");
//		}
//	}
	
//	@Test
//	public void getProductListOnHotTest() {
//		List<ProductForListDTO> list = mapper.getProductListOnHot();
//		if(list.size()>0) {
//			for (ProductForListDTO product : list) {
//				log.info(product);
//			}
//		} else {
//			log.info("list가 비어있음.");
//		}
//	}
}
