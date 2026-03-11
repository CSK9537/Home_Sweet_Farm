package org.joonzis.community.service;

import java.util.List;
import java.util.Map;

import org.joonzis.community.dto.CommunityReplyDTO;
import org.joonzis.community.dto.CommunityViewDTO;
import org.joonzis.community.vo.BoardFileVO;
import org.joonzis.community.vo.CategoryVO;

public interface CommunityViewService {
	void increaseViewCount(int board_id);

	CommunityViewDTO getBoard(int board_id);
	CategoryVO getCategory(Integer category_id);
	List<BoardFileVO> getFiles(int board_id);
	BoardFileVO getFile(int file_id);
	List<CommunityReplyDTO> getRootReplies(int board_id);

	Map<String, Object> getPrevNext(int board_id);

	boolean isLiked(int board_id, int user_id);
	Map<String, Object> likeOnce(int board_id, int user_id);

	void report(int board_id, int user_id, String reason);
}