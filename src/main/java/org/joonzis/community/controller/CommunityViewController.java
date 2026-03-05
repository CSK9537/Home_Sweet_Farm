package org.joonzis.community.controller;

import java.util.List;

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
	public String view(@RequestParam("board_id") int boardId, Model model, HttpSession session) {

		// 로그인 유저 id 세팅 (프로젝트 세션 구조를 모르는 상태라 최대한 안전하게 처리)
	    Integer loginUserId = extractLoginUserId(session);
	    model.addAttribute("loginUserId", loginUserId);

	    // 조회수 증가
	    communityViewService.increaseViewCount(boardId);

	    // 게시글 + 작성자
	    CommunityViewDTO board = communityViewService.getBoard(boardId);
	    if (board == null) {
	      // 없으면 목록으로 (원하면 404 페이지로 바꿔도 됨)
	      return "redirect:/community/main";
	    }

	    // 카테고리
	    CategoryVO category = communityViewService.getCategory(board.getCategory_id());

	    // 첨부파일
	    List<BoardFileVO> fileList = communityViewService.getFiles(boardId);

	    // 댓글(원댓글만: parent_reply_id IS NULL)
	    List<CommunityReplyDTO> replyList = communityViewService.getRootReplies(boardId);

	    model.addAttribute("board", board);
	    model.addAttribute("category", category);
	    model.addAttribute("fileList", fileList);
	    model.addAttribute("replyList", replyList);

	    return "community/CommunityView"; // /WEB-INF/views/community/CommunityView.jsp
	}

	private Integer extractLoginUserId(HttpSession session) {
	    Object v = session.getAttribute("loginUserId");
	    if (v instanceof Integer) return (Integer) v;

	    // 흔히 쓰는 케이스들 (프로젝트에 맞게 하나로 정리 추천)
	    Object user = session.getAttribute("loginUser");
	    if (user instanceof java.util.Map) {
	      Object id = ((java.util.Map<?, ?>) user).get("user_id");
	      if (id instanceof Number) return ((Number) id).intValue();
	    }
	    return 0; // 비로그인
	}
}
