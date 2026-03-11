package org.joonzis.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class MyPageReplyDTO {
    private String content;
    private String reg_date; // JS에서 기대하는 변수명 (혹은 regDate로 통일 후 JS 수정)
}