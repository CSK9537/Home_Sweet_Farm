package org.joonzis.common.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import lombok.extern.log4j.Log4j;

@Log4j
@Controller
public class CommonController {
	@RequestMapping("/home")
	public String home() {
		return "home";
	}
	@RequestMapping("/")
	public String main() {
		return "main";
	}
	@RequestMapping("/search")
	public String search(@RequestParam(value = "q", required = false) String q,
						@RequestParam(value = "main", required = false) String main,
						@RequestParam(value = "sub", required = false) String sub,
						Model model) {
		model.addAttribute("q", q);
		model.addAttribute("main", main);
		model.addAttribute("sub", sub);
		return "common/searchResult";
	}
}
