package org.joonzis.plant.controller;

import org.joonzis.plant.service.PlantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.extern.log4j.Log4j;

@Controller
@Log4j
@RequestMapping("/plant")
public class PlantController {
	
	@Autowired
	private PlantService pservice;
	
	// 식물 메인 페이지
	@RequestMapping("")
	public String plantMain(Model model) {
		// 등수 지정(plantListByRank(rank))
		model.addAttribute("popularPlants", pservice.plantListByRank(15));
		return "Plant/PlantMain";
	}
	
	// 백과사전 상세 페이지
	@RequestMapping("/info/{plant_name:.+}")
	public String plantView(@PathVariable("plant_name") String plant_name, Model model) {
		model.addAttribute("plantInfo",pservice.plantInfo(plant_name));
		return "Plant/PlantView";
	}
	
	// 가이드 상세 페이지
	@RequestMapping("/guide/{plant_name:.+}")
	public String guideView(@PathVariable("plant_name") String plant_name, Model model) {
		model.addAttribute("guide", pservice.guideInfo(plant_name));
		return "Plant/GuideView";
	}
}
