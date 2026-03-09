package org.joonzis.community.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.joonzis.community.dto.CommunityPostCardDTO;
import org.joonzis.community.mapper.CommunityListMapper;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommunityListServiceImpl implements CommunityListService {

    private final CommunityListMapper communityListMapper;

    private String stripHtmlAndCut(String html, int maxLen) {
        if (html == null) return "";
        String text = html.replaceAll("<[^>]+>", " ");
        text = text.replaceAll("&nbsp;", " ").replaceAll("\\s+", " ").trim();
        if (text.length() <= maxLen) return text;
        return text.substring(0, maxLen) + "...";
    }

    private List<String> resolveBoardTypes(String type) {
        List<String> boardTypes = new ArrayList<>();
        if ("MARKET".equalsIgnoreCase(type)) {
            boardTypes.add("T");
            boardTypes.add("S");
        } else {
            boardTypes.add("G");
        }
        return boardTypes;
    }

    private String resolveMarketStatus(String boardType, String tradeStatus) {
        if ("C".equalsIgnoreCase(tradeStatus)) return "done";
        if ("S".equalsIgnoreCase(boardType)) return "share";
        if ("T".equalsIgnoreCase(boardType)) return "sell";
        return null;
    }

    @Override
    public Map<String, Object> getList(String type, String q, int page, int size) {
        Map<String, Object> res = new HashMap<>();

        String boardTab = "MARKET".equalsIgnoreCase(type) ? "MARKET" : "FREE";
        String keyword = (q == null) ? "" : q.trim();
        String qNoHash = keyword.replaceFirst("^#+", "").trim();

        int safeSize = (size <= 0) ? 12 : Math.min(size, 60);

        Map<String, Object> countParam = new HashMap<>();
        countParam.put("boardTypes", resolveBoardTypes(boardTab));
        countParam.put("q", keyword);
        countParam.put("qNoHash", qNoHash);

        int total = communityListMapper.countCommunityList(countParam);

        int totalPages = Math.max(1, (int) Math.ceil((double) total / safeSize));
        int safePage = Math.max(1, Math.min(page, totalPages));

        int startRow = (safePage - 1) * safeSize + 1;
        int endRow = safePage * safeSize;

        Map<String, Object> param = new HashMap<>();
        param.put("boardTypes", resolveBoardTypes(boardTab));
        param.put("q", keyword);
        param.put("qNoHash", qNoHash);
        param.put("startRow", startRow);
        param.put("endRow", endRow);

        List<CommunityPostCardDTO> list = communityListMapper.selectCommunityList(param);

        for (CommunityPostCardDTO p : list) {
            p.setContentPreview(stripHtmlAndCut(p.getContentPreview(), 120));
            p.setStatus(resolveMarketStatus(p.getBoardType(), p.getTradeStatus()));
        }

        res.put("posts", list);
        res.put("total", total);
        res.put("page", safePage);
        res.put("size", safeSize);
        res.put("type", boardTab);
        res.put("q", keyword);

        return res;
    }
}