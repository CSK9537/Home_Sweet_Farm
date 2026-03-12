package org.joonzis.qna.service;

import java.util.List;
import java.util.Map;

import org.joonzis.qna.dto.QnaFaqDTO;
import org.springframework.ui.Model;

public interface QnaMainService {
    void fillQnaMainModel(Model model, int faqPage, int waitingPage, String waitingSort, String ctx);
    void fillQnaPeopleModel(Model model, String ctx);
    Map<String, Object> getActiveUsersJson(int page, String ctx);
    
    // 사람들 페이지: 나이대별 관심사 그래프
    Map<String, Object> getAgeInterestStats(String ageGroup);
    
    // 메인 페이지 용
    List<QnaFaqDTO> topQuestions();
}