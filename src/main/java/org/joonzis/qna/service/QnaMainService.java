package org.joonzis.qna.service;

import java.util.Map;
import org.springframework.ui.Model;

public interface QnaMainService {
    void fillQnaMainModel(Model model, int faqPage, int waitingPage, String waitingSort, String ctx);
    void fillQnaPeopleModel(Model model, String ctx);
    Map<String, Object> getActiveUsersJson(int page, String ctx);
}