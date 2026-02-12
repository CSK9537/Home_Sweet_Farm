package org.joonzis.community.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/community")
public class CommunityController {
	
	@RequestMapping("")
	public String main() {
		return "community/CommunityMain";
	}
}