package org.joonzis.myplant.controller;

import org.joonzis.myplant.service.MyPlantScheduleService;
import org.joonzis.myplant.vo.ScheduleVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@RequestMapping("/myplant/schedule")
public class MyPlantScheduleController {
	
	@Autowired
	private MyPlantScheduleService service;
	
	
	@GetMapping("/list")
    public String list(int myplantId, Model model) {
        model.addAttribute("list", service.getListByMyPlant(myplantId));
        return "myplant/schedule/list";
    }

    @PostMapping("/register")
    public String register(ScheduleVO vo) {
        service.register(vo);
        return "redirect:/myplant/main";
    }

    @PostMapping("/modify")
    public String modify(ScheduleVO vo) {
        service.modify(vo);
        return "redirect:/myplant/main";
    }

    @PostMapping("/remove")
    public String remove(int scheduleId) {
        service.remove(scheduleId);
        return "redirect:/myplant/main";
    }
}
