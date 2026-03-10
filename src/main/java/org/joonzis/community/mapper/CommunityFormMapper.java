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

  BoardVO selectBoardById(@Param("boardId") int boardId);

  Integer selectBoardOwnerUserId(@Param("boardId") int boardId);

  int deactivateBoard(@Param("boardId") int boardId, @Param("loginUserId") int loginUserId);

  int deactivateFilesByBoardId(@Param("boardId") int boardId);

  int deactivateRepliesByBoardId(@Param("boardId") int boardId);

  // ====== File ======
  int insertBoardFile(BoardFileVO file);

  // ====== Hashtag Suggest ======
  List<String> selectHashtagSuggest(@Param("q") String q, @Param("limit") int limit);

  // ====== Board Hashtag 저장 ======
  String selectBoardTagsCsv(@Param("boardId") int boardId);

  Integer selectBoardHashtagIdByName(@Param("tagName") String tagName);

  int insertBoardHashtag(@Param("tagName") String tagName);

  int deleteBoardAspectsByBoardId(@Param("boardId") int boardId);

  int insertBoardAspect(@Param("boardId") int boardId, @Param("boardHashtagId") int boardHashtagId);
}