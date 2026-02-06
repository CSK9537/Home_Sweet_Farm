package org.joonzis.iot.controller;

import javax.servlet.http.HttpSession;

import org.joonzis.iot.service.MyPlantService;
import org.joonzis.user.vo.UserVO;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/MyPlant")
@RequiredArgsConstructor
public class MyPlantController {
	
	private final MyPlantService myPlantService;
	

	@GetMapping("/main")
	public String myPlantMain(HttpSession session, Model model) {

	    UserVO loginUser = (UserVO) session.getAttribute("loginUser");
	    int userId = loginUser.getUser_id();

	    model.addAttribute(
	        "myPlants",
	        myPlantService.getMyPlantMainList(userId)
	    );

        return "MyPlant/MyPlantMain";
    }
}
