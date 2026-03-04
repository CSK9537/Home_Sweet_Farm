package org.joonzis.community.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.joonzis.community.dto.CommunityReplyDTO;
import org.joonzis.community.dto.CommunityViewDTO;
import org.joonzis.community.vo.BoardFileVO;
import org.joonzis.community.vo.CategoryVO;

@Mapper
public interface CommunityViewMapper {
	int increaseViewCount(int boardId);

	CommunityViewDTO selectBoard(int boardId);

	CategoryVO selectCategory(int categoryId);

	List<BoardFileVO> selectFiles(int boardId);

	List<CommunityReplyDTO> selectRootReplies(int boardId);
}
