package org.joonzis.common.controller;

import java.util.Collections;
import java.util.List;

import org.joonzis.common.service.SearchService;
import org.joonzis.community.dto.CommunityPostCardDTO;
import org.joonzis.plant.dto.SimplePlantDTO;
import org.joonzis.qna.dto.QnaFaqDTO;
import org.joonzis.store.dto.ProductForListDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class SearchViewController {

    @Autowired
    private SearchService sservice;

    @GetMapping("/searchResult")
    public String searchResult(
            @RequestParam(value = "q", defaultValue = "") String q,
            @RequestParam(value = "tab", defaultValue = "all") String tab,
            @RequestParam(value = "page", defaultValue = "1") int page,
            Model model) {
        
        if (q.trim().isEmpty()) {
            return "redirect:/"; 
        }

        // 💡 각 카테고리별 출력 개수 다르게 설정
        int plantAmount = 8; // 식물: 8개 (4x2 그리드)
        int storeAmount = 8; // 스토어: 8개 (4x2 그리드)
        int commAmount = 10; // 커뮤니티: 10개 (리스트)
        int qnaAmount = 10;  // QnA: 10개 (리스트)
        
        int total = 0;
        int currentAmount = 10; // 페이징 계산을 위한 현재 탭의 amount 저장용
        
        // --- [탭별 분기 처리] ---
        
        // 1. 식물
        if ("all".equals(tab) || "plant".equals(tab)) {
            List<SimplePlantDTO> list = sservice.searchPlants(q);
            model.addAttribute("plantTotal", list.size());
            model.addAttribute("plantResults", getPagedList(list, page, plantAmount, tab));
            
            if ("plant".equals(tab)) {
                total = list.size();
                currentAmount = plantAmount;
            }
        }
        
        // 2. 스토어
        if ("all".equals(tab) || "store".equals(tab)) {
            List<ProductForListDTO> list = sservice.searchProducts(q);
            model.addAttribute("storeTotal", list.size());
            model.addAttribute("storeResults", getPagedList(list, page, storeAmount, tab));
            
            if ("store".equals(tab)) {
                total = list.size();
                currentAmount = storeAmount;
            }
        }

        // 3. 커뮤니티
        if ("all".equals(tab) || "comm".equals(tab)) {
            List<CommunityPostCardDTO> list = sservice.searchComms(q);
            model.addAttribute("commTotal", list.size());
            // commAmount(10) 적용
            model.addAttribute("commResults", getPagedList(list, page, commAmount, tab));
            
            if ("comm".equals(tab)) {
                total = list.size();
                currentAmount = commAmount;
            }
        }

        // 4. QnA
        if ("all".equals(tab) || "qna".equals(tab)) {
            List<QnaFaqDTO> list = sservice.searchQnas(q);
            model.addAttribute("qnaTotal", list.size());
            // qnaAmount(10) 적용
            model.addAttribute("qnaResults", getPagedList(list, page, qnaAmount, tab));
            
            if ("qna".equals(tab)) {
                total = list.size();
                currentAmount = qnaAmount;
            }
        }

        // --- 페이징 UI를 위한 변수 세팅 ---
        if (!"all".equals(tab)) {
            // 💡 total을 currentAmount(현재 탭에 맞는 개수)로 나누어 페이징 끝 번호 계산
            int realEnd = (int) Math.ceil((double) total / currentAmount);
            int startPage = ((page - 1) / 5) * 5 + 1; // 하단 페이지 번호 5개씩 보여주기
            int endPage = Math.min(startPage + 4, realEnd);

            model.addAttribute("page", page);
            model.addAttribute("startPage", startPage);
            model.addAttribute("endPage", endPage);
            model.addAttribute("realEnd", realEnd);
        }

        model.addAttribute("keyword", q);
        model.addAttribute("tab", tab);

        return "common/SearchResult"; // 본인 프로젝트 경로에 맞게 (예: common/SearchResult)
    }

    // Java 단에서 리스트를 잘라주는 헬퍼 메서드
    private <T> List<T> getPagedList(List<T> list, int page, int amount, String tab) {
        if (list == null || list.isEmpty()) return Collections.emptyList();
        
        int targetPage = "all".equals(tab) ? 1 : page; 
        
        int start = (targetPage - 1) * amount;
        int end = Math.min(start + amount, list.size());
        
        if (start > list.size()) return Collections.emptyList();
        return list.subList(start, end);
    }
}