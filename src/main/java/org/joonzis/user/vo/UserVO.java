package org.joonzis.user.vo;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserVO {
  private int user_id, phone, enable, confirm_event, point, auth_id, 
  grade_id, aspect, confirm_service, confirm_userinfo;
  private String username,password, nickname, name, email, profile_filename, intro;
  private Date brith_date, reg_date;
  private String confirmPassword;//입력 확인비번(원문): DB 저장 안 함
}
