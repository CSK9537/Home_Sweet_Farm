package org.joonzis.qna.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QnaViewDTO {
    private QnaQuestionDTO board;
    private List<QnaAnswerDTO> answerList;
    private List<QnaReplyDTO> replyList; // Question comments
}
