package org.joonzis.store.service;

import java.util.List;

import org.joonzis.store.dto.ProductDetailDTO;
import org.joonzis.store.dto.ProductForListDTO;
import org.joonzis.store.vo.ProductVO;

public interface StoreService {
	public int addNewProduct(ProductVO vo);
	public ProductVO getProductInfo(int product_id);
	public List<ProductVO> getProductList();
	public int updateProductInfo(ProductVO vo);
	public int removeProduct(int product_id);
	
	public List<ProductForListDTO> getListByCategoryId(int category_id);
	public ProductDetailDTO getProductDetail(int product_id);
	public List<ProductForListDTO> getListOnSale();
	public List<ProductForListDTO> getListOnHot();
	
}
