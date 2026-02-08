package org.joonzis.store.controller;

import java.util.List;

import org.joonzis.store.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.extern.log4j.Log4j;

@Log4j
@Controller
@RequestMapping("store/*")
public class StoreController {
	@Autowired
	StoreService sService;
	@Autowired
	
	
	// 메인화면
	@GetMapping("/main")
	public String main(Model model) {
		model.addAttribute("hotList",sService.getListOnHot());		// hot 리스트
		model.addAttribute("saleList", sService.getListOnSale());	// 세일 중인 리스트
		return "/store/main";
	}
	
	// 카테고리 별 리스트 화면
	@GetMapping("/list/category_id/{category_id}")
	public String productListByCategory(@PathVariable("category_id") int category_id, Model model) {
		model.addAttribute("list", sService.getListByCategoryId(category_id));
		return "/store/list";
	}
	
	// 상세 보기
	@GetMapping("/get/product/{product_id}")
	public String productInfo(@PathVariable("product_id") int product_id ,Model model) {
		model.addAttribute("product", sService.getProductDetail(product_id));
		model.addAttribute("topReview", sService.getTopReviewByProductId(product_id));
		return "/store/get";
	}
}
