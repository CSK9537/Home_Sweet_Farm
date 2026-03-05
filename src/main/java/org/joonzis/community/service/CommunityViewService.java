package org.joonzis.community.service;

import java.util.List;

import org.joonzis.community.dto.CommunityReplyDTO;
import org.joonzis.community.dto.CommunityViewDTO;
import org.joonzis.community.vo.BoardFileVO;
import org.joonzis.community.vo.CategoryVO;

public interface CommunityViewService {

	void increaseViewCount(int board_id);

	CommunityViewDTO getBoard(int board_id);

	CategoryVO getCategory(Integer category_id);

	List<BoardFileVO> getFiles(int board_id);

	List<CommunityReplyDTO> getRootReplies(int board_id);
}