package org.joonzis.community.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.joonzis.community.vo.BoardFileVO;
import org.joonzis.community.vo.BoardVO;

public interface CommunityFormMapper {

  int selectBoardSeqNextVal();

  int insertBoard(BoardVO board);

  int updateBoard(BoardVO board);

  BoardVO selectBoardById(@Param("boardId") int boardId);

  Integer selectBoardOwnerUserId(@Param("boardId") int boardId);

  int deactivateBoard(@Param("boardId") int boardId, @Param("loginUserId") int loginUserId);

  int deactivateFilesByBoardId(@Param("boardId") int boardId);

  int deactivateRepliesByBoardId(@Param("boardId") int boardId);

  int insertBoardFile(BoardFileVO file);

  List<BoardFileVO> selectBoardFilesByBoardId(@Param("boardId") int boardId);

  int deactivateBoardFileById(@Param("boardId") int boardId, @Param("fileId") int fileId);

  int clearThumbnailByBoardId(@Param("boardId") int boardId);

  int setThumbnailByFileId(@Param("boardId") int boardId, @Param("fileId") int fileId);

  Integer selectThumbnailFileId(@Param("boardId") int boardId);

  Integer selectFirstActiveImageFileId(@Param("boardId") int boardId);

  List<String> selectHashtagSuggest(@Param("q") String q, @Param("limit") int limit);

  String selectBoardTagsCsv(@Param("boardId") int boardId);

  Integer selectBoardHashtagIdByName(@Param("tagName") String tagName);

  int insertBoardHashtag(@Param("tagName") String tagName);

  int deleteBoardAspectsByBoardId(@Param("boardId") int boardId);

  int insertBoardAspect(@Param("boardId") int boardId, @Param("boardHashtagId") int boardHashtagId);
}