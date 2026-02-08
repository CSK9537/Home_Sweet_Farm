package org.joonzis.store.controller;

import java.util.List;

import org.joonzis.store.dto.ProductReviewDTO;
import org.joonzis.store.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.log4j.Log4j;
@Log4j
@RestController
@RequestMapping("store/review")
public class ReviewController {
	@Autowired
	StoreService sService;
	
	// 댓글 전체 보기(REST)
	@GetMapping(
			value="/get/product/{product_id}",
			produces=MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<ProductReviewDTO>> ReviewList(@PathVariable int product_id){
		List<ProductReviewDTO> list = sService.getReviewListByProductId(product_id);
		return new ResponseEntity<List<ProductReviewDTO>>(list, HttpStatus.OK);
	}
}
