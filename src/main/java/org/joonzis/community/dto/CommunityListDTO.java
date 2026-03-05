package org.joonzis.community.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommunityListDTO {
  private int id;

  private String img;     // 썸네일 URL (없으면 null)
  private String status;  // MARKET: sell|share|done, FREE: null

  private String title;
  private Integer price;

  private String writer;
  private String regDate;    // yyyy-MM-dd

  private int views;
  private int likes;
  private int comments;

  private String boardContent; // 미리보기 텍스트(HTML 제거/짧게)
  
  private String boardType;
  private String tradeStatus;
  private String thumbSavedName;
}