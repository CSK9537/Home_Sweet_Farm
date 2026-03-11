package org.joonzis.user.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.joonzis.community.service.CommunityMainService;
import org.joonzis.user.dto.MyPageItemDTO;
import org.joonzis.user.dto.MyPageReplyDTO;
import org.joonzis.user.service.MypageService;
import org.joonzis.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.log4j.Log4j;

@Log4j
@RestController
@RequestMapping("/user/mypage")
public class MyPageController {

	@Autowired
	MypageService mpService;
	@Autowired
	CommunityMainService cmService;
	
	/**
     * 1. 나의 글 API
     * tab: all(전체), free(자유게시판), market(벼룩시장)
     */
    @GetMapping("/posts")
    public Map<String, Object> getMyPosts(
            @RequestParam String userId,
            @RequestParam(defaultValue = "all") String tab,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "7") int pageSize) {

        int total = mpService.getMyPostsCount(userId, tab);
        List<MyPageItemDTO> items = mpService.getMyPosts(userId, tab, page, pageSize);

        return buildPageResponse(items, total, page, pageSize);
    }

    /**
     * 2. 나의 질문 API
     * tab: all(전체), open(미해결), solved(해결)
     */
    @GetMapping("/questions")
    public Map<String, Object> getMyQuestions(
            @RequestParam String userId,
            @RequestParam(defaultValue = "all") String tab,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "7") int pageSize) {

        int total = mpService.getMyQuestionsCount(userId, tab);
        List<MyPageItemDTO> items = mpService.getMyQuestions(userId, tab, page, pageSize);

        return buildPageResponse(items, total, page, pageSize);
    }

    /**
     * 3. 나의 답변 API
     * tab: all(전체), accepted(채택)
     */
    @GetMapping("/answers")
    public Map<String, Object> getMyAnswers(
            @RequestParam String userId,
            @RequestParam(defaultValue = "all") String tab,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "7") int pageSize) {

        int total = mpService.getMyAnswersCount(userId, tab);
        List<MyPageItemDTO> items = mpService.getMyAnswers(userId, tab, page, pageSize);

        return buildPageResponse(items, total, page, pageSize);
    }

    /**
     * 4. 나의 댓글 API
     * tab: all(전체), community(커뮤니티), qna(Q&A)
     */
    @GetMapping("/replys")
    public Map<String, Object> getMyReplys(
            @RequestParam String userId,
            @RequestParam(defaultValue = "all") String tab,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "7") int pageSize) {

        int total = mpService.getMyReplysCount(userId, tab);
        // 댓글은 뷰에 보여줄 항목이 다르므로 DTO를 분리하거나 공용 DTO를 사용할 수 있습니다.
        List<MyPageReplyDTO> items = mpService.getMyReplys(userId, tab, page, pageSize);

        return buildPageResponse(items, total, page, pageSize);
    }

    /**
     * 공통 헬퍼 메서드: 프론트엔드가 요구하는 페이징 JSON 형식으로 조립
     */
    private Map<String, Object> buildPageResponse(List<?> items, int total, int page, int pageSize) {
        int totalPages = (int) Math.ceil((double) total / pageSize);

        Map<String, Object> response = new HashMap<>();
        response.put("items", items);
        response.put("total", total);
        response.put("totalPages", totalPages);
        response.put("page", page);

        return response;
    }
	
	
	// 마이페이지 - 개인 정보 수정
	@PostMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
	public Map<String, Object> updateMypage(@ModelAttribute UserVO vo, HttpSession session) { 
		UserVO uvo = (UserVO) session.getAttribute("loginUser");
		if (uvo != null) {
			int user_id = uvo.getUser_id();
			vo.setUser_id(user_id);
		}
		
		Map<String, Object> response = new HashMap<>();
	    
	    try {
	        boolean result = mpService.updateMypage(vo);
	        if (result) {
	            response.put("success", true);
	            response.put("message", "수정 완료");
	        } else {
	            response.put("success", false);
	            response.put("message", "수정 실패 (DB 업데이트 안 됨)");
	        }
	    } catch (Exception e) {
	        log.error("마이페이지 정보 수정 중 에러 발생: ", e); // 이클립스/인텔리제이 콘솔에 에러 상세 출력
	        response.put("success", false);
	        response.put("message", "서버 오류가 발생했습니다.");
	    }

	    return response; 
	}
	
	//마이페이지 수정-관심사 검색
	@GetMapping("/hashtag")
	@ResponseBody
	public List<Map<String,Object>> search(@RequestParam String keyword){
		return mpService.searchHashtag(keyword);
	}
	
	//마이페이지 수정-관심사 선택(저장)
	@PostMapping("/aspect")
	@ResponseBody
	public Map<String,Object> saveAspect(HttpSession session,
										@RequestParam("hashtagId") int hashtagId){
		Map<String, Object> res = new HashMap<>();

	    
		UserVO loginUser = (UserVO) session.getAttribute("loginUser");
	    if (loginUser == null) {
	        res.put("ok", false);
	        res.put("msg", "no-session");
	        return res;
	    }

	    int userId = loginUser.getUser_id();

	    // 1) 중복이면 0, 새로 추가면 1 반환하도록 구현 추천
	    int inserted = mpService.insertUserAspect(userId, hashtagId);

	    res.put("ok", true);
	    res.put("inserted", inserted); // 1=추가됨, 0=이미있음(무시)
	    return res;	
	}
	
	//마이페이지 - 자기소개 수정
	@PostMapping("/introUpdate")
	@ResponseBody
	public String updateIntro(@RequestParam(required=false) String intro, 
								HttpSession session) {
		
		UserVO loginUser = (UserVO)session.getAttribute("loginUser");
		if(loginUser == null) return "no-session";
		
		
	    if (intro == null || intro.trim().isEmpty()) {
	        return "empty";
	    }

	    int userId = loginUser.getUser_id();
	    
		UserVO vo = new UserVO();
		vo.setUser_id(userId);
		vo.setIntro(intro);
		
		int result = mpService.updateIntro(vo);
		
		return result > 0 ? "ok":"fail";
	}
	
	
}
