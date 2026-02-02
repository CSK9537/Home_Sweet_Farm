package org.joonzis.user.vo;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserVO {
  private int USER_ID, PHONE, ENABLE, CONFIRM_EVENT, POINT, AUTH_ID, GRADE_ID, ASPECT;
  private String USERNAME,PASSWORD, NICKNAME, NAME, EMAIL, PROFILE_FILENAME;
  private Date BRITH_DATE, REG_DATE;
}
