package org.joonzis.community.service;

import java.util.List;

import org.joonzis.community.dto.UploadResponseDTO;
import org.joonzis.community.vo.BoardVO;
import org.springframework.web.multipart.MultipartFile;

public interface CommunityFormService {

	// 선업로드
    UploadResponseDTO uploadTempFile(MultipartFile file,
                                     String tempKey,
                                     String boardType);

    // 글 등록 (모든 처리 포함)
    int write(BoardVO board,
              int loginUserId,
              String tempKey,
              MultipartFile[] attachFiles,
              String tagsCsv);

    // 글 수정
    int edit(BoardVO board,
             int loginUserId,
             String tempKey,
             MultipartFile[] attachFiles,
             String tagsCsv);

    // 해시태그 추천
    List<String> suggestHashtags(String q, int limit);
    
    // 수정 폼 진입 시 기존 게시글 로드용
    BoardVO getBoardById(int boardId);

    // 수정 권한 체크용
    boolean isOwner(int boardId, int loginUserId);
}