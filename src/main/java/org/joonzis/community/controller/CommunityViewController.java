package org.joonzis.community.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.joonzis.community.dto.CommunityReplyDTO;
import org.joonzis.community.dto.CommunityViewDTO;
import org.joonzis.community.service.CommunityViewService;
import org.joonzis.community.vo.BoardFileVO;
import org.joonzis.community.vo.CategoryVO;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/community")
public class CommunityViewController {

	private final CommunityViewService communityViewService;

	@GetMapping("/view")
	public String view(@RequestParam("board_id") int board_id,
	                   Model model,
	                   HttpSession session,
	                   HttpServletRequest request,
	                   HttpServletResponse response) {

		Integer loginUserId = extractLoginUserId(session);
		model.addAttribute("loginUserId", loginUserId);

		// 1) 게시글 존재 확인
		CommunityViewDTO board = communityViewService.getBoard(board_id);
		if (board == null) return "redirect:/community/main";

		// 2) 조회수: 쿠키로 중복 상승 방지 (예: 24시간)
		if (shouldIncreaseView(board_id, request)) {
			communityViewService.increaseViewCount(board_id);
			setViewCookie(board_id, response);
			// 증가된 값 반영
			board = communityViewService.getBoard(board_id);
		}

		// 3) 카테고리 / 첨부 / 댓글
		CategoryVO category = communityViewService.getCategory(board.getCategory_id());
		List<BoardFileVO> fileList = communityViewService.getFiles(board_id);
		List<CommunityReplyDTO> replyList = communityViewService.getRootReplies(board_id);

		// 4) 이전글/다음글
		Map<String, Object> nav = communityViewService.getPrevNext(board_id);
		model.addAttribute("prev", nav.get("prev"));
		model.addAttribute("next", nav.get("next"));

		// 5) 로그인 유저가 이미 좋아요 했는지 (버튼 비활성화용)
		boolean liked = false;
		if (loginUserId != null && loginUserId > 0) {
			liked = communityViewService.isLiked(board_id, loginUserId);
		}

		model.addAttribute("board", board);
		model.addAttribute("category", category);
		model.addAttribute("fileList", fileList);
		model.addAttribute("replyList", replyList);
		model.addAttribute("liked", liked);

		return "community/CommunityView";
	}

	// 좋아요(1회)
	@PostMapping("/like")
	@ResponseBody
	public ResponseEntity<Map<String, Object>> like(@RequestParam("board_id") int board_id,
	                                                HttpSession session) {

		Integer loginUserId = extractLoginUserId(session);
		Map<String, Object> res = new HashMap<>();

		if (loginUserId == null || loginUserId <= 0) {
			res.put("ok", false);
			res.put("msg", "LOGIN_REQUIRED");
			return ResponseEntity.ok(res);
		}

		Map<String, Object> likeRes = communityViewService.likeOnce(board_id, loginUserId);
		// likeRes: {ok:true/false, already:true/false, like_cnt:number}
		return ResponseEntity.ok(likeRes);
	}

	// 신고
	@PostMapping("/report")
	@ResponseBody
	public ResponseEntity<Map<String, Object>> report(@RequestParam("board_id") int board_id,
	                                                  @RequestParam("reason") String reason,
	                                                  HttpSession session) {

		Integer loginUserId = extractLoginUserId(session);
		Map<String, Object> res = new HashMap<>();

		if (loginUserId == null || loginUserId <= 0) {
			res.put("ok", false);
			res.put("msg", "LOGIN_REQUIRED");
			return ResponseEntity.ok(res);
		}

		communityViewService.report(board_id, loginUserId, reason);
		res.put("ok", true);
		return ResponseEntity.ok(res);
	}

	private boolean shouldIncreaseView(int board_id, HttpServletRequest request) {
		String cookieName = "viewed_board_" + board_id;
		Cookie[] cookies = request.getCookies();
		if (cookies == null) return true;
		for (Cookie c : cookies) {
			if (cookieName.equals(c.getName())) return false;
		}
		return true;
	}

	private void setViewCookie(int board_id, HttpServletResponse response) {
		String cookieName = "viewed_board_" + board_id;
		Cookie ck = new Cookie(cookieName, "Y");
		ck.setPath("/");          // 전체 경로에서 동일 쿠키 적용
		ck.setMaxAge(60 * 60 * 24); // 24시간
		response.addCookie(ck);
	}

	@SuppressWarnings("unchecked")
	private Integer extractLoginUserId(HttpSession session) {
		Object v = session.getAttribute("loginUserId");
		if (v instanceof Integer) return (Integer) v;

		Object user = session.getAttribute("loginUser");
		if (user instanceof Map) {
			Object id = ((Map<String, Object>) user).get("user_id");
			if (id instanceof Number) return ((Number) id).intValue();
		}
		return 0;
	}
}