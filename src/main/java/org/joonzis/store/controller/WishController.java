package org.joonzis.store.controller;

import org.joonzis.store.service.ShoppingCartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.log4j.Log4j;

@Log4j
@RestController
@RequestMapping("store/cart")
public class WishController {
	@Autowired
	ShoppingCartService cartService;
	
	
}
