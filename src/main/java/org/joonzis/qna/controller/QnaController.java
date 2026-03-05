package org.joonzis.qna.controller;

import javax.servlet.http.HttpServletRequest;

import org.joonzis.qna.service.QnaMainService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.RequiredArgsConstructor;

@RequestMapping("/qna")
@Controller
@RequiredArgsConstructor
public class QnaController {

    private final QnaMainService qnaMainService;

    @RequestMapping("")
    public String qnaMain(
            HttpServletRequest request,
            Model model,
            Integer faqPage,
            Integer waitingPage,
            String waitingSort
    ) {
        int fp = (faqPage == null || faqPage < 1) ? 1 : faqPage;
        int wp = (waitingPage == null || waitingPage < 1) ? 1 : waitingPage;
        String sort = (waitingSort == null || waitingSort.trim().isEmpty()) ? "recent" : waitingSort;

        String ctx = request.getContextPath();

        // QnaMain.jsp에서 사용하는 모델 키들 그대로 세팅
        qnaMainService.fillQnaMainModel(model, fp, wp, sort, ctx);

        return "qna/QnaMain";
    }

    @RequestMapping("/QnaList")
    public String qnaList() {
        return "qna/QnaList";
    }
}