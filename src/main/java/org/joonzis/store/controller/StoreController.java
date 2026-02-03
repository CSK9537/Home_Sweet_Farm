package org.joonzis.store.controller;

import java.util.List;

import org.joonzis.store.dto.ProductReviewDTO;
import org.joonzis.store.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import lombok.extern.log4j.Log4j;

@Log4j
@Controller
@RequestMapping("store/*")
public class StoreController {
	@Autowired
	StoreService Sservice;
	
	// 메인화면
	@GetMapping("/main")
	public String main(Model model) {
		model.addAttribute("hotList",Sservice.getListOnHot());
		model.addAttribute("saleList", Sservice.getListOnSale());
		return "/store/main";
	}
	
	@GetMapping("/list")
	public String productListByCategory(@RequestParam("category_id") int category_id, Model model) {
		model.addAttribute("list", Sservice.getListByCategoryId(category_id));
		return "/store/list";
	}
	
	// 상세 보기
	@GetMapping("/get")
	public String productInfo(@RequestParam("product_id") int product_id ,Model model) {
		model.addAttribute("product", Sservice.getProductDetail(product_id));
		model.addAttribute("topReview", Sservice.getTopReviewByProductId(product_id));
		return "/store/get";
	}
	// 댓글 전체 보기(REST)
	@GetMapping(
			value="/get/{product_id}/reviewList",
			produces=MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<ProductReviewDTO>> ReviewList(@PathVariable int product_id){
		List<ProductReviewDTO> list = Sservice.getReviewListByProductId(product_id);
		return new ResponseEntity<List<ProductReviewDTO>>(list, HttpStatus.OK);
	}
}
