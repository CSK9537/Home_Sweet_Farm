package org.joonzis.qna.service;

import org.springframework.ui.Model;

public interface QnaListService {
    void fillQnaListModel(Model model, int page, String category, String query, String sortKey, String sortDir);
}
