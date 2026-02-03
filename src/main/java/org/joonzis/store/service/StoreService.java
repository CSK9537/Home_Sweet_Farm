package org.joonzis.store.service;

import java.util.List;

import org.joonzis.store.dto.ProductDetailDTO;
import org.joonzis.store.dto.ProductForAdminListDTO;
import org.joonzis.store.dto.ProductForListDTO;
import org.joonzis.store.dto.ProductReviewDTO;
import org.joonzis.store.vo.ProductReviewVO;
import org.joonzis.store.vo.ProductVO;

public interface StoreService {
	public int addNewProduct(ProductVO vo);
	public ProductVO getProductInfo(int product_id);
	public List<ProductVO> getProductList();
	public int updateProductInfo(ProductVO vo);
	public int removeProduct(int product_id);
	
	// 상품 관련 비즈니스 로직
	public List<ProductForListDTO> getListByCategoryId(int category_id);
	public ProductDetailDTO getProductDetail(int product_id);
	public List<ProductForListDTO> getListOnSale();
	public List<ProductForListDTO> getListOnHot();
	
	// 상품 리뷰 관련 비즈니스 로직
	public int insertProductReview(ProductReviewVO vo);
	public List<ProductReviewDTO> getReviewListByProductId(int product_id);
	public ProductReviewDTO getTopReviewByProductId(int product_id);
	
	// 관리자 전용 비즈니스 로직
	public List<ProductForAdminListDTO> getAdminList();
	public List<ProductForAdminListDTO> getAdminListByCategoryId(int category_id);
	public List<ProductForAdminListDTO> getAdminListByPrice();
}
