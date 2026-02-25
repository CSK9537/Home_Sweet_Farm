package org.joonzis.myplant.controller;

import java.security.Principal;
import java.util.Map;

import org.joonzis.myplant.dto.MyPlantDTO;
import org.joonzis.myplant.service.MyPlantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import lombok.extern.log4j.Log4j;

@Controller
@Log4j
@RequestMapping("/myplant")
public class MyPlantController {
	
	@Autowired
	private MyPlantService mpservice;
	
	// 메인 화면
	@GetMapping("")
	public String main(Model model, Principal principal) {
		int user_id = 50;
		// int userId = Integer.parseInt(principal.getName());
		model.addAttribute("myPlants", mpservice.getMyPlantMainList(user_id));
		return "myplant/MyPlantMain";
	}
	
	// 추천 가이드 이동
	@GetMapping("/recommend")
	public String recommend() {
		return "myplant/MyPlantRecommend";
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
	@PostMapping
    public ResponseEntity<?> addMyPlant(@RequestBody Map<String, Integer> body,
                                        Principal principal) {

        int plantId = body.get("plantId");
        String username = principal.getName();

        mpservice.insertMyPlant(username, plantId);

        return ResponseEntity.ok().build();
    }
}

