package org.joonzis.community.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.joonzis.community.dto.CommunityListDTO;
import org.joonzis.community.mapper.CommunityListMapper;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommunityListServiceImpl implements CommunityListService {

  private final CommunityListMapper communityListMapper;

  private String stripHtmlAndCut(String html, int maxLen) {
    if (html == null) return "";
    // 아주 단순 제거(에디터 HTML용). 더 엄격히 하려면 Jsoup 권장.
    String text = html.replaceAll("<[^>]+>", " ");
    text = text.replaceAll("&nbsp;", " ").replaceAll("\\s+", " ").trim();
    if (text.length() <= maxLen) return text;
    return text.substring(0, maxLen) + "...";
  }

  private List<String> resolveBoardTypes(String type) {
    // CommunityList.jsp: FREE|MARKET
    // 프로젝트 Form.js: G/T/S 사용
    List<String> boardTypes = new ArrayList<>();
    if ("MARKET".equalsIgnoreCase(type)) {
      boardTypes.add("T"); // 판매(중고거래)
      boardTypes.add("S"); // 나눔
    } else {
      boardTypes.add("G"); // 자유게시판
    }
    return boardTypes;
  }

  private String resolveMarketStatus(String boardType, String tradeStatus) {
    // Form.jsp trade_status: P(진행중), C(완료)
    if ("C".equalsIgnoreCase(tradeStatus)) return "done";
    if ("S".equalsIgnoreCase(boardType)) return "share";
    if ("T".equalsIgnoreCase(boardType)) return "sell";
    return null;
  }

  @Override
  public Map<String, Object> getList(String type, String q, int page, int size) {
    // 이 메서드는 Controller에서 request를 넘겨주지 않으므로,
    // thumb URL 조립은 Controller에서 처리하도록 "savedName"을 img로 임시 담아두고,
    // Controller에서 최종 URL로 변환하는 방식도 가능.
    // 여기서는 리스트 조회 + content/status 정리까지만 담당하도록 구성.
    Map<String, Object> res = new HashMap<>();
    res.put("type", type);

    int safePage = Math.max(page, 1);
    int safeSize = (size <= 0) ? 12 : Math.min(size, 60);

    int startRow = (safePage - 1) * safeSize + 1;
    int endRow = safePage * safeSize;

    Map<String, Object> param = new HashMap<>();
    param.put("boardTypes", resolveBoardTypes(type));
    param.put("q", (q == null) ? "" : q.trim());
    param.put("startRow", startRow);
    param.put("endRow", endRow);

    int total = communityListMapper.countCommunityList(param);
    List<CommunityListDTO> list = communityListMapper.selectCommunityList(param);

    for (CommunityListDTO p : list) {
      // content 미리보기
      p.setBoardContent(stripHtmlAndCut(p.getBoardContent(), 120));

      // status (MARKET일 때만 의미)
      try {
        java.lang.reflect.Method getBoardType = p.getClass().getMethod("getBoardType");
        java.lang.reflect.Method getTradeStatus = p.getClass().getMethod("getTradeStatus");
        Object bt = getBoardType.invoke(p);
        Object ts = getTradeStatus.invoke(p);
        p.setStatus(resolveMarketStatus(bt == null ? null : bt.toString(), ts == null ? null : ts.toString()));
      } catch (Exception ignore) {
      	}
    }

    res.put("posts", list);
    res.put("total", total);
    res.put("page", safePage);
    res.put("size", safeSize);
    return res;
  }
}