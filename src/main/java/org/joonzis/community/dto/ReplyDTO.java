package org.joonzis.community.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReplyDTO {
    private int reply_id;
    private int board_id;
    private int user_id;
    private Integer parent_reply_id;
    private String content;
    private LocalDateTime reg_date;
    
    // 화면 표시용 추가 필드
    private String writer_name; // nickname 혹은 username이 담길 곳.
    private String profile_filename;
}