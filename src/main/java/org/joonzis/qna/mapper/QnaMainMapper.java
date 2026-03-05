package org.joonzis.qna.mapper;

import java.util.List;
import java.util.Map;

import org.joonzis.qna.dto.QnaFaqDTO;
import org.joonzis.qna.dto.QnaTopUserDTO;
import org.joonzis.qna.dto.QnaWaitingDTO;

public interface QnaMainMapper {

    // 채택왕: "답변글(TBL_BOARD의 parent_id 존재)" 중 IS_SELECTED='Y' 많은 유저
    List<QnaTopUserDTO> selectTopUsers(int limit);

    // FAQ: QNA 질문(부모글) 중 조회수 상위
    int countFaqQuestions();
    List<QnaFaqDTO> selectFaqTopList(Map<String, Object> param);

    // Waiting: 답변(자식글)이 없는 QNA 질문
    int countWaitingQuestions();
    List<QnaWaitingDTO> selectWaitingList(Map<String, Object> param);
}