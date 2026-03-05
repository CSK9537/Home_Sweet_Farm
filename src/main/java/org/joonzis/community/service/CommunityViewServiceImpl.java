package org.joonzis.community.service;

import java.util.Collections;
import java.util.List;

import org.joonzis.community.dto.CommunityReplyDTO;
import org.joonzis.community.dto.CommunityViewDTO;
import org.joonzis.community.mapper.CommunityViewMapper;
import org.joonzis.community.vo.BoardFileVO;
import org.joonzis.community.vo.CategoryVO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommunityViewServiceImpl implements CommunityViewService {

	private final CommunityViewMapper communityViewMapper;

	@Override
	@Transactional
	public void increaseViewCount(int board_id) {
		communityViewMapper.increaseViewCount(board_id);
	}

	@Override
	public CommunityViewDTO getBoard(int board_id) {
		return communityViewMapper.selectBoard(board_id);
	}

	@Override
	public CategoryVO getCategory(Integer category_id) {
		if (category_id == null) return null;
		return communityViewMapper.selectCategory(category_id);
	}

	@Override
	public List<BoardFileVO> getFiles(int board_id) {
		List<BoardFileVO> list = communityViewMapper.selectFiles(board_id);
		return (list == null) ? Collections.emptyList() : list;
	}

	@Override
	public List<CommunityReplyDTO> getRootReplies(int board_id) {
		List<CommunityReplyDTO> list = communityViewMapper.selectRootReplies(board_id);
		return (list == null) ? Collections.emptyList() : list;
	}
}