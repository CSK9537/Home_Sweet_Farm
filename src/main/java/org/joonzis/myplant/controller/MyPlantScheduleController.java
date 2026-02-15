package org.joonzis.myplant.controller;

import org.joonzis.myplant.dto.MyPlantScheduleDTO;
import org.joonzis.myplant.service.MyPlantScheduleService;
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
	private MyPlantScheduleService scservice;;
	
	@GetMapping("/list")
	public String list(int myplant_id, Model model) {
		model.addAttribute("list", scservice.getListByMyPlant(myplant_id));
		return "myplant/schedule/list";
	}
	
	@PostMapping("/register")
	public String register(MyPlantScheduleDTO scdto) {
		scservice.register(scdto);
		return "redirect:/myplant";
	}
	
	@PostMapping("/modify")
	public String modify(MyPlantScheduleDTO scdto) {
		scservice.modify(scdto);
		return "redirect:/myplant";
	}
	
	@PostMapping("/remove")
	public String remove(int schedule_id) {
		scservice.remove(schedule_id);
		return "redirect:/myplant";
	}

}
