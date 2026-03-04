package org.joonzis.community.service;

import java.util.List;

import org.joonzis.community.dto.CommunityReplyDTO;
import org.joonzis.community.dto.CommunityViewDTO;
import org.joonzis.community.vo.BoardFileVO;
import org.joonzis.community.vo.CategoryVO;

public interface CommunityViewService {
	void increaseViewCount(int boardId);

	CommunityViewDTO getBoard(int boardId);

	CategoryVO getCategory(Integer categoryId);

	List<BoardFileVO> getFiles(int boardId);
	
	List<CommunityReplyDTO> getRootReplies(int boardId);
}
