package org.joonzis.store.mapper;

import java.util.List;

import org.joonzis.store.dto.ProductDetailDTO;
import org.joonzis.store.dto.ProductForListDTO;
import org.joonzis.store.vo.ProductVO;

public interface ProductMapper {
	public int insertTest(ProductVO vo);
	public ProductVO selectOne(int product_id);
	public List<ProductVO> selectList();
	public int updateTest(ProductVO vo);
	public int deleteTest(int product_id);
	
	// 카테고리를 기준으로 상품 리스트 업
	public List<ProductForListDTO> getProductListByCategoryId(int category_id);
	// 상품 상세 보기
	public ProductDetailDTO getProductDetail(int product_id);
	// 오늘의 Hot 추천
	public List<ProductForListDTO> getProductListOnHot();
	// 세일 Now
	public List<ProductForListDTO> getProductListOnSale();
}
