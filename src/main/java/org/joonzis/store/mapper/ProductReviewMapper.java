package org.joonzis.store.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.joonzis.store.dto.ProductReviewDTO;
import org.joonzis.store.vo.ProductReviewVO;

public interface ProductReviewMapper {
	public int insertProductReview(ProductReviewVO vo);
	public ProductReviewVO getProductReview(int product_review_id); // vo 수정용을 위한 함수인가?
	public List<ProductReviewVO> getListProductReviews();
	public int updateProductReview(ProductReviewVO vo);
	public int deletePrdouctReview(int product_review_id);
	public int deleteProductReviewByProductId(int product_id);
	
	public ProductReviewDTO getFirstTopReview(int product_id);
	public List<ProductReviewDTO> getReviewOneOrList(
			@Param("data")int param, 
			@Param("type")String type);
}
