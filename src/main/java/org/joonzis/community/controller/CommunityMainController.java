package org.joonzis.community.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.joonzis.community.dto.CommunityPostCardDTO;
import org.joonzis.community.service.CommunityMainService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/community")
public class CommunityMainController {

    private final CommunityMainService communityMainService;

    /**
     * /community 로 들어오면 데이터 세팅 페이지로 이동
     */
    @GetMapping({"", "/"})
    public String root() {
        return "redirect:/community/main";
    }

    // 썸네일 저장 경로 규칙(프로젝트에 맞게 수정)
    private String buildThumbUrl(HttpServletRequest req, String savedName) {
        if (savedName == null || savedName.trim().isEmpty()) return null;
        String ctx = req.getContextPath();
        // 예: /upload/community/{savedName}
        return ctx + "/upload/community/" + savedName;
    }

    private String buildMoveUrl(HttpServletRequest req, int boardId) {
        String ctx = req.getContextPath();
        // 상세 페이지 URL 규칙(프로젝트에 맞게 수정)
        return ctx + "/community/detail?board_id=" + boardId;
    }

    private void decorate(HttpServletRequest req, List<CommunityPostCardDTO> list) {
        if (list == null) return;
        for (int i = 0; i < list.size(); i++) {
            CommunityPostCardDTO dto = list.get(i);
            dto.setMoveUrl(buildMoveUrl(req, dto.getBoardId()));
            dto.setThumbSrc(buildThumbUrl(req, dto.getThumbSrc()));
        }
    }

    /**
     * 커뮤니티 메인(레일 데이터 포함)
     * 실제 URL: /community/main
     */
    @GetMapping("/main")
    public String main(HttpServletRequest req, Model model) {
        Map<String, List<CommunityPostCardDTO>> rails = communityMainService.getRails(10);

        List<CommunityPostCardDTO> popular = rails.get("popularPosts");
        List<CommunityPostCardDTO> hot     = rails.get("hotPosts");
        List<CommunityPostCardDTO> latest  = rails.get("latestPosts");
        List<CommunityPostCardDTO> qa      = rails.get("qaPosts");

        decorate(req, popular);
        decorate(req, hot);
        decorate(req, latest);
        decorate(req, qa);

        // CommunityMain.jsp가 기대하는 키 그대로
        model.addAttribute("popularPosts", popular);
        model.addAttribute("hotPosts", hot);
        model.addAttribute("latestPosts", latest);
        model.addAttribute("qaPosts", qa);

        return "community/CommunityMain";
    }
}