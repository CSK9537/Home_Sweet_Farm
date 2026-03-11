package org.joonzis.qna.dto;

import java.sql.Date;
import lombok.Data;

@Data
public class QnaQuestionDTO {
    private int board_id, user_id, view_cnt, like_cnt, reply_cnt;
    private Integer category_id;
    private String board_type, title, content, writer, writer_profile;
    private Date reg_date, update_date;
    private String is_selected;
}
