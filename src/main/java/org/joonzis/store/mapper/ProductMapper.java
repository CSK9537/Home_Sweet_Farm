package org.joonzis.store.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.joonzis.store.dto.ProductDetailDTO;
import org.joonzis.store.dto.ProductForAdminListDTO;
import org.joonzis.store.dto.ProductForListDTO;
import org.joonzis.store.dto.SearchProductDTO;
import org.joonzis.store.vo.ProductCategoryVO;
import org.joonzis.store.vo.ProductVO;

public interface ProductMapper {
	public int insertProduct(ProductVO vo);
	public ProductVO getProduct(int product_id);
	public List<ProductVO> getProductList();
	public int updateProduct(ProductVO vo);
	public int deleteProduct(int product_id);
	
	// 카테고리 관련
	public int insertCategory(ProductCategoryVO vo);
	public ProductCategoryVO selectOneCategory(int category_id);
	public List<ProductCategoryVO> selectListCategory();
	public int updateCategory(ProductCategoryVO vo);
	public int deleteCategory(int category_id);
	
	// 일반 사용자용
	// 카테고리를 기준으로 상품 리스트 업
	public List<ProductForListDTO> getProductListByCategoryId(@Param("category_id")int category_id);
	// 상품 상세 보기
	public ProductDetailDTO getProductDetail(int product_id);
	// 오늘의 Hot 추천
	public List<ProductForListDTO> getProductListOnHot();
	// 세일 Now
	public List<ProductForListDTO> getProductListOnSale();
	
	// admin용
	// 전체 List용
	public List<ProductForAdminListDTO> getProductAdminList();
	// 카테고리별
	public List<ProductForAdminListDTO> getProductAdminListByCategoryId(int category_id);
	// 가격별
	public List<ProductForAdminListDTO> getProductAdminListByPrice();
	
	// 검색
	public List<ProductForListDTO> searchProductList(SearchProductDTO search);
	
	// 재고 차감
	public int decreaseProductRemain(@Param("product_id")int product_id, @Param("product_count")int product_count);
}
