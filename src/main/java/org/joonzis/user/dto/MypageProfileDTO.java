package org.joonzis.user.dto;

import lombok.Data;

import java.sql.Date;
import java.util.List;

import org.joonzis.community.dto.CommunityPostCardDTO;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class MypageProfileDTO {
	private int user_id;
	private String profile;		// 프로필 사진명 (컬럼명은 profile_filename)
	private String nickname;	// 사용자 닉네임
	private String gradeName;	// 등급명
	private String name;		// 사용자의 실명
	private Date brith_date;	// 생일
	private String intro;		// 자기소개
	private List<String> aspect;// 관심사들
	private String phone;		// 핸드폰 번호
	private String email;		// 이메일 주소
	private String address;		//주소
	
	private Integer totalAnswers;// 총 답변 수
	private Integer totalViews;	// 총 조회수
	private Integer acceptedAnswers;// 채택된 답변 수
	
	private List<CommunityPostCardDTO> posts; // 최신 게시글
	private List<CommunityPostCardDTO> quests; // 최신 질문글
}