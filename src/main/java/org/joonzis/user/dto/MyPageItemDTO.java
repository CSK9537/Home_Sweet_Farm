package org.joonzis.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data // Getter, Setter, toString 등 자동 생성 (Lombok 사용 시)
public class MyPageItemDTO {
    private String title;
    private String moveUrl;   // JS에서 링크로 사용할 URL
    private int viewCount;
    private int likeCount;
    private int replyCnt;
}