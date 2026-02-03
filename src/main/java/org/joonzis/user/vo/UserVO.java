package org.joonzis.user.vo;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserVO {
  private int user_id, phone, enable, confirm_event, point, auth_id, grade_id, aspect;
  private String username,password, nickname, name, email, profile_filename;
  private Date brith_date, reg_date;
}
