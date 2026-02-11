package org.joonzis.iot.controller;


import java.security.Principal;

import org.joonzis.iot.service.MyPlantService;
import org.joonzis.iot.vo.MyPlantVO;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
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
    @GetMapping("/main")
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

        int userId = Integer.parseInt(principal.getName());
        model.addAttribute("list", myPlantService.getList(userId));
        return "myplant/main";
    }

    // 등록
    @PostMapping("/register")
    public String register(MyPlantVO vo,
    		Principal principal) {

        vo.setUserId(Integer.parseInt(principal.getName()));
        myPlantService.register(vo);
        return "redirect:/myplant/main";
    }

    // 수정
    @PostMapping("/modify")
    public String modify(MyPlantVO vo) {
        myPlantService.modify(vo);
        return "redirect:/myplant/main";
    }

    // 삭제
    @PostMapping("/remove")
    public String remove(int myplantId) {
        myPlantService.remove(myplantId);
        return "redirect:/myplant/main";
    }
}

