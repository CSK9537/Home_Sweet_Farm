package org.joonzis.common.controller;

import java.util.List;

import org.joonzis.common.service.SearchService;
import org.joonzis.plant.dto.SimplePlantDTO;
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
	
	// 식물 검색
	@GetMapping(value = "/plantsimple",
				produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<SimplePlantDTO>> plantSearchResult(@RequestParam(value = "q", required = false) String q) {
		return new ResponseEntity<List<SimplePlantDTO>>(sservice.searchPlantList10(q), HttpStatus.OK);
	}
	
}
