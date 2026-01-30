package org.joonzis.store.mapper;

import java.util.List;

import org.joonzis.store.vo.ProductVO;

public interface ProductMapper {
	public int insertTest(ProductVO vo);
	public ProductVO selectOne(int product_id);
	public List<ProductVO> selectList();
	public int updateTest(ProductVO vo);
	public int deleteTest(int product_id);
}
