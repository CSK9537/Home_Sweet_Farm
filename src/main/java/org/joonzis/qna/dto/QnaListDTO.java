package org.joonzis.qna.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class QnaListDTO {
    private int qna_id;         // 게시글 고유 ID
    private String title;       // 제목
    private String preview;     // 미리보기 텍스트
    private String tagName;     // 대표 카테고리/태그명
    private int likeCount;      // 좋아요 수
    private int answerCount;    // 답변 수
    
    // 날짜 관련
    private LocalDateTime regDate; // DB 연동용
    private long createdEpoch;      // 정렬용 타임스탬프
    private String createdAtLabel;  // 표시용 ("3시간 전" 등)
}
