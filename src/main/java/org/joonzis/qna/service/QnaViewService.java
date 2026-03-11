package org.joonzis.qna.service;

import org.joonzis.qna.dto.QnaViewDTO;

public interface QnaViewService {
    QnaViewDTO getQnaView(int board_id);
    int registerAnswer(int uid, String title, String content, int parentId);
    boolean deleteQuestion(int boardId, int uid);
}
