package org.joonzis.qna.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.joonzis.qna.dto.QnaFaqDTO;
import org.joonzis.qna.dto.QnaPagingDTO;
import org.joonzis.qna.dto.QnaPeopleInterestStatDTO;
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

    @Override
    public Map<String, Object> getAgeInterestStats(String ageGroup) {
        AgeRange range = AgeRange.of(ageGroup);

        Map<String, Object> param = new HashMap<>();
        param.put("minAge", range.minAge);
        param.put("maxAge", range.maxAge);

        List<QnaPeopleInterestStatDTO> list = qnaMainMapper.selectAgeInterestTopTags(param);
        applyPercent(list);

        Map<String, Object> result = new HashMap<>();
        result.put("ageGroup", range.code);
        result.put("ageLabel", range.label);
        result.put("headline", buildHeadline(range.label, list));
        result.put("list", list);
        result.put("empty", list == null || list.isEmpty());
        return result;
    }

    // 메인 페이지용
    @Override
    public List<QnaFaqDTO> topQuestions() {
        Map<String, Object> param = new HashMap<>();
        param.put("startRow", 1);
        param.put("endRow", 3);
        return qnaMainMapper.selectFaqTopList(param);
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
            u.setImg(ctx + "/user/getProfile?fileName=" + img);
        }
    }

    private void applyPercent(List<QnaPeopleInterestStatDTO> list) {
        if (list == null || list.isEmpty()) return;

        int total = 0;
        int maxIdx = 0;
        int maxCnt = -1;

        for (int i = 0; i < list.size(); i++) {
            total += list.get(i).getCnt();
            if (list.get(i).getCnt() > maxCnt) {
                maxCnt = list.get(i).getCnt();
                maxIdx = i;
            }
        }

        if (total <= 0) {
            for (QnaPeopleInterestStatDTO dto : list) {
                dto.setPercent(0);
            }
            return;
        }

        int percentSum = 0;
        for (QnaPeopleInterestStatDTO dto : list) {
            int percent = (int) Math.round(dto.getCnt() * 100.0 / total);
            dto.setPercent(percent);
            percentSum += percent;
        }

        // 반올림 오차 보정: 가장 큰 항목에 차이값 더함
        int diff = 100 - percentSum;
        if (diff != 0 && maxIdx >= 0 && maxIdx < list.size()) {
            QnaPeopleInterestStatDTO maxItem = list.get(maxIdx);
            maxItem.setPercent(maxItem.getPercent() + diff);
        }
    }

    private String buildHeadline(String ageLabel, List<QnaPeopleInterestStatDTO> list) {
        if (list == null || list.isEmpty()) {
            return ageLabel + " 관심사 통계를 표시할 데이터가 아직 부족합니다.";
        }
        return ageLabel + " Q&A 관심 해시태그 1위는 " + list.get(0).getTagName() + " 입니다.";
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

    private static class AgeRange {
        private final String code;
        private final String label;
        private final int minAge;
        private final int maxAge;

        private AgeRange(String code, String label, int minAge, int maxAge) {
            this.code = code;
            this.label = label;
            this.minAge = minAge;
            this.maxAge = maxAge;
        }

        private static AgeRange of(String code) {
            if (code == null) return new AgeRange("30", "30대", 30, 39);

            switch (code) {
                case "U10": return new AgeRange("U10", "10대 미만", 0, 9);
                case "10":  return new AgeRange("10", "10대", 10, 19);
                case "20":  return new AgeRange("20", "20대", 20, 29);
                case "30":  return new AgeRange("30", "30대", 30, 39);
                case "40":  return new AgeRange("40", "40대", 40, 49);
                case "50":  return new AgeRange("50", "50대", 50, 59);
                case "60":  return new AgeRange("60", "60대 이상", 60, 200);
                default:    return new AgeRange("30", "30대", 30, 39);
            }
        }
    }
}