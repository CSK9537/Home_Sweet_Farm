package org.joonzis.store.controller;

import java.util.List;

import org.joonzis.store.dto.ProductReviewDTO;
import org.joonzis.store.service.StoreService;
import org.joonzis.store.vo.ProductReviewVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
	
	// 댓글 추가
	@PostMapping(
			value="add/product/{product_id}/user/{user_id}")
	public ResponseEntity<String> addReview(
			@PathVariable("product_id")int product_id,
			@PathVariable("user_id")int user_id,
			@RequestBody ProductReviewVO vo){
		vo.setProduct_id(product_id);
		vo.setWriter_id(user_id);
		if (sService.addProductReview(vo) == 0) return new ResponseEntity<String>(HttpStatus.BAD_REQUEST);
		return new ResponseEntity<String>("OK" ,HttpStatus.OK);
	}
	
	@PutMapping(
			value = "modify/review/{product_review_id}",
			produces=MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> modifyProductReview(
			@PathVariable("product_review_id") int product_review_id,
			@RequestBody ProductReviewVO vo){
		vo.setProduct_review_id(product_review_id);
		if(sService.modifyProductReview(vo) == 0) return new ResponseEntity<String>(HttpStatus.BAD_REQUEST);
		return new ResponseEntity<String>(HttpStatus.OK);
	}
}
