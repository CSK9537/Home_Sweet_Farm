package org.joonzis.store.mapper;

import java.util.List;

import org.joonzis.store.dto.ProductForListDTO;
import org.joonzis.store.dto.SearchProductDTO;
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
public class SearchProductTests {
	@Autowired
	ProductMapper mapper;
	
//	@Test
//	public void searchProductTest1() {
//		SearchProductDTO search = new SearchProductDTO();
//		search.setKeyword("테");
//		List<ProductForListDTO> result = mapper.searchProductList(search);
//		
//		if(result.size() > 0) {
//			for (ProductForListDTO productForListDTO : result) {
//				log.info("검색 결과 : " + productForListDTO);
//			}
//		} else log.info("검색에 실패함. 검색 조건을 다시 확인해 볼 것.");
//	}
	
//	@Test
//	public void searchProductTest2() {
//		SearchProductDTO search = new SearchProductDTO();
//		search.setKeyword("테");
//		search.setMaxSale(10);
//		List<ProductForListDTO> result = mapper.searchProductList(search);
//		
//		if(result.size() > 0) {
//			for (ProductForListDTO productForListDTO : result) {
//				log.info("검색 결과 : " + productForListDTO);
//			}
//		} else log.info("검색에 실패함. 검색 조건을 다시 확인해 볼 것.");
//	}
	
//	@Test
//	public void searchProductTest3() {
//		SearchProductDTO search = new SearchProductDTO();
//		search.setKeyword("테");
//		search.setMaxSale(10);
//		search.setMinSale(10);
//		List<ProductForListDTO> result = mapper.searchProductList(search);
//		
//		if(result.size() > 0) {
//			for (ProductForListDTO productForListDTO : result) {
//				log.info("검색 결과 : " + productForListDTO);
//			}
//		} else log.info("검색에 실패함. 검색 조건을 다시 확인해 볼 것.");
//	}
	
//	@Test
//	public void searchProductTest4() {
//		SearchProductDTO search = new SearchProductDTO();
//		search.setCategoryId(1);
//		search.setMinPrice(50000);
//		search.setMaxPrice(400000);
//		List<ProductForListDTO> result = mapper.searchProductList(search);
//		
//		if(result.size() > 0) {
//			for (ProductForListDTO productForListDTO : result) {
//				log.info("검색 결과 : " + productForListDTO);
//			}
//		} else log.info("검색에 실패함. 검색 조건을 다시 확인해 볼 것.");
//	}
}
