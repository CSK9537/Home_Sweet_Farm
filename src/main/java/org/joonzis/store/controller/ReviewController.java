package org.joonzis.store.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.joonzis.store.dto.ProductReviewDTO;
import org.joonzis.store.service.StoreService;
import org.joonzis.store.vo.ProductReviewVO;
import org.joonzis.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaTypeFactory;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

import lombok.extern.log4j.Log4j;
@Log4j
@RestController
@RequestMapping("store/review")
public class ReviewController {
	@Autowired
	StoreService sService;
	
	@Value("${hsf.upload.root:\\\\192.168.0.153\\\\projecthsf}")
	private String uploadRoot;
	
	// 제품 기준 리뷰 전체 보기(REST)
	@GetMapping(
			value="/get/product/{product_id}",
			produces=MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<ProductReviewDTO>> ReviewList(
			@PathVariable int product_id,
			@RequestParam(value="sortBy", defaultValue="latest") String sortBy,
			@RequestParam(value="filterRating", defaultValue="all") String filterRating,
			@RequestParam(value="filterImage", defaultValue="all") String filterImage){
		List<ProductReviewDTO> list = sService.getReviewListByProductId(product_id, sortBy, filterRating, filterImage);
		return new ResponseEntity<List<ProductReviewDTO>>(list, HttpStatus.OK);
	}
	
	// 리뷰 추가
	@PostMapping(
			value="add/product/{product_id}",
			consumes = MediaType.APPLICATION_JSON_VALUE,
			produces = "text/plain;charset=UTF-8")
	public ResponseEntity<String> addReview(
			@PathVariable("product_id")int product_id,
			@RequestBody Map<String, Object> params,
			HttpSession session){
		UserVO user = (UserVO)session.getAttribute("loginUser");
		if(user == null) {
			return new ResponseEntity<String>("403",HttpStatus.BAD_REQUEST);
		}
		
		String tempKey = (String)params.get("tempKey");
		ProductReviewVO vo = new ProductReviewVO();
		vo.setProduct_id(product_id);
		vo.setWriter_id(user.getUser_id());
		vo.setReview_title((String)params.get("review_title"));
		vo.setReview_content((String)params.get("review_content"));
		vo.setReview_rate(Integer.parseInt(params.get("review_rate").toString()));
		
		String result = "success";
		try {
			sService.addProductReview(vo, tempKey);
		} catch (DuplicateKeyException e) {
			result = "Duplicate Key";
			return new ResponseEntity<String>(result,HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<String>(result ,HttpStatus.OK);
	}
	
	// 임시 이미지 업로드 (커뮤니티 방식)
	@PostMapping(value="/uploadTemp", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Map<String, String>> uploadTemp(
			@RequestParam("file") MultipartFile file,
			@RequestParam("tempKey") String tempKey) {
		
		Map<String, String> result = new java.util.HashMap<>();
		try {
			String savedName = sService.uploadTempReviewImage(file, tempKey);
			result.put("savedName", savedName);
			result.put("status", "success");
			return new ResponseEntity<>(result, HttpStatus.OK);
		} catch (Exception e) {
			result.put("status", "error");
			return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	// 리뷰 이미지 스트리밍 (커뮤니티 방식 참고)
	@GetMapping("/display")
	public ResponseEntity<Resource> display(@RequestParam("imgName") String imgName) throws IOException {
		// imgName 예: "/review_upload/20260303/uuid_name.jpg"
		
		// 경로 안전 처리를 위해 시작 슬래시 제거
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
	
	// 리뷰 수정
	@PutMapping(
			value = "modify/review/{product_review_id}",
			produces = "text/plain;charset=UTF-8")
	public ResponseEntity<String> modifyProductReview(
			@PathVariable("product_review_id") int product_review_id,
			@RequestBody ProductReviewVO vo){
		vo.setProduct_review_id(product_review_id);
		if(sService.modifyProductReview(vo) == 0) return new ResponseEntity<String>(HttpStatus.BAD_REQUEST);
		return new ResponseEntity<String>(HttpStatus.OK);
	}
	
	// 리뷰 삭제
	@DeleteMapping(
			value = "remove/review/{product_review_id}",
			produces = "text/plain;charset=UTF-8")
	public ResponseEntity<String> removeReview(
			@PathVariable("product_review_id")int product_review_id){
		int result = sService.removeProductReview(product_review_id);
		if(result > 0) return new ResponseEntity<String>(HttpStatus.OK);
		else return new ResponseEntity<String>("Database does not changed",HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	// 유저가 쓴 리뷰들 조회
	@GetMapping(
			value="get/user",
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<ProductReviewDTO>> getReviewsByUserId(
			HttpSession session){
		int user_id = ((UserVO)session.getAttribute("loginUser")).getUser_id();
		List<ProductReviewDTO> list = sService.getReviewListByUserId(user_id);
		return new ResponseEntity<List<ProductReviewDTO>>(list, HttpStatus.OK);
	}
}
