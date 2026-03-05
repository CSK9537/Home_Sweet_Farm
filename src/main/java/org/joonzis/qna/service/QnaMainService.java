package org.joonzis.qna.service;

import org.springframework.ui.Model;

public interface QnaMainService {
    void fillQnaMainModel(Model model, int faqPage, int waitingPage, String waitingSort, String ctx);
}