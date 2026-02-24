package org.joonzis.community.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.joonzis.community.dto.CommunityPostCardDTO;
import org.joonzis.community.service.CommunityMainService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class CommunityMainApiController {

    private final CommunityMainService communityMainService;

    // ✅ 허용 kind (요구사항: popular/hot/latest/qa)
    private boolean isAllowedKind(String kind) {
        return "popular".equals(kind) || "hot".equals(kind) || "latest".equals(kind) || "qa".equals(kind);
    }

    // ✅ 썸네일 URL 조립 (컨트롤러와 동일 규칙)
    private String buildThumbUrl(HttpServletRequest req, String savedName) {
        if (savedName == null || savedName.trim().isEmpty()) return null;
        String ctx = req.getContextPath();
        return ctx + "/upload/community/" + savedName;
    }

    // ✅ 상세 이동 URL 조립 (컨트롤러와 동일 규칙)
    private String buildMoveUrl(HttpServletRequest req, int boardId) {
        String ctx = req.getContextPath();
        return ctx + "/community/detail?board_id=" + boardId;
    }

    private void decorate(HttpServletRequest req, List<CommunityPostCardDTO> list) {
        if (list == null) return;
        for (CommunityPostCardDTO dto : list) {
            dto.setMoveUrl(buildMoveUrl(req, dto.getBoardId()));
            dto.setThumbSrc(buildThumbUrl(req, dto.getThumbSrc()));
        }
    }

    /**
     * ✅ 전체보기 API (서버에서 최대 100개 제공)
     * GET /community/main/more?kind=popular|hot|latest|qa&limit=100
     */
    @GetMapping("/community/main/more")
    public List<CommunityPostCardDTO> more(
            HttpServletRequest req,
            @RequestParam(defaultValue = "latest") String kind,
            @RequestParam(defaultValue = "100") int limit
    ) {
        // limit 안전장치
        if (limit > 100) limit = 100;
        if (limit < 1) limit = 1;

        // kind 안전장치
        if (!isAllowedKind(kind)) kind = "latest";

        List<CommunityPostCardDTO> list = communityMainService.getMore(kind, limit);

        // ✅ API 응답도 화면에서 바로 쓰도록 가공
        decorate(req, list);

        return list;
    }
}