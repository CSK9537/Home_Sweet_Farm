package org.joonzis.qna.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.joonzis.qna.dto.QnaFaqDTO;
import org.joonzis.qna.dto.QnaPagingDTO;
import org.joonzis.qna.dto.QnaTopUserDTO;
import org.joonzis.qna.dto.QnaWaitingDTO;
import org.joonzis.qna.mapper.QnaMainMapper;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QnaMainServiceImpl implements QnaMainService {

    private final QnaMainMapper qnaMainMapper;

    // 화면 구성 추천값(원하면 조절 가능)
    private static final int TOP_USER_LIMIT = 3;

    private static final int FAQ_PAGE_SIZE = 12;     // faq-grid가 카드형이라 12 권장
    private static final int FAQ_BLOCK_SIZE = 5;

    private static final int WAITING_PAGE_SIZE = 10; // waiting-list는 10 권장
    private static final int WAITING_BLOCK_SIZE = 5;

    @Override
    public void fillQnaMainModel(Model model, int faqPage, int waitingPage, String waitingSort, String ctx) {

        // 1) 채택왕
        List<QnaTopUserDTO> topUsers = qnaMainMapper.selectTopUsers(TOP_USER_LIMIT);
        for (int i = 0; i < topUsers.size(); i++) {
            QnaTopUserDTO u = topUsers.get(i);
            u.setRank(i + 1);

            // profile 이미지 URL 완성 (프로젝트에서 쓰는 기본 이미지 경로 참고)
            if (u.getImg() == null || u.getImg().trim().isEmpty()) {
                u.setImg(ctx + "/resources/img/default_profile.png");
            } else if (!u.getImg().startsWith("http") && !u.getImg().startsWith(ctx)) {
                // DB에 파일명만 들어온 경우를 방어적으로 처리
                // (프로필 업로드 경로가 따로 있으면 여기만 맞춰주면 됨)
                u.setImg(ctx + "/resources/img/default_profile.png");
            }

            // 배지 예시
            if (u.getRank() == 1) u.setBadge("채택왕");
            else if (u.getRank() == 2) u.setBadge("우수답변");
            else u.setBadge("상위답변");
        }
        model.addAttribute("topUsers", topUsers);

        // 2) 많이 물어보는 Q&A (FAQ)
        int faqTotal = qnaMainMapper.countFaqQuestions();
        QnaPagingDTO faqPaging = buildPaging(faqTotal, faqPage, FAQ_PAGE_SIZE, FAQ_BLOCK_SIZE);

        Map<String, Object> faqParam = new HashMap<>();
        faqParam.put("startRow", startRow(faqPage, FAQ_PAGE_SIZE));
        faqParam.put("endRow", endRow(faqPage, FAQ_PAGE_SIZE));
        List<QnaFaqDTO> faqTopList = qnaMainMapper.selectFaqTopList(faqParam);

        // rank(현재 페이지 기준으로 연속번호 부여)
        int faqBaseRank = (faqPage - 1) * FAQ_PAGE_SIZE;
        for (int i = 0; i < faqTopList.size(); i++) {
            faqTopList.get(i).setRank(faqBaseRank + i + 1);
        }

        model.addAttribute("faqTopList", faqTopList);
        model.addAttribute("faqPaging", faqPaging);

        // 3) 답변을 기다리는 질문
        int waitingTotal = qnaMainMapper.countWaitingQuestions();
        QnaPagingDTO waitingPaging = buildPaging(waitingTotal, waitingPage, WAITING_PAGE_SIZE, WAITING_BLOCK_SIZE);

        Map<String, Object> waitingParam = new HashMap<>();
        waitingParam.put("startRow", startRow(waitingPage, WAITING_PAGE_SIZE));
        waitingParam.put("endRow", endRow(waitingPage, WAITING_PAGE_SIZE));
        waitingParam.put("waitingSort", waitingSort); // recent / view(=오래된순)

        List<QnaWaitingDTO> waitingList = qnaMainMapper.selectWaitingList(waitingParam);

        // ago / isNew 계산
        LocalDateTime now = LocalDateTime.now();
        for (QnaWaitingDTO q : waitingList) {
            q.setAgo(toAgo(now, q.getRegDate()));
            q.setNew(isNew(now, q.getRegDate()));
        }

        model.addAttribute("waitingList", waitingList);
        model.addAttribute("waitingPaging", waitingPaging);
    }

    private static int startRow(int page, int pageSize) {
        return (page - 1) * pageSize + 1;
    }

    private static int endRow(int page, int pageSize) {
        return page * pageSize;
    }

    private static QnaPagingDTO buildPaging(int totalCount, int page, int pageSize, int blockSize) {
        int totalPage = (int) Math.ceil(totalCount / (double) pageSize);
        if (totalPage < 1) totalPage = 1;
        if (page > totalPage) page = totalPage;

        int startPage = ((page - 1) / blockSize) * blockSize + 1;
        int endPage = Math.min(startPage + blockSize - 1, totalPage);

        return new QnaPagingDTO(page, startPage, endPage, totalPage);
    }

    private static boolean isNew(LocalDateTime now, LocalDateTime regDate) {
        if (regDate == null) return false;
        return Duration.between(regDate, now).toHours() < 24;
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
        return days + "일 전";
    }
}