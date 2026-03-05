package org.joonzis.qna.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QnaWaitingDTO {
    private int id;
    private String title;
    private String category;
    private String author;

    private LocalDateTime regDate; // 서비스에서 ago/isNew 계산용
    private String ago;            // "3시간 전" 같은 표시용
    private Boolean isNew;         // N 배지 표시용

    private int answerCnt;         // 답변 개수(= 자식글 수; waiting은 보통 0)
}