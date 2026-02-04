package org.joonzis.user.dto;


import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserDTO {
	//기본 정보
	private int user_id, grade_id;
	private String nickname, profile_filename;
	
	//소개
	private String intro;
	//활동내역, 주요활동분야(추후 추가 예정)
	//통계
	private int reply_cnt, view_cnt;//채택 답변도 추가 예정
	//Q&A등급은 미정
}
