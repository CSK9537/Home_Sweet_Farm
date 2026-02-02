package org.joonzis.store.mapper;

import java.util.List;

import org.joonzis.store.vo.ProductReviewVO;

public interface ProductReviewMapper {
	public int insertProductReview(ProductReviewVO vo);
	public ProductReviewVO getProductReview(int product_review_id);
	public List<ProductReviewVO> getListProductReviews();
	public int updateProductReview(ProductReviewVO vo);
	public int deletePrdouctReview(int product_review_id);
}
