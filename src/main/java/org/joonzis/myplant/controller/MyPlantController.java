package org.joonzis.myplant.controller;

import java.security.Principal;

import org.joonzis.myplant.dto.MyPlantDTO;
import org.joonzis.myplant.service.MyPlantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/myplant")
@RequiredArgsConstructor
public class MyPlantController {
	
	@Autowired
	MyPlantService mpservice;
	
	// 메인 화면
	@GetMapping("")
	public String main(Model model, Principal principal) {
		int user_id = 50;
		// int userId = Integer.parseInt(principal.getName());
		model.addAttribute("myPlants", mpservice.getMyPlantMainList(user_id));
		return "myplant/MyPlantMain";
	}
	
	// 나의 식물 추가
	@PostMapping("/register")
		public String register(@RequestParam("mpdto") MyPlantDTO mpdto, Principal principal) {
		mpdto.setUser_id(Integer.parseInt(principal.getName()));
		mpservice.register(mpdto);
		return "redirect:/myplant";
	}
	
	// 수정
	@PostMapping("/modify")
		public String modify(MyPlantDTO mpdto) {
		mpservice.modify(mpdto);
		return "redirect:/myplant";
	}
	
	// 삭제
	@PostMapping("/remove")
		public String remove(int myplant_id) {
		mpservice.remove(myplant_id);
		return "redirect:/myplant";
	}

}

