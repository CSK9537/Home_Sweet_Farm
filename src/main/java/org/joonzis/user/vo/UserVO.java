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
  private int user_id, enable, confirm_event, point, auth_id, 
  grade_id, confirm_service, confirm_userinfo;
  private String username,password, nickname, name, email, profile_filename, address, phone, intro;
  @DateTimeFormat(pattern = "yyyy-MM-dd")
  private Date brith_date, reg_date;
  private String confirmPassword;//입력 확인비번(원문): DB 저장 안 함
}
