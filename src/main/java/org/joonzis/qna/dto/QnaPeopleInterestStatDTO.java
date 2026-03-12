package org.joonzis.qna.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QnaPeopleInterestStatDTO {
    private String tagName;   // 해시태그명
    private int cnt;          // 질문 수
    private int percent;      // TOP4 합 기준 퍼센트
}