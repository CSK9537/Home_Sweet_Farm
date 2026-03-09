package org.joonzis.community.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.joonzis.community.dto.CommunityPostCardDTO;
import org.joonzis.community.service.CommunityListService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/community")
public class CommunityListController {

    private final CommunityListService communityListService;

    private String buildThumbUrl(HttpServletRequest req, String subDir, String savedName) {
        if (!StringUtils.hasText(subDir) || !StringUtils.hasText(savedName)) {
            return null;
        }

        String ctx = req.getContextPath();
        return ctx
                + "/community/file?subDir="
                + URLEncoder.encode(subDir, StandardCharsets.UTF_8)
                + "&savedName="
                + URLEncoder.encode(savedName, StandardCharsets.UTF_8);
    }

    private String buildMoveUrl(HttpServletRequest req, int boardId) {
        return req.getContextPath() + "/community/view?board_id=" + boardId;
    }

    private String resolveWriteBoardType(String type) {
        return "MARKET".equalsIgnoreCase(type) ? "T" : "G";
    }

    @GetMapping("/list")
    public String list(HttpServletRequest req,
                       Model model,
                       @RequestParam(value = "type", required = false, defaultValue = "FREE") String type,
                       @RequestParam(value = "q", required = false) String q,
                       @RequestParam(value = "page", required = false, defaultValue = "1") int page,
                       @RequestParam(value = "size", required = false, defaultValue = "12") int size) {

        String boardTab = "MARKET".equalsIgnoreCase(type) ? "MARKET" : "FREE";

        Map<String, Object> data = communityListService.getList(boardTab, q, page, size);

        @SuppressWarnings("unchecked")
        List<CommunityPostCardDTO> posts = (List<CommunityPostCardDTO>) data.get("posts");

        if (posts != null) {
            for (CommunityPostCardDTO p : posts) {
                p.setThumbSrc(buildThumbUrl(req, p.getThumbSubDir(), p.getThumbSavedName()));
                p.setMoveUrl(buildMoveUrl(req, p.getBoardId()));
            }
        }

        int total = ((Number) data.get("total")).intValue();
        int currentPage = ((Number) data.get("page")).intValue();
        int pageSize = ((Number) data.get("size")).intValue();
        String keyword = (String) data.get("q");

        int totalPages = Math.max(1, (int) Math.ceil((double) total / pageSize));
        int blockSize = 5;
        int startPage = ((currentPage - 1) / blockSize) * blockSize + 1;
        int endPage = Math.min(startPage + blockSize - 1, totalPages);

        model.addAttribute("posts", posts);
        model.addAttribute("total", total);
        model.addAttribute("page", currentPage);
        model.addAttribute("size", pageSize);
        model.addAttribute("q", keyword);
        model.addAttribute("type", boardTab);

        model.addAttribute("writeBoardType", resolveWriteBoardType(boardTab));

        model.addAttribute("totalPages", totalPages);
        model.addAttribute("startPage", startPage);
        model.addAttribute("endPage", endPage);
        model.addAttribute("hasPrev", startPage > 1);
        model.addAttribute("hasNext", endPage < totalPages);
        model.addAttribute("prevPage", Math.max(1, startPage - 1));
        model.addAttribute("nextPage", Math.min(totalPages, endPage + 1));

        return "community/CommunityList";
    }

    @GetMapping("/detail")
    public String detailCompat(@RequestParam("id") int id) {
        return "redirect:/community/view?board_id=" + id;
    }
}