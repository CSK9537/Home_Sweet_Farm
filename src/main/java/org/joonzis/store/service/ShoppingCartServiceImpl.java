package org.joonzis.store.service;

import java.util.List;

import org.joonzis.store.dto.ShoppingCartDTO;
import org.joonzis.store.dto.WishListDTO;
import org.joonzis.store.mapper.WishListAndShoppingCartMapper;
import org.joonzis.store.vo.ShoppingCartVO;
import org.joonzis.store.vo.WishListVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.log4j.Log4j;

@Log4j
@Service
public class ShoppingCartServiceImpl implements ShoppingCartService{
	@Autowired
	WishListAndShoppingCartMapper mapper;
	
	// 찜목록에 추가
	@Override
	public int addWishList(int user_id, int product_id) {
		return mapper.insertWishList(new WishListVO(user_id, product_id));
	}
	// 사용자의 찜목록 불러오기
	@Override
	public List<WishListDTO> getWishListByUserId(int user_id) {
		return mapper.getWishList(user_id, "user");
	}
	// 상품 기준으로 찜목록 불러오기(통계, 누가 찜을 했는지)
	@Override
	public List<WishListDTO> getWishListByProductId(int product_id) {
		return mapper.getWishList(product_id, "product");
	}
	// 찜목록에서 제품 삭제
	@Override
	public int deleteWishList(int user_id, int product_id) {
		return mapper.deleteCartOrWish(user_id, product_id, "cart");
	}
	// 장바구니에 제품 추가, 개수 증가
	@Override
	public int addShoppingCart(int user_id, int product_id) {
		return mapper.upsertShoppingCart(user_id, product_id, "plus");
	}
	// 장바구니의 제품 개수 감소(1이하로 안 떨어짐)
	@Override
	public int decreaseShopingCart(int user_id, int product_id) {
		return mapper.upsertShoppingCart(user_id, product_id, "minus");
	}
	// 장바구니에 개수 지정해서 추가
	@Override
	public int addShoppingCart(int user_id, int product_id, int product_count) {
		return mapper.insertShoppingCart(new ShoppingCartVO(user_id, product_id, product_count));
	}
	// 유저의 장바구니 목록 불러오기
	@Override
	public List<ShoppingCartDTO> getShoppingCartByUserId(int user_id) {
		return mapper.getShoppingCart(user_id, "user");
	}
	// 상품 기준으로 장바구니 목록 불러오기(통계용, 누가 담았는지)
	@Override
	public List<ShoppingCartDTO> getShoppingCartByProductId(int product_id) {
		return mapper.getShoppingCart(product_id, "product");
	}
	// 장바구니에서 제품 삭제
	@Override
	public int deleteShopingCart(int user_id, int product_id) {
		return mapper.deleteCartOrWish(user_id, product_id, "product");
	}
	
	// 유저가 특정 제품을 찜을 했는지 확인용
	@Override
	public String checkAlreadyIn(int user_id, int product_id, String type) {
		int result = mapper.checkAlreadyIn(user_id, product_id, type);
		if(result > 0) return "yes";
		else return "no";
	}
	// 장바구니 or 찜목록 전체 삭제
	@Override
	public int deleteAllCart(int user_id) {
		return mapper.deleteCartOrWish(user_id, null, "cart");
	}
	@Override
	public int deleteAllWish(int user_id) {
		return mapper.deleteCartOrWish(user_id, null, "wish");
	}
	
	// 유저가 특정 제품을 찜을 했는지 확인용
	
	// 유저가 특정 제품을 장바구니에 담았는지 확인용
}
