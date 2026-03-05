package org.joonzis.qna.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class TagTopListDTO {
	// QnaList.jsp 에서 사용
	private String tagName;	// 태그 이름
	private int tagCount;	// 해당 태그 글 수
}
