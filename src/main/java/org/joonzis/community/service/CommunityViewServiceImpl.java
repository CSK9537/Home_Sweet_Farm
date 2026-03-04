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
public class CommunityViewServiceImpl implements CommunityViewService{
	private final CommunityViewMapper communityViewMapper;

	@Override
	@Transactional
	public void increaseViewCount(int boardId) {
	    communityViewMapper.increaseViewCount(boardId);
	}

	@Override
	public CommunityViewDTO getBoard(int boardId) {
	  return communityViewMapper.selectBoard(boardId);
	}

	@Override
	public CategoryVO getCategory(Integer categoryId) {
	   if (categoryId == null) return null;
	   return communityViewMapper.selectCategory(categoryId);
	}

	@Override
	public List<BoardFileVO> getFiles(int boardId) {
	   List<BoardFileVO> list = communityViewMapper.selectFiles(boardId);
	   return list == null ? Collections.emptyList() : list;
	}

	@Override
	public List<CommunityReplyDTO> getRootReplies(int boardId) {
	   List<CommunityReplyDTO> list = communityViewMapper.selectRootReplies(boardId);
	   return list == null ? Collections.emptyList() : list;
	}
}
