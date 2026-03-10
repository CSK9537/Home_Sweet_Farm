package org.joonzis.common.controller;

import java.util.List;

import org.joonzis.plant.service.PlantService;
import org.joonzis.qna.service.QnaMainService;
import org.joonzis.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.log4j.Log4j;

@Log4j
@Controller
public class CommonController {
	
	@Autowired
	private PlantService pservice;
	@Autowired
	private QnaMainService qservice;
	@Autowired
	private UserService uservice;
	
	@RequestMapping("/home")
	public String home() {
		return "home";
	}
	@RequestMapping("/")
	public String main(Model model) {
		List<String> plantImagesList = pservice.plantImagesByRandom();
		ObjectMapper omapper = new ObjectMapper();
		try {
			String plantImages = omapper.writeValueAsString(plantImagesList);
            model.addAttribute("plantImages", plantImages);
		} catch (Exception e) {
			model.addAttribute("plantImages", "[]");
		}
		model.addAttribute("popularPlants", pservice.plantListByRank(3));
		model.addAttribute("popularQuestions", qservice.topQuestions());
		model.addAttribute("popularPeople", uservice.answerLikesPeopleRankingInfo(3));
		
		return "main";
	}
	@RequestMapping("/rules/use")
	public String use() {
		return "law/TermsOfUse";
	}
	@RequestMapping("/rules/privacy")
	public String privacy() {
		return "law/Personal";
	}
	@RequestMapping("/search")
	public String search(@RequestParam(value = "q", required = false) String q,
						@RequestParam(value = "main", required = false) String main,
						@RequestParam(value = "sub", required = false) String sub,
						Model model) {
		model.addAttribute("q", q);
		model.addAttribute("main", main);
		model.addAttribute("sub", sub);
		return "common/SearchResult";
	}
}
