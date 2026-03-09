package org.joonzis.qna.service;

import java.sql.Date;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.joonzis.qna.dto.QnaListDTO;
import org.joonzis.qna.dto.QnaPagingDTO;
import org.joonzis.qna.dto.TagTopListDTO;
import org.joonzis.qna.mapper.QnaListMapper;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QnaListServiceImpl implements QnaListService {

    private final QnaListMapper qnaListMapper;

    private static final int PAGE_SIZE = 20; // 가이드상의 리스트형 기본값
    private static final int BLOCK_SIZE = 5;

    @Override
    public void fillQnaListModel(Model model, int page, String category, String query, String sortKey, String sortDir) {
        
        // 1) 파라미터 구성
        Map<String, Object> param = new HashMap<>();
        param.put("tagName", category);
        param.put("searchKeyword", query);
        param.put("sortKey", sortKey);
        param.put("sortDir", sortDir != null ? sortDir.toUpperCase() : "DESC");

        // 2) 전체 개수 및 페이징 계산
        int totalCount = qnaListMapper.getCountQnaList(param);
        QnaPagingDTO paging = buildPaging(totalCount, page, PAGE_SIZE, BLOCK_SIZE);
        
        param.put("startRow", startRow(paging.getPage(), PAGE_SIZE));
        param.put("endRow", endRow(paging.getPage(), PAGE_SIZE));

        // 3) 목록 조회 및 데이터 가공
        List<QnaListDTO> qnaList = qnaListMapper.selectQnaTopList(param);
        LocalDateTime now = LocalDateTime.now();
        
        for (QnaListDTO q : qnaList) {
            // "3분 전" 같은 라벨 처리
            q.setCreatedAtLabel(toAgo(now, q.getRegDate()));
            
            // JS 정렬용 타임스탬프
            if (q.getRegDate() != null) {
                q.setCreatedEpoch(q.getRegDate().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());
            }
            
            // 미리보기(preview)는 SQL DBMS_LOB.SUBSTR에서 이미 잘라옴
        }

        // 4) 사이드바/상단 분야 목록
        List<TagTopListDTO> tagTop15 = qnaListMapper.selectQnaTagTopList();

        // 5) 모델 전송
        model.addAttribute("qnaList", qnaList);
        model.addAttribute("pageInfo", paging);
        model.addAttribute("tagTop15", tagTop15);
        
        // 오늘의 새 질문 + 오늘의 답변
        Map<String, Object> counts = qnaListMapper.getCountTodayQna(Date.valueOf(now.toLocalDate()));
        int todayNewQuestionCnt = 0;
        int todayNewAnswerCnt = 0;
        
        if (counts != null) {
            // Oracle/MyBatis는 Map 키를 대문자로 반환하는 경우가 많습니다.
            Object q = (counts.get("Q_COUNT") != null) ? counts.get("Q_COUNT") : counts.get("q_count");
            Object a = (counts.get("A_COUNT") != null) ? counts.get("A_COUNT") : counts.get("a_count");
            
            if (q != null) todayNewQuestionCnt = Integer.parseInt(q.toString());
            if (a != null) todayNewAnswerCnt = Integer.parseInt(a.toString());
        }
        
        model.addAttribute("todayNewQuestionCnt", todayNewQuestionCnt);
        model.addAttribute("todayNewAnswerCnt", todayNewAnswerCnt);
    }

    // --- Helper Methods (QnaMainServiceImpl 스타일 계승) ---

    private static int startRow(int page, int pageSize) {
        return (page - 1) * pageSize + 1;
    }

    private static int endRow(int page, int pageSize) {
        return page * pageSize;
    }

    private static QnaPagingDTO buildPaging(int totalCount, int page, int pageSize, int blockSize) {
        int totalPage = (int) Math.ceil(totalCount / (double) pageSize);
        if (totalPage < 1) totalPage = 1;
        if (page < 1) page = 1;
        if (page > totalPage) page = totalPage;

        int startPage = ((page - 1) / blockSize) * blockSize + 1;
        int endPage = Math.min(startPage + blockSize - 1, totalPage);

        return new QnaPagingDTO(page, startPage, endPage, totalPage);
    }

    private static String toAgo(LocalDateTime now, LocalDateTime regDate) {
        if (regDate == null) return "";
        Duration d = Duration.between(regDate, now);

        long minutes = d.toMinutes();
        if (minutes < 1) return "방금 전";
        if (minutes < 60) return minutes + "분 전";

        long hours = d.toHours();
        if (hours < 24) return hours + "시간 전";

        long days = d.toDays();
        if (days < 7) return days + "일 전";
        
        return regDate.toLocalDate().toString(); // 아주 오래된 글은 날짜로 표시
    }
}
