package org.joonzis.store.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.joonzis.store.dto.ShoppingCartDTO;
import org.joonzis.store.dto.WishListDTO;
import org.joonzis.store.vo.ShoppingCartVO;
import org.joonzis.store.vo.WishListVO;

public interface WishListAndShoppingCartMapper {
	// 찜목록
	public int insertWishList(WishListVO vo);
	public List<WishListDTO> getWishList(@Param("data")int param, @Param("type")String type);
	public int deleteWishList(WishListVO vo);
	
	// 장바구니
	public int insertShoppingCart(ShoppingCartVO vo);
	public List<ShoppingCartDTO> getShoppingCart(@Param("data")int param, @Param("type")String type);
	public int deleteShopingCart(@Param("user_id") int user_id, @Param("product_id") int product_id);
	
	// Upsert 이미 있으면 update, 데이터가 없으면 insert
	public int upsertShoppingCart(@Param("user_id") int user_id, @Param("product_id") int product_id, @Param("type")String type);
}
