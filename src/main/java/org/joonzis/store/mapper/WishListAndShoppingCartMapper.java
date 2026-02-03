package org.joonzis.store.mapper;

import java.util.List;

import org.joonzis.store.dto.ShoppingCartDTO;
import org.joonzis.store.dto.WishListDTO;
import org.joonzis.store.vo.ShoppingCartVO;
import org.joonzis.store.vo.WishListVO;

public interface WishListAndShoppingCartMapper {
	// 찜목록
	public int insertWishList(WishListVO vo);
	public List<WishListDTO> getWishListByUserId(int user_id);
	public List<WishListDTO> getWishListByProductId(int product_id); // 관리자용?
	public int deleteWishList(WishListVO vo);
	
	// 장바구니
	public int insertShoppingCart(ShoppingCartVO vo);
	public List<ShoppingCartDTO> getShoppingCartByUserId(int user_id);
	public List<ShoppingCartDTO> getShoppingCartByProductId(int product_id);
	public int deleteShopingCart(ShoppingCartVO vo);
}
