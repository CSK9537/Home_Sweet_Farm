package org.joonzis.community.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.joonzis.community.dto.CommunityReplyDTO;
import org.joonzis.community.dto.CommunityViewDTO;
import org.joonzis.community.vo.BoardFileVO;
import org.joonzis.community.vo.CategoryVO;

@Mapper
public interface CommunityViewMapper {

	int increaseViewCount(@Param("board_id") int board_id);

	CommunityViewDTO selectBoard(@Param("board_id") int board_id);
	CategoryVO selectCategory(@Param("category_id") int category_id);
	List<BoardFileVO> selectFiles(@Param("board_id") int board_id);
	List<CommunityReplyDTO> selectRootReplies(@Param("board_id") int board_id);

	// 이전/다음글 : 현재 글과 같은 board_type만 조회
	CommunityViewDTO selectPrev(@Param("board_id") int board_id, @Param("board_type") String board_type);
	CommunityViewDTO selectNext(@Param("board_id") int board_id, @Param("board_type") String board_type);

	// 좋아요
	int countBoardLike(@Param("board_id") int board_id, @Param("user_id") int user_id);
	int insertBoardLike(@Param("board_id") int board_id, @Param("user_id") int user_id);
	int increaseLikeCount(@Param("board_id") int board_id);
	int selectLikeCount(@Param("board_id") int board_id);

	// 신고
	int insertReport(@Param("board_id") int board_id, @Param("user_id") int user_id, @Param("reason") String reason);
}