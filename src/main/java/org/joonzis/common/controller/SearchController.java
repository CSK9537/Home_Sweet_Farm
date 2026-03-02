package org.joonzis.common.controller;

import java.util.List;

import org.joonzis.common.service.SearchService;
import org.joonzis.community.vo.BoardVO;
import org.joonzis.plant.dto.SimplePlantDTO;
import org.joonzis.store.vo.ProductVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/search/*")
public class SearchController {
	
	@Autowired
	private SearchService sservice;
	
	// 최대 10개
	// 커뮤니티 검색
	// 제목
	@GetMapping(value = "/community/title",
				produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<BoardVO>> communityTitleSearchResult(@RequestParam(value = "q", required = false) String q) {
		return new ResponseEntity<List<BoardVO>>(sservice.searchBoardListByTitle(q), HttpStatus.OK);
	}
	// 내용
	@GetMapping(value = "/community/content",
				produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<BoardVO>> communityContentSearchResult(@RequestParam(value = "q", required = false) String q) {
		return new ResponseEntity<List<BoardVO>>(sservice.searchBoardListByContent(q), HttpStatus.OK);
	}
	// 작성자
	@GetMapping(value = "/community/writer",
				produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<BoardVO>> communityWriterSearchResult(@RequestParam(value = "q", required = false) String q) {
		return new ResponseEntity<List<BoardVO>>(sservice.searchBoardListByWriter(q), HttpStatus.OK);
	}
	
	// 식물 검색
	@GetMapping(value = "/plant",
				produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<SimplePlantDTO>> plantSearchResult(@RequestParam(value = "q", required = false) String q) {
		return new ResponseEntity<List<SimplePlantDTO>>(sservice.searchPlantList(q), HttpStatus.OK);
	}
	
	// 스토어 검색
	@GetMapping(value = "/store",
				produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<ProductVO>> productSearchResult(@RequestParam(value = "q", required = false) String q) {
		return new ResponseEntity<List<ProductVO>>(sservice.searchProductList(q), HttpStatus.OK);
	}
}
