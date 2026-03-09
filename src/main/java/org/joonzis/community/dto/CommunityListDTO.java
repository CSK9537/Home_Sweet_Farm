package org.joonzis.community.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommunityListDTO {
  private int id;

  private String img;
  private String status;

  private String title;
  private Integer price;

  private String writer;
  private String regDate;

  private int views;
  private int likes;
  private int comments;

  private String boardContent;
  
  private String boardType;
  private String tradeStatus;
  private String thumbSavedName;
  private String thumbSubDir;
}