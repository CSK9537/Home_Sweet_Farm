package org.joonzis.common.service;

import java.util.List;

import org.joonzis.community.vo.BoardVO;
import org.joonzis.plant.dto.SimplePlantDTO;
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
public class SearchServiceTests {
	
	@Autowired
	private SearchService sservvice;
	
//	@Test
//	public void searchBoardListByTitleTest() {
//		log.info("search board list service test...");
//		try {
//			List<BoardVO> list = sservvice.searchBoardListByTitle("임시");
//			int i = 1;
//			for(BoardVO vo : list) {
//				log.info((i++) + "번째");
//				log.info(vo.getTitle());
//			}
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
	
//	@Test
//	public void searchBoardListByContentTest() {
//		log.info("search board list service test...");
//		try {
//			List<BoardVO> list = sservvice.searchBoardListByContent("임시");
//			int i = 1;
//			for(BoardVO vo : list) {
//				log.info((i++) + "번째");
//				log.info(vo.getTitle());
//				log.info(vo.getContent());
//			}
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
	
//	@Test
//	public void searchBoardListByWriterTest() {
//		log.info("search board list service test...");
//		try {
//			List<BoardVO> list = sservvice.searchBoardListByWriter("mem");
//			int i = 1;
//			for(BoardVO vo : list) {
//				log.info((i++) + "번째");
//				log.info(vo.getTitle());
//				log.info(vo.getUser_id());
//			}
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
	
//	@Test
//	public void searchPlantListTest() {
//		log.info("search plant list service test...");
//		try {
//			List<SimplePlantDTO> list = sservvice.searchPlantList("스킨");
//			int i = 1;
//			for(SimplePlantDTO dto : list) {
//				log.info((i++) + "번째");
//				log.info(dto.getPlant_name());
//				log.info(dto.getPlant_name_kor());
//			}
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
	
//	@Test
//	public void searchProductListTest() {
//		log.info("search product list service test...");
//		try {
//			List<ProductVO> list = sservvice.searchProductList("테스트");
//			int i = 1;
//			for(ProductVO vo : list) {
//				log.info((i++) + "번째");
//				log.info(vo.getProduct_name());
//			}
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
}
