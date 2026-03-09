package org.joonzis.community.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.joonzis.community.dto.CommunityPostCardDTO;
import org.joonzis.community.service.CommunityMainService;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
public class CommunityMainApiController {

    private final CommunityMainService communityMainService;

    @GetMapping("/community/db-check")
    public Map<String, Object> dbCheck() {
        Map<String, Object> info = communityMainService.dbCheck();
        log.info("[DB_CHECK] {}", info);
        return info;
    }

    private boolean isAllowedKind(String kind) {
        return "popular".equals(kind) || "hot".equals(kind) || "latest".equals(kind) || "qa".equals(kind);
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

    @GetMapping("/community/main/more")
    public List<CommunityPostCardDTO> more(
            HttpServletRequest req,
            @RequestParam(defaultValue = "latest") String kind,
            @RequestParam(defaultValue = "100") int limit) {

        if (limit > 100) limit = 100;
        if (limit < 1) limit = 1;
        if (!isAllowedKind(kind)) kind = "latest";

        List<CommunityPostCardDTO> list = communityMainService.getMore(kind, limit);
        decorate(req, list);
        return list;
    }
}