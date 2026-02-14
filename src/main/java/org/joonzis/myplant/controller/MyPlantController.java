package org.joonzis.myplant.controller;

import java.security.Principal;

import org.joonzis.myplant.dto.MyPlantDTO;
import org.joonzis.myplant.service.MyPlantService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/myplant")
@RequiredArgsConstructor
public class MyPlantController {

    private final MyPlantService myPlantService;

    // 메인 화면
    @GetMapping("")
    public String main(Model model,
                       Principal principal) {
    	int userId = 50;
        // int userId = Integer.parseInt(principal.getName());

        model.addAttribute(
            "myPlants",
            myPlantService.getMyPlantMainList(userId)
        );

        return "myplant/main";
    }

    // 목록
    @GetMapping("/list")
    public String list(Model model,
                       Principal principal) {

        int user_id = Integer.parseInt(principal.getName());
        model.addAttribute("list", myPlantService.getMyPlantMainList(user_id));
        return "myplant/main";
    }

    // 등록
    @PostMapping("/register")
    public String register(MyPlantDTO mpdto,
    		Principal principal) {

    	mpdto.setUser_id(Integer.parseInt(principal.getName()));
        myPlantService.register(mpdto);
        return "redirect:/myplant";
    }

    // 수정
    @PostMapping("/modify")
    public String modify(MyPlantDTO mpdto) {
        myPlantService.modify(mpdto);
        return "redirect:/myplant";
    }

    // 삭제
    @PostMapping("/remove")
    public String remove(int myplant_id) {
        myPlantService.remove(myplant_id);
        return "redirect:/myplant";
    }
}

