package org.joonzis.qna.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QnaTopUserDTO {
    private int userId;
    private int rank;     // 1,2,3...
    private String name;  // 닉네임
    private String img;   // 프로필 이미지 URL(완성된 경로)
    private String badge; // 예: "채택왕"
    private int point;    // 채택 수(= selectedCnt)
}