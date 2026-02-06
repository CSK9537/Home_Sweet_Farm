package org.joonzis.iot.controller;


import java.util.List;

import org.joonzis.iot.dto.MyPlantMainDTO;
import org.joonzis.iot.service.MyPlantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/MyPlant")
@RequiredArgsConstructor
public class MyPlantController {
	@Autowired
	private MyPlantService myPlantService;
	

	@GetMapping("/main")
    public String myPlantMain(Model model) {

        // ⚠ 임시 userId (로그인 연동 전)
        int userId = 1;

        List<MyPlantMainDTO> myPlantList =
                myPlantService.getMyPlantMainList(userId);

        model.addAttribute("myPlantList", myPlantList);

        return "MyPlant/MyPlantMain";
    }
}
