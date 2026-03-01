package org.joonzis.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserDTO {
	//1)기본 정보
	private int user_id, grade_id;
	private String nickname, profile_filename;
	
	//2)소개
	private String intro;
	//3)활동내역, 주요활동분야(추후 추가 예정)
	//4)통계(전체답변, 조회수, 채택 답변수)
	private int reply_cnt, view_cnt, is_selected;
	//5)Q&A등급은 미정
}
