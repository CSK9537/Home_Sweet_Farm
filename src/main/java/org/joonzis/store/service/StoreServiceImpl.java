package org.joonzis.store.service;

import java.util.List;

import org.joonzis.store.dto.ProductDetailDTO;
import org.joonzis.store.dto.ProductForAdminListDTO;
import org.joonzis.store.dto.ProductForListDTO;
import org.joonzis.store.dto.ProductReviewDTO;
import org.joonzis.store.mapper.ProductMapper;
import org.joonzis.store.mapper.ProductReviewMapper;
import org.joonzis.store.vo.ProductReviewVO;
import org.joonzis.store.vo.ProductVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.log4j.Log4j;

@Log4j
@Service
public class StoreServiceImpl implements StoreService{
	@Autowired
	ProductMapper pMapper;
	@Autowired
	ProductReviewMapper rMapper;
	
	@Override
	public int addNewProduct(ProductVO vo) {
		int result = pMapper.insertProduct(vo);
		return result;
	}
	@Override
	public ProductVO getProductInfo(int product_id) {
		ProductVO vo = pMapper.getProduct(product_id);
		return vo;
	}
	@Override
	public List<ProductVO> getProductList() {
		return pMapper.getProductList();
	}
	// 상품 삭제시 연관되어 있는 리뷰들도 모두 삭제
	@Transactional
	@Override
	public int removeProduct(int product_id) {
		rMapper.deleteProductReviewByProductId(product_id);
		return pMapper.deleteProduct(product_id);
	}
	@Override
	public int updateProductInfo(ProductVO vo) {
		return pMapper.updateProduct(vo);
	}
	
	@Override
	public List<ProductForListDTO> getListByCategoryId(int category_id) {
		return pMapper.getProductListByCategoryId(category_id);
	}
	@Override
	public ProductDetailDTO getProductDetail(int product_id) {
		return pMapper.getProductDetail(product_id);
	}
	@Override
	public List<ProductForListDTO> getListOnSale() {
		return pMapper.getProductListOnSale();
	}
	@Override
	public List<ProductForListDTO> getListOnHot() {
		return pMapper.getProductListOnHot();
	}
	@Override
	public int insertProductReview(ProductReviewVO vo) {
		return rMapper.insertProductReview(vo);
	}
	@Override
	public List<ProductReviewDTO> getReviewListByProductId(int product_id) {
		return rMapper.getReviewListByProductId(product_id);
	}
	@Override
	public ProductReviewDTO getTopReviewByProductId(int product_id) {
		return rMapper.getFirstTopReview(product_id);
	}
	@Override
	public List<ProductForAdminListDTO> getAdminList() {
		return pMapper.getProductAdminList();
	}
	@Override
	public List<ProductForAdminListDTO> getAdminListByCategoryId(int category_id) {
		return pMapper.getProductAdminListByCategoryId(category_id);
	}
	@Override
	public List<ProductForAdminListDTO> getAdminListByPrice() {
		return pMapper.getProductAdminListByPrice();
	}
}
