package org.joonzis.store.service;

import java.util.List;

import org.joonzis.store.dto.ProductDetailDTO;
import org.joonzis.store.dto.ProductForListDTO;
import org.joonzis.store.mapper.ProductMapper;
import org.joonzis.store.vo.ProductVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.log4j.Log4j;

@Log4j
@Service
public class StoreServiceImpl implements StoreService{
	@Autowired
	ProductMapper pMapper;
	
	@Override
	public int addNewProduct(ProductVO vo) {
		int result = pMapper.insertTest(vo);
		return result;
	}
	@Override
	public ProductVO getProductInfo(int product_id) {
		ProductVO vo = pMapper.selectOne(product_id);
		return vo;
	}
	@Override
	public List<ProductVO> getProductList() {
		return pMapper.selectList();
	}
	@Override
	public int removeProduct(int product_id) {
		return pMapper.deleteTest(product_id);
	}
	@Override
	public int updateProductInfo(ProductVO vo) {
		return pMapper.updateTest(vo);
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
}
