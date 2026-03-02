package org.joonzis.myplant.controller;

import java.security.Principal;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.joonzis.myplant.dto.MyPlantDTO;
import org.joonzis.myplant.service.MyPlantService;
import org.joonzis.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import lombok.extern.log4j.Log4j;

@Controller
@Log4j
@RequestMapping("/myplant")
public class MyPlantController {
	
	@Autowired
	private MyPlantService mpservice;
	
	// 메인 화면
	@GetMapping("")
	public String main(Model model, Principal principal) {
		int user_id = 50;
		// int userId = Integer.parseInt(principal.getName());
		model.addAttribute("myPlants", mpservice.getMyPlantMainList(user_id));
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
		
		// 3. DB에 넣을 데이터 조합 (DTO 활용)
		MyPlantDTO mpdto = new MyPlantDTO();
		mpdto.setUser_id(user_id);             // 안전하게 세션에서 꺼낸 ID
		mpdto.setPlant_id(plant_id);           // 사용자가 선택한 식물 ID
		mpdto.setMyplant_name(plant_nickname); // 사용자가 입력한 닉네임
		
		// 4. DB에 INSERT 실행
		boolean result = mpservice.register(mpdto);
		if(!result) {
			rttr.addFlashAttribute("msg", "식물 등록이 실패했습니다.");
			rttr.addFlashAttribute("msgType", "error");
		}else {
			rttr.addFlashAttribute("msg", "식물 등록이 성공했습니다.");
			rttr.addFlashAttribute("msgType", "success");
		}
		return "redirect:/myplant";
	}
	
	// 수정
	@PostMapping("/modify")
		public String modify(MyPlantDTO mpdto) {
		mpservice.modify(mpdto);
		return "redirect:/myplant";
	}
	
	// 삭제
	@PostMapping("/remove")
		public String remove(int myplant_id) {
		mpservice.remove(myplant_id);
		return "redirect:/myplant";
	}
	@PostMapping
    public ResponseEntity<?> addMyPlant(@RequestBody Map<String, Integer> body,
                                        Principal principal) {

        int plantId = body.get("plantId");
        String username = principal.getName();

        mpservice.insertMyPlant(username, plantId);

        return ResponseEntity.ok().build();
    }
}

