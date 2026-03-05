package org.joonzis.community.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.joonzis.community.dto.CommunityReplyDTO;
import org.joonzis.community.dto.CommunityViewDTO;
import org.joonzis.community.service.CommunityViewService;
import org.joonzis.community.vo.BoardFileVO;
import org.joonzis.community.vo.CategoryVO;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/community")
public class CommunityViewController {

	private final CommunityViewService communityViewService;

	@GetMapping("/view")
	public String view(@RequestParam("board_id") int board_id, Model model, HttpSession session) {

		// 로그인 유저 id (프로젝트 세션 구조가 케이스별로 섞여있을 수 있어서 안전 처리)
		Integer loginUserId = extractLoginUserId(session);
		model.addAttribute("loginUserId", loginUserId);

		// 1) 게시글 존재 여부 먼저 확인
		CommunityViewDTO board = communityViewService.getBoard(board_id);
		if (board == null) {
			return "redirect:/community/main";
		}

		// 2) 조회수 증가 (존재 확인 후)
		communityViewService.increaseViewCount(board_id);

		// 3) 증가된 값까지 반영해서 다시 조회 (화면 view_cnt가 1 증가된 값으로 보이게)
		board = communityViewService.getBoard(board_id);

		// 카테고리
		CategoryVO category = communityViewService.getCategory(board.getCategory_id());

		// 첨부파일
		List<BoardFileVO> fileList = communityViewService.getFiles(board_id);

		// 댓글(원댓글만)
		List<CommunityReplyDTO> replyList = communityViewService.getRootReplies(board_id);

		model.addAttribute("board", board);
		model.addAttribute("category", category);
		model.addAttribute("fileList", fileList);
		model.addAttribute("replyList", replyList);

		return "community/CommunityView";
	}

	private Integer extractLoginUserId(HttpSession session) {
		Object v = session.getAttribute("loginUserId");
		if (v instanceof Integer) return (Integer) v;

		Object user = session.getAttribute("loginUser");
		if (user instanceof Map) {
			Object id = ((Map<?, ?>) user).get("user_id"); // DB 컬럼명 유지: user_id
			if (id instanceof Number) return ((Number) id).intValue();
		}

		return 0; // 비로그인
	}
}