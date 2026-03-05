package org.joonzis.qna.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QnaFaqDTO {
    private int id;        // qnaId
    private int rank;      // 화면에서 1~n 표시
    private String title;
    private String preview;
    private int views;
    private int answers;   // 답변 개수(= 자식글 수)
}