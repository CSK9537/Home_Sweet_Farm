package org.joonzis.community.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.joonzis.community.vo.BoardFileVO;
import org.joonzis.community.vo.BoardVO;

@Mapper
public interface CommunityFormMapper {

    // ===== Board =====
    int insertBoard(BoardVO vo);
    int updateBoard(BoardVO vo);

    BoardVO selectBoardById(@Param("board_id") int board_id);

    // 권한 체크(작성자)
    Integer selectBoardOwnerUserId(@Param("board_id") int board_id);

    // ===== File (선업로드/첨부) =====
    int insertBoardFile(BoardFileVO vo);

    // temp_key로 선업로드 파일들 조회
    List<BoardFileVO> selectFilesByTempKey(@Param("temp_key") String temp_key);

    // 글 등록 시: temp_key 묶음 파일들 board_id로 연결
    int attachTempFilesToBoard(@Param("temp_key") String temp_key, @Param("board_id") int board_id);

    // 글 수정 시: 필요하면 기존 파일 비활성 처리(정책에 따라)
    int deactivateFilesByBoardId(@Param("board_id") int board_id);

    // ===== Hashtag Suggest =====
    List<String> selectHashtagSuggest(@Param("q") String q, @Param("limit") int limit);
}