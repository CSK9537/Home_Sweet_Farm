package org.joonzis.store.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.joonzis.store.dto.SearchProductDTO;
import org.joonzis.store.vo.ProductCategoryVO;
import org.joonzis.user.vo.UserVO;
import org.joonzis.store.service.ShoppingCartService;
import org.joonzis.store.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
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
		log.info("productListByCategory - category_id: " + category_id);
		
		model.addAttribute("products", sService.getListByCategoryId(category_id));
		
		// JSP에서 사용하는 categoryName 처리를 위해 추가
		ProductCategoryVO category = sService.getCategoryInfo(category_id);
		if(category != null) {
			model.addAttribute("categoryName", category.getCategory_name());
		}
		
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
	@GetMapping("/cartPage")
	public String cartList(Model model,HttpSession session) {
//		int user_id = ((UserVO)session.getAttribute("loginUser")).getUser_id();
		int user_id = 2;
		model.addAttribute("list",cService.getShoppingCartByUserId(user_id));
		return "/store/cart";
	}
	
	// 찜목록으로 이동
	@GetMapping("/wishPage")
	public String wishList(Model model, HttpSession session) {
//		int user_id = ((UserVO)session.getAttribute("loginUser")).getUser_id();
		int user_id = 2;
		model.addAttribute("list", cService.getWishListByUserId(user_id));
		return "/store/wish";
	}
	@GetMapping("/sale")
	public String saleList(Model model) {
		model.addAttribute("products", sService.getListOnSale());
		return "/store/StoreList";
	}
	
	@GetMapping("/search")
	public String searchProductList(
			@RequestParam(value="category_id", required=false) Integer old_category_id,
			@ModelAttribute SearchProductDTO search, 
			Model model) {
		
		log.info("searchProductList - params: " + search);
		
		// category_id 파라미터가 들어올 경우 categoryId로 매핑 (하위 호환 및 null 방지)
		if (search.getCategoryId() == null && old_category_id != null) {
			search.setCategoryId(old_category_id);
		}
		
		model.addAttribute("products", sService.searchProduct(search));
		
		// 검색 결과 시 카테고리명 표시
		if (search.getCategoryId() != null && search.getCategoryId() != 0) {
			ProductCategoryVO category = sService.getCategoryInfo(search.getCategoryId());
			if(category != null) {
				model.addAttribute("categoryName", category.getCategory_name());
			}
		} else if (search.getKeyword() != null && !search.getKeyword().isEmpty()){
			model.addAttribute("categoryName", "'" + search.getKeyword() + "' 검색 결과");
		}
		
		return "/store/StoreList";
	}
}
