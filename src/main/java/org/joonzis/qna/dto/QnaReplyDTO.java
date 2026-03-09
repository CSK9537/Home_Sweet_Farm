package org.joonzis.qna.dto;

import java.sql.Timestamp;
import lombok.Data;

@Data
public class QnaReplyDTO {
    private int reply_id, board_id, user_id, like_cnt;
    private Integer parent_reply_id;
    private String content, writer, writer_profile;
    private Timestamp reg_date;
}
