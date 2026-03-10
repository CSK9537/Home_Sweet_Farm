package org.joonzis.community.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.joonzis.community.vo.BoardFileVO;
import org.joonzis.community.vo.BoardVO;

public interface CommunityFormMapper {

  // ====== Board 기본 ======
  int selectBoardSeqNextVal();

  int insertBoard(BoardVO board);

  int updateBoard(BoardVO board);

  // edit 폼 진입 시 기존 게시글 로드
  BoardVO selectBoardById(@Param("boardId") int boardId);

  // 작성자 검증(수정 권한 체크)
  Integer selectBoardOwnerUserId(@Param("boardId") int boardId);

  // 게시글 삭제(소프트 삭제)
  int deactivateBoard(@Param("boardId") int boardId, @Param("loginUserId") int loginUserId);

  // 게시글 첨부파일 비활성화
  int deactivateFilesByBoardId(@Param("boardId") int boardId);

  // 게시글 댓글 비활성화
  int deactivateRepliesByBoardId(@Param("boardId") int boardId);

  // ====== File ======
  int insertBoardFile(BoardFileVO file);

  // ====== Hashtag Suggest ======
  List<String> selectHashtagSuggest(@Param("q") String q, @Param("limit") int limit);
}