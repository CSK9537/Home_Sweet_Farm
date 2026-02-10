package org.joonzis.store.service;

import java.util.List;

import org.joonzis.store.dto.ShoppingCartDTO;
import org.joonzis.store.dto.WishListDTO;

public interface ShoppingCartService {
	public int addWishList(int user_id, int product_id);						// 찜목록에 추가
	public List<WishListDTO> getWishListByUserId(int user_id);					// 찜목록 가져오기(사용자별)
	public List<WishListDTO> getWishListByProductId(int product_id);			// 찜목록 가져오기(상품별)
	public int deleteWishList(int user_id, int product_id); 					// 찜목록에서 삭제
	
	public int addShoppingCart(int user_id, int product_id, int product_count);	// 장바구니에 추가
	public int addShoppingCart(int user_id, int product_id);					// 장바구니에 하나씩 추가
	public int decreaseShopingCart(int user_id, int product_id);				// 장바구니 수량 감소(최소값 1)
	public List<ShoppingCartDTO> getShoppingCartByUserId(int user_id);			// 장바구니 가져오기(사용자별)
	public List<ShoppingCartDTO> getShoppingCartByProductId(int product_id);	// 장바구니 가져오기(상품별)
	public int deleteShopingCart(int user_id, int product_id);					// 장바구니에서 삭제
	
	public String checkAlreadyIn(int user_id, int product_id,String type);		// 장바구니 및 찜목록에서 확인

	public int deleteAllCart(int user_id);										// 장바구니초기화
	public int deleteAllWish(int user_id);										// 찜목록 초기화
}
