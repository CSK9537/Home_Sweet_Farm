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
	
	@Override
	public int addWishList(int user_id, int product_id) {
		return mapper.insertWishList(new WishListVO(user_id, product_id));
	}
	@Override
	public List<WishListDTO> getWishListByUserId(int user_id) {
		return mapper.getWishList(user_id, "user");
	}
	@Override
	public List<WishListDTO> getWishListByProductId(int product_id) {
		return mapper.getWishList(product_id, "product");
	}
	@Override
	public int deleteWishList(int user_id, int product_id) {
		return mapper.deleteWishList(new WishListVO(user_id, product_id));
	}
	@Override
	public int addShoppingCart(int user_id, int product_id) {
		return mapper.upsertShoppingCart(user_id, product_id);
	}
	@Override
	public int addShoppingCart(int user_id, int product_id, int product_count) {
		return mapper.insertShoppingCart(new ShoppingCartVO(user_id, product_id, product_count));
	}
	@Override
	public List<ShoppingCartDTO> getShoppingCartByUserId(int user_id) {
		return mapper.getShoppingCart(user_id, "user");
	}
	@Override
	public List<ShoppingCartDTO> getShoppingCartByProductId(int product_id) {
		return mapper.getShoppingCart(product_id, "product");
	}
	@Override
	public int deleteShopingCart(int user_id, int product_id) {
		return mapper.deleteShopingCart(user_id, product_id);
	}
}
