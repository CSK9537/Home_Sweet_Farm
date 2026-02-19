package org.joonzis.plant.controller;

import java.util.List;

import javax.servlet.ServletContext;

import org.joonzis.plant.dto.PlantDTO;
import org.joonzis.plant.dto.SimplePlantDTO;
import org.joonzis.plant.service.PlantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import lombok.extern.log4j.Log4j;

@Controller
@Log4j
@RequestMapping("/plant")
public class PlantController {
	
	@Autowired
	private ServletContext servletContext;
	@Autowired
	private PlantService pservice;
	
	// 식물 메인 페이지
	@RequestMapping("")
	public String plantMain(Model model) {
		// 3등까지 가져오기(plantListByRank(rank))
		model.addAttribute("popularPlants", pservice.plantListByRank(3));
		// rank등수 제외, 총 리스트 수 : total, 처음 호출할 갯수 : index
		model.addAttribute("randomPlants", pservice.plantListByRandom(3, 72, 12));
		return "plant/PlantMain";
	}
	
	// 식물 메인 페이지 추가 목록
	@ResponseBody
	@GetMapping("/more")
	public List<SimplePlantDTO> randomPlants() {
		//(호출 1회 가져올 갯수 : num)
		return pservice.plantListByRandomPlus(12);
	}
	
	// 식물 이미지 출력
	@ResponseBody
	@GetMapping("/image/{plant_image:.+}")
	public ResponseEntity<Resource> showImage(@PathVariable("plant_image") String plant_image) {
		String[] paths = plant_image.split("_");
		String path = "";
		if(paths.length > 5) {
			path = "\\\\" + paths[0] + "\\" + paths[1] + "\\" + paths[2] + "\\" + paths[3] + "\\" + paths[4] + "." + paths[5];			
		}
		Resource resource = new FileSystemResource(path);
		if(!resource.exists()) {
			String defaultPath = servletContext.getRealPath("/resources/image/Default_Plant.jpg");
		    resource = new FileSystemResource(defaultPath);
			if (!resource.exists()) {
				return ResponseEntity.notFound().build();
			}
		}
		
		return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(resource);
	}
	
	// 백과사전 상세 페이지
	@RequestMapping("/info/{plant_name:.+}")
	public String plantView(@PathVariable("plant_name") String plant_name, Model model) {
		model.addAttribute("plantInfo",pservice.plantInfo(plant_name));
		return "plant/PlantView";
	}
	
	// 가이드 상세 페이지
	@RequestMapping("/guide/{plant_name:.+}")
	public String guideView(@PathVariable("plant_name") String plant_name, Model model) {
		model.addAttribute("plant_name", plant_name);
		model.addAttribute("plant_name_kor", pservice.plantInfo(plant_name).getPlant_name_kor());
		model.addAttribute("plant_image", pservice.plantInfo(plant_name).getPlant_image());
		model.addAttribute("guideInfo", pservice.guideInfo(plant_name));
		return "plant/GuideView";
	}
}
