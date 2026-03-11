package org.joonzis.community.service;

import java.util.List;

import org.joonzis.community.dto.UploadResponseDTO;
import org.joonzis.community.vo.BoardFileVO;
import org.joonzis.community.vo.BoardVO;
import org.springframework.web.multipart.MultipartFile;

public interface CommunityFormService {

    UploadResponseDTO uploadTempFile(MultipartFile file,
                                     String tempKey,
                                     String boardType,
                                     String purpose);

    int write(BoardVO board,
              int loginUserId,
              String tempKey,
              MultipartFile[] attachFiles,
              String tagsCsv,
              String uploadedAttachFilesJson,
              String thumbnailTarget);

    int edit(BoardVO board,
             int loginUserId,
             String tempKey,
             MultipartFile[] attachFiles,
             String tagsCsv,
             String uploadedAttachFilesJson,
             String existingDeletedFileIds,
             String thumbnailTarget);

    List<String> suggestHashtags(String q, int limit);

    BoardVO getBoardById(int boardId);

    List<BoardFileVO> getBoardFiles(int boardId);

    String getBoardTagsCsv(int boardId);

    boolean isOwner(int boardId, int loginUserId);

    boolean deleteBoard(int boardId, int loginUserId);
}