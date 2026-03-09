package org.joonzis.community.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommunityPostCardDTO {

    private int boardId;

    private String title;
    private String writer;           // 작성자 표시명
    private String regDate;          // yyyy-MM-dd
    private String contentPreview;   // 작성내용 일부

    // 썸네일
    private String thumbSrc;         // 최종 브라우저 URL
    private String thumbSavedName;   // DB 저장 파일명
    private String thumbSubDir;      // DB 서브 디렉토리

    // 통계
    private int viewCount;
    private int likeCount;
    private int replyCnt;

    // 해시태그
    private String hashtags;         // "태그1,태그2"

    // 이동 URL
    private String moveUrl;

    // 목록/장터 공용 확장 필드
    private String boardType;
    private String tradeStatus;
    private Integer price;
    private String status;           // sell / share / done
}