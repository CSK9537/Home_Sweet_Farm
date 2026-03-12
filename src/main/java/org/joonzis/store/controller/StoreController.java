package org.joonzis.store.controller;


import javax.servlet.http.HttpSession;

import org.joonzis.store.dto.SearchProductDTO;
import org.joonzis.store.vo.ProductCategoryVO;
import org.joonzis.user.vo.UserVO;
import org.joonzis.store.service.ShoppingCartService;
import org.joonzis.store.service.StoreService;
import org.joonzis.store.vo.ProductVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaTypeFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import lombok.extern.log4j.Log4j;

@Log4j
@Controller
@RequestMapping("/store")
public class StoreController {
	@Autowired
	StoreService sService;
	@Autowired
	ShoppingCartService cService;
	
	@Value("${hsf.upload.root:\\\\192.168.0.153\\\\projecthsf}")
	private String uploadRoot;
	
	
	// 메인화면
	@GetMapping("")
	public String main(Model model) {
		model.addAttribute("hotProducts",sService.getListOnHot());		// hot 리스트
		model.addAttribute("saleProducts", sService.getListOnSale());	// 세일 중인 리스트
		model.addAttribute("categoryList", sService.selectListCategory());
		return "/store/StoreMain";
	}
	
	// 카테고리 별 리스트 화면
	@GetMapping("/productListPage/category/{category_id}")
	public String productListByCategory(@PathVariable("category_id") int category_id, Model model) {
		log.info("productListByCategory - category_id: " + category_id);
		
		model.addAttribute("products", sService.getListByCategoryId(category_id));
		model.addAttribute("categoryList", sService.selectListCategory());
		
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
		model.addAttribute("categoryList", sService.selectListCategory());
		return "/store/StoreView";
	}

	// 찜목록+장바구니 통합 페이지로 이동
//	@PreAuthorize("hasRole('ROLE_USER')")
	@GetMapping("/wishListPage")
	public String wishListCombined(Model model, HttpSession session) {
		// 임시 권한처리
		// 주석처리해둔 권한 확인 어노테이션을 사용하면, 자동으로 처리되니, try는 빼고 세션에서 user_id 가져오는 부분만 있으면 됨
		UserVO loginUser = ((UserVO)session.getAttribute("loginUser"));
		if(loginUser == null) {
			log.warn("로그인하지 않은 사용자");
			return "redirect:/user/login";
		}
		
		int user_id = loginUser.getUser_id();
		
		model.addAttribute("wishList", cService.getWishListByUserId(user_id));
		model.addAttribute("cartList", cService.getShoppingCartByUserId(user_id));
		return "/store/wishList";
	}
	@GetMapping("/sale")
	public String saleList(Model model) {
		model.addAttribute("products", sService.getListOnSale());
		model.addAttribute("categoryList", sService.selectListCategory());
		model.addAttribute("categoryName", "세일 중인 상품");
		return "/store/StoreList";
	}
	
	@GetMapping("/search")
	public String searchProductList(
			@ModelAttribute SearchProductDTO search, 
			Model model) {
		
		log.info("searchProductList - params: " + search);
		
		// category_id 파라미터가 들어올 경우 categoryId로 매핑 (하위 호환 및 null 방지)
//		if (search.getCategoryId() == null && old_category_id != null) {
//			search.setCategoryId(old_category_id);
//		}
		
		model.addAttribute("products", sService.searchProduct(search));
		model.addAttribute("categoryList", sService.selectListCategory());
		
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
	
	// 결제 성공 페이지 이동
	@GetMapping("/order/success")
	public String orderSuccess(
			@RequestParam String orderId,
			@RequestParam String paymentKey,
			@RequestParam int amount,
			Model model) {
		model.addAttribute("paymentKey", paymentKey);
		model.addAttribute("orderId", orderId);
		model.addAttribute("amount", amount);
		return "store/success";
	}

	// 결제 실패 페이지 이동
	@GetMapping("/order/fail")
	public String orderFail(Model model, 
			@RequestParam(value = "code", required = false) String code,
			@RequestParam(value = "message", required = false) String message) {
		model.addAttribute("code", code);
		model.addAttribute("message", message);
		return "/store/fail";
	}
	
	// 주문목록 페이지로 이동
	@GetMapping("/orderListPage")
	public String orderListPage(Model model, HttpSession session) {
		// 임시 권한처리
		UserVO loginUser = ((UserVO)session.getAttribute("loginUser"));
		if(loginUser == null) {
			log.warn("로그인하지 않은 사용자");
			return "redirect:/user/login";
		}
		
		return "/store/orderList";
	}

	// [관리자 전용] 상품 등록 페이지 이동
	@GetMapping("/admin/product/form")
	public String adminProductForm(Model model) {
		model.addAttribute("categoryList", sService.selectListCategory());
		model.addAttribute("tempKey", UUID.randomUUID().toString());
		return "/store/AdminProductForm";
	}

	// [관리자 전용] 상품 이미지 임시 업로드
	@PostMapping(
			value = "/admin/product/uploadTemp",
			produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public ResponseEntity<Map<String, Object>> uploadTempProductImage(
			@RequestParam("file") MultipartFile file,
			@RequestParam("tempKey") String tempKey) {
		Map<String, Object> result = new HashMap<>();
		try {
			String savedName = sService.uploadTempProductImage(file, tempKey);
			result.put("savedName", savedName);
			result.put("status", "success");
			return new ResponseEntity<>(result, HttpStatus.OK);
		} catch (Exception e) {
			result.put("status", "error");
			return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// [관리자 전용] 상품 최종 등록
	@PostMapping(
			value = "/admin/product/add",
			produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public ResponseEntity<Map<String, Object>> addProduct(
			@RequestBody Map<String, Object> payload) {
		Map<String, Object> result = new HashMap<>();
		try {
			// Payload 데이터 파싱
			ProductVO vo = new ProductVO();
			vo.setCategory_id(Integer.parseInt(payload.get("category_id").toString()));
			vo.setProduct_name(payload.get("product_name").toString());
			vo.setProduct_price(Integer.parseInt(payload.get("product_price").toString()));
			vo.setProduct_delivery_price(Integer.parseInt(payload.get("product_delivery_price").toString()));
			vo.setProduct_remain(Integer.parseInt(payload.get("product_remain").toString()));
			vo.setProduct_description_brief(payload.get("product_description_brief").toString());
			vo.setProduct_description_detail(payload.get("product_description_detail").toString());
			vo.setProduct_caution(payload.get("product_caution").toString());
			vo.setProduct_sale(Integer.parseInt(payload.get("product_sale").toString()));

			String tempKey = payload.get("tempKey").toString();

			int productId = sService.registerProduct(vo, tempKey);

			if (productId > 0) {
				result.put("status", "success");
				result.put("productId", productId);
				return new ResponseEntity<>(result, HttpStatus.OK);
			} else {
				result.put("status", "error");
				return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
			}
		} catch (Exception e) {
			log.error("Failed to register product", e);
			result.put("status", "error");
			return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// 상품 이미지 스트리밍
	@GetMapping("/display")
	public ResponseEntity<Resource> display(@RequestParam("imgName") String imgName) throws IOException {
		if (imgName.startsWith("/")) {
			imgName = imgName.substring(1);
		}
		
		Path filePath = Paths.get(uploadRoot, imgName).toAbsolutePath().normalize();
		Resource resource = new UrlResource(filePath.toUri());
		
		if (!resource.exists()) {
			return ResponseEntity.notFound().build();
		}

		return ResponseEntity.ok()
				.contentType(MediaTypeFactory.getMediaType(resource).orElse(MediaType.APPLICATION_OCTET_STREAM))
				.body(resource);
	}
}
