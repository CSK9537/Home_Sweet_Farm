package org.joonzis.community.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.joonzis.community.dto.CommunityPostCardDTO;
import org.joonzis.community.service.CommunityMainService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/community")
public class CommunityMainController {

    private final CommunityMainService communityMainService;

    @GetMapping({"", "/"})
    public String root() {
        return "redirect:/community/main";
    }

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

    private String stripHtmlAndCut(String html, int maxLen) {
        if (html == null) return "";
        String text = html.replaceAll("<[^>]+>", " ");
        text = text.replaceAll("&nbsp;", " ").replaceAll("\\s+", " ").trim();
        if (text.length() <= maxLen) return text;
        return text.substring(0, maxLen) + "...";
    }

    private void decorate(HttpServletRequest req, List<CommunityPostCardDTO> list) {
        if (list == null) return;
        for (CommunityPostCardDTO dto : list) {
            dto.setMoveUrl(buildMoveUrl(req, dto.getBoardId()));
            dto.setThumbSrc(buildThumbUrl(req, dto.getThumbSubDir(), dto.getThumbSavedName()));
            dto.setContentPreview(stripHtmlAndCut(dto.getContentPreview(), 80));
        }
    }

    @GetMapping("/main")
    public String main(HttpServletRequest req, Model model) {
        Map<String, List<CommunityPostCardDTO>> rails = communityMainService.getRails(10);

        List<CommunityPostCardDTO> popular = rails.get("popularPosts");
        List<CommunityPostCardDTO> hot = rails.get("hotPosts");
        List<CommunityPostCardDTO> latest = rails.get("latestPosts");

        decorate(req, popular);
        decorate(req, hot);
        decorate(req, latest);

        model.addAttribute("popularPosts", popular);
        model.addAttribute("hotPosts", hot);
        model.addAttribute("latestPosts", latest);

        return "community/CommunityMain";
    }
}