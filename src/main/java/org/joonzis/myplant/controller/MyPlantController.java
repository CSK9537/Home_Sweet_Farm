package org.joonzis.myplant.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.joonzis.myplant.dto.MyPlantDTO;
import org.joonzis.myplant.dto.MyPlantMainDTO;
import org.joonzis.myplant.service.MyPlantService;
import org.joonzis.plant.dto.GuideDTO;
import org.joonzis.plant.service.PlantService;
import org.joonzis.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import lombok.extern.log4j.Log4j;

@Controller
@Log4j
@RequestMapping("/myplant")
public class MyPlantController {
	
	@Autowired
	private MyPlantService mpservice;
	@Autowired
	private PlantService pservice;
	
	// 메인 화면
	@GetMapping("")
	public String main(HttpSession session, Model model) {
		UserVO uvo = (UserVO) session.getAttribute("loginUser");
		if (uvo != null) {
			int user_id = uvo.getUser_id();
			model.addAttribute("myPlants", mpservice.getMyPlantMainList(user_id));
		}
		return "myplant/MyPlantMain";
	}
	
	// 추천 가이드 이동
	@GetMapping("/recommend")
	public String recommend() {
		return "myplant/MyPlantRecommend";
	}
	
	// 나의 식물 추가
	@PostMapping("/register")
		public String register(@RequestParam("plant_id") int plant_id,
								@RequestParam("plant_nickname") String plant_nickname,
								HttpSession session, RedirectAttributes rttr) {
		UserVO uvo = (UserVO) session.getAttribute("loginUser");
		if (uvo == null) {
			// 로그인이 풀렸거나 비정상 접근이므로 로그인 페이지로 튕겨냅니다.
			return "redirect:/login"; 
		}
		int user_id = uvo.getUser_id();
		
		// DB에 넣을 데이터
		MyPlantDTO mpdto = new MyPlantDTO();
		mpdto.setUser_id(user_id);             // 안전하게 세션에서 꺼낸 ID
		mpdto.setPlant_id(plant_id);           // 사용자가 선택한 식물 ID
		mpdto.setMyplant_name(plant_nickname); // 사용자가 입력한 닉네임
		
		// INSERT 실행
		boolean result = mpservice.register(mpdto);
		if(result) {
			rttr.addFlashAttribute("msg", "식물 등록이 성공했습니다.");
			rttr.addFlashAttribute("msgType", "success");
		}else {
			rttr.addFlashAttribute("msg", "식물 등록이 실패했습니다.");
			rttr.addFlashAttribute("msgType", "error");
		}
		return "redirect:/myplant";
	}
	
	// 나의 식물 상세 정보
	@GetMapping("/info/{myplant_id}")
	public String view(@PathVariable("myplant_id") int myplant_id, Model model) {
		MyPlantMainDTO mpmdto = mpservice.get(myplant_id);
		model.addAttribute("myplantinfo", mpmdto);
		return "myplant/MyPlantView";
	}
	
	// 나의 식물 가이드 정보
	@GetMapping(value = "/guide/{plant_name:.+}", produces = "application/json; charset=UTF-8")
	@ResponseBody
	public Map<String, Object> getMyplantGuide(@PathVariable("plant_name") String plant_name){
		
		GuideDTO gdto = pservice.guideInfo(plant_name);
		Map<String, Object> result = new HashMap<>();
		
		result.put("guide_watering_schedule", gdto.getGuide_watering_schedule());
	    result.put("guide_watering_humiditylevel", gdto.getGuide_watering_humiditylevel());
	    result.put("guide_sunlight_requirements", gdto.getGuide_sunlight_requirements());
	    result.put("guide_sunlight_tolerance", gdto.getGuide_sunlight_tolerance());
	    result.put("guide_temperature_imin", gdto.getGuide_temperature_imin());
	    result.put("guide_temperature_imax", gdto.getGuide_temperature_imax());
	    result.put("guide_temperature_tmin", gdto.getGuide_temperature_tmin());
	    result.put("guide_temperature_tmax", gdto.getGuide_temperature_tmax());
		
		return result;
	}
	
	// 수정
	@PostMapping("/modify")
	public String modify(MyPlantDTO mpdto) {
		mpservice.modify(mpdto);
		return "redirect:/myplant";
	}
	
	// 삭제
	@PostMapping("/remove/{myplant_id}")
	@ResponseBody
	public ResponseEntity<String> remove(@PathVariable("myplant_id") int myplant_id, HttpSession session) {
		UserVO uvo = (UserVO) session.getAttribute("loginUser");
		if (uvo == null) {
			return ResponseEntity.status(401).body("로그인이 필요합니다.");
		}
		boolean result = mpservice.remove(myplant_id);
		return result ? ResponseEntity.ok("success") : ResponseEntity.badRequest().body("fail");
	}
	
}

