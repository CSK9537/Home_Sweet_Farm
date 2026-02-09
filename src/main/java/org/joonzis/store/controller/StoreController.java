package org.joonzis.store.controller;

import java.util.List;

import org.joonzis.store.service.ShoppingCartService;
import org.joonzis.store.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import lombok.extern.log4j.Log4j;

@Log4j
@Controller
@RequestMapping("/store")
public class StoreController {
	@Autowired
	StoreService sService;
	@Autowired
	ShoppingCartService cService;
	
	
	// 메인화면
	@GetMapping("/mainPage")
	public String main(Model model) {
		model.addAttribute("hotProducts",sService.getListOnHot());		// hot 리스트
		model.addAttribute("saleProducts", sService.getListOnSale());	// 세일 중인 리스트
		return "/store/StoreMain";
	}
	
	// 카테고리 별 리스트 화면
	@GetMapping("/productListPage/category/{category_id}")
	public String productListByCategory(@PathVariable("category_id") int category_id, Model model) {
		model.addAttribute("products", sService.getListByCategoryId(category_id));
		return "/store/StoreList";
	}
	
	// 상세 보기
	@GetMapping("/product/detail")
	public String productInfo(@RequestParam("product_id") int product_id ,Model model) {
		model.addAttribute("product", sService.getProductDetail(product_id));
		model.addAttribute("topReview", sService.getTopReviewByProductId(product_id));
		return "/store/StoreView";
	}
	
	// 장바구니 확인 페이지 이동
	@GetMapping("/cartPage/user/{user_id}")
	public String cartList(@PathVariable("user_id")int user_id, Model model) {
		model.addAttribute("list",cService.getShoppingCartByUserId(user_id));
		return "/store/cart";
	}
	
	// 찜목록으로 이동
	@GetMapping("/wishPage/user/{user_id}")
	public String wishList(@PathVariable("user_id") int user_id, Model model) {
		model.addAttribute("list", cService.getWishListByUserId(user_id));
		return "/store/wish";
	}
	@GetMapping("/sale")
	public String saleList(Model model) {
		model.addAttribute("products", sService.getListOnSale());
		return "/store/StoreList";
	}
}
