package org.joonzis.iot.controller;


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
                       @AuthenticationPrincipal User user) {

        int userId = Integer.parseInt(user.getUsername());

        model.addAttribute(
            "myPlants",
            myPlantService.getMyPlantMainList(userId)
        );

        return "MyPlant/MyPlantMain";
    }

    // 목록
    @GetMapping("/list")
    public String list(Model model,
                       @AuthenticationPrincipal User user) {

        int userId = Integer.parseInt(user.getUsername());
        model.addAttribute("list", myPlantService.getList(userId));
        return "myplant/list";
    }

    // 등록
    @PostMapping("/register")
    public String register(MyPlantVO vo,
                           @AuthenticationPrincipal User user) {

        vo.setUserId(Integer.parseInt(user.getUsername()));
        myPlantService.register(vo);
        return "redirect:/myplant/list";
    }

    // 수정
    @PostMapping("/modify")
    public String modify(MyPlantVO vo) {
        myPlantService.modify(vo);
        return "redirect:/myplant/list";
    }

    // 삭제
    @PostMapping("/remove")
    public String remove(int myplantId) {
        myPlantService.remove(myplantId);
        return "redirect:/myplant/list";
    }
}

