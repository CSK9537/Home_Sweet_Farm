package org.joonzis.common.mapper;

import java.util.ArrayList;
import java.util.List;

import org.joonzis.community.vo.BoardVO;
import org.joonzis.plant.dto.SimplePlantDTO;
import org.joonzis.store.vo.ProductVO;
import org.joonzis.user.vo.UserVO;
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
public class SearchMapperTests {
	
	@Autowired
	private SearchMapper smapper;
	
//	@Test
//	public void findUserbyIdTest() {
//		log.info("find user by id test");
//		try {
//			UserVO vo = smapper.findUserbyId(105);
//			log.info(vo.getUsername());
//			log.info(vo.getNickname());
//			log.info(vo.getName());
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
	
//	@Test
//	public void searchBoardsByTitleTest() {
//		log.info("search boards by title test");
//		try {
//			List<BoardVO> list = new ArrayList<BoardVO>();
//			list = smapper.searchBoardsByTitle("제목");
//			int i = 1;
//			for(BoardVO vo : list) {
//				log.info((i++) + "번째");
//				log.info(vo.getTitle());
//			}
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
//	
//	@Test
//	public void searchBoardsByContentTest() {
//		log.info("search boards by content test");
//		try {
//			List<BoardVO> list = new ArrayList<BoardVO>();
//			list = smapper.searchBoardsByContent("내용");
//			int i = 1;
//			for(BoardVO vo : list) {
//				log.info((i++) + "번째");
//				log.info(vo.getContent());
//			}
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
	
//	@Test
//	public void searchBoardsByWriterTest() {
//		log.info("search boards by writer test");
//		try {
//			List<BoardVO> list = new ArrayList<BoardVO>();
//			list = smapper.searchBoardsByWriter("mem");
//			int i = 1;
//			for(BoardVO vo : list) {
//				log.info((i++) + "번째");
//				log.info(vo.getContent());
//			}
//		} catch (Exception e) {
//			log.error(e);
//		}
//	}
	
//	@Test
//	public void searchPlantsTest() {
//		log.info("search plants test...");
//		try {
//			List<SimplePlantDTO> list = new ArrayList<SimplePlantDTO>();
//			list = smapper.searchPlants("mons");
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
//	public void searchProductsTest() {
//		log.info("search products test...");
//		try {
//			List<ProductVO> list = new ArrayList<ProductVO>();
//			list = smapper.searchProducts("테스트");
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
