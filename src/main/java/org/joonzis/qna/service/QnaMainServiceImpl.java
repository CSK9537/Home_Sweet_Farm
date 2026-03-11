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

    private static final int TOP_USER_LIMIT = 3;
    private static final int FAQ_PAGE_SIZE = 12;
    private static final int FAQ_BLOCK_SIZE = 5;
    private static final int WAITING_PAGE_SIZE = 10;
    private static final int WAITING_BLOCK_SIZE = 5;

    @Override
    public void fillQnaMainModel(Model model, int faqPage, int waitingPage, String waitingSort, String ctx) {
        // 1) 채택왕
        List<QnaTopUserDTO> topUsers = qnaMainMapper.selectTopUsers(TOP_USER_LIMIT);
        for (int i = 0; i < topUsers.size(); i++) {
            QnaTopUserDTO u = topUsers.get(i);
            u.setRank(i + 1);
            setProfileImg(u, ctx);

            if (u.getRank() == 1) u.setBadge("채택왕");
            else if (u.getRank() == 2) u.setBadge("우수답변");
            else u.setBadge("상위답변");
        }
        model.addAttribute("topUsers", topUsers);

        // 2) FAQ
        int faqTotal = qnaMainMapper.countFaqQuestions();
        QnaPagingDTO faqPaging = buildPaging(faqTotal, faqPage, FAQ_PAGE_SIZE, FAQ_BLOCK_SIZE);
        Map<String, Object> faqParam = new HashMap<>();
        faqParam.put("startRow", startRow(faqPage, FAQ_PAGE_SIZE));
        faqParam.put("endRow", endRow(faqPage, FAQ_PAGE_SIZE));
        List<QnaFaqDTO> faqTopList = qnaMainMapper.selectFaqTopList(faqParam);
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
        waitingParam.put("waitingSort", waitingSort);
        List<QnaWaitingDTO> waitingList = qnaMainMapper.selectWaitingList(waitingParam);
        LocalDateTime now = LocalDateTime.now();
        for (QnaWaitingDTO q : waitingList) {
            q.setAgo(toAgo(now, q.getRegDate()));
            q.setIsNew(isNew(now, q.getRegDate()));
        }
        model.addAttribute("waitingList", waitingList);
        model.addAttribute("waitingPaging", waitingPaging);
    }

    @Override
    public void fillQnaPeopleModel(Model model, String ctx) {
        List<QnaTopUserDTO> topUsers = qnaMainMapper.selectTopUsers(20);
        for (QnaTopUserDTO u : topUsers) {
            setProfileImg(u, ctx);
            if (u.getRank() == 1) u.setBadge("채택왕");
            else if (u.getRank() <= 5) u.setBadge("우수답변");
            else u.setBadge("상위답변");
        }
        model.addAttribute("topUsers", topUsers);
    }

    @Override
    public Map<String, Object> getActiveUsersJson(int page, String ctx) {
        int pageSize = 8;
        int total = qnaMainMapper.countActiveUsers();
        Map<String, Object> param = new HashMap<>();
        param.put("startRow", startRow(page, pageSize));
        param.put("endRow", endRow(page, pageSize));
        List<QnaTopUserDTO> list = qnaMainMapper.selectActiveUserList(param);
        for (QnaTopUserDTO u : list) {
            setProfileImg(u, ctx);
            if (u.getRank() == 1) u.setBadge("채택왕");
            else if (u.getRank() <= 5) u.setBadge("우수답변");
            else if (u.getRank() <= 20) u.setBadge("상위답변");
            else u.setBadge("활동중");
        }
        Map<String, Object> result = new HashMap<>();
        result.put("list", list);
        result.put("total", total);
        result.put("hasNext", endRow(page, pageSize) < total);
        return result;
    }
    
    // 메인 페이지용
    @Override
    public List<QnaFaqDTO> topQuestions() {
    	Map<String, Object> Param = new HashMap<>();
    	Param.put("startRow", 1);
        Param.put("endRow", 3);
    	return qnaMainMapper.selectFaqTopList(Param);
    }

    /**
     * 프로필 이미지 경로 설정 (이미지 스트리밍 엔드포인트 사용)
     */
    private void setProfileImg(QnaTopUserDTO u, String ctx) {
        String img = u.getImg();
        if (img == null || img.trim().isEmpty()) {
            img = "default_profile.png";
        }
        
        if (img.startsWith("http")) {
            u.setImg(img);
        } else {
            // ProfileImageController (/user/getProfile) 사용
            u.setImg(ctx + "/user/getProfile?fileName=" + img);
        }
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