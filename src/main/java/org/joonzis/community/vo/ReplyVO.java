package org.joonzis.community.vo;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReplyVO {
    private int reply_id, board_id, user_id, like_cnt;
    private Integer parent_reply_id;
    private String content, is_active;
    private LocalDateTime reg_date, updated_at;
}
