package org.joonzis.qna.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QnaPagingDTO {
    private int page;
    private int startPage;
    private int endPage;
    private int totalPage;
}