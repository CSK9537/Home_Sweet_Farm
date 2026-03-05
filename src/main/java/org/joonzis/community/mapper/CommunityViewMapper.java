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
}