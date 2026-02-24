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
	private String userId;
	private String thumbSrc;    // 썸네일 URL (없으면 프론트에서 DEFAULT_POST_IMG 처리 가능)
	private int viewCount;
	private int likeCount;
	private int replyCount;
	private String hashtags;    // "태그1,태그2" 처럼 합쳐진 문자열
	private String moveUrl;     // 컨트롤러에서 contextPath 붙여 완성
}
