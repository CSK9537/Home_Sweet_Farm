package org.joonzis.common.controller;

import java.util.List;

import org.joonzis.plant.dto.SimplePlantDTO;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/search/*")
public class SearchController {
	
	@GetMapping("/community")
	public String searchCommunity() {
		return "searchCommunity";
	}
	
	@GetMapping(value = "/plant",
				produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<SimplePlantDTO>> searchPlant(@RequestParam(value = "q", required = false) String q) {
		
		return null;
	}
	
	@GetMapping("/store")
	public String searchStore() {
		return "searchStore";
	}
	
	@GetMapping("/myplant")
	public String searchMyplant() {
		return "searchMyplant";
	}
	
	@GetMapping("/chatting")
	public String searchChatting() {
		return "searchChatting";
	}
	
	@GetMapping("/qna")
	public String searchQna() {
		return "searchQna";
	}
}
