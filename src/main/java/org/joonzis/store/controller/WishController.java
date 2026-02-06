package org.joonzis.store.controller;

import org.joonzis.store.service.ShoppingCartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.log4j.Log4j;

@Log4j
@Controller
@RequestMapping("store/cart")
public class WishController {
	@Autowired
	ShoppingCartService cService;
	
	@GetMapping("/list")
	public String cartList(@RequestParam("user_id")int user_id, Model model) {
		model.addAttribute("cart",cService.getShoppingCartByUserId(user_id));
		return "/store/cart";
	}
	
	
}
