package org.joonzis.community.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UploadResponseDTO {
    private String url;       // 브라우저에서 접근 가능한 URL
    private String savedName; // 저장 파일명
    private String subDir;    // 예: 자유게시판/20260224
}