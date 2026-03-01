package org.joonzis.user.vo;

import java.sql.Date;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserVO {
	private int user_id;
	private String username;
	private String password;
	private String nickname;
	private String name;
	private String email;
	private String profile_filename;
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date brith_date;
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date reg_date;
	private int enable;
	private int confirm_event;
	private int point;
	private int auth_id;
	private int grade_id;
	private String intro;
	private int confirm_service;
	private int confirm_userinfo;
	private String address;
	private String phone;
	
	private String confirmPassword;//입력 확인비번(원문): DB 저장 안 함
}
