package org.joonzis.community.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.joonzis.community.dto.CommunityReplyDTO;
import org.joonzis.community.dto.CommunityViewDTO;
import org.joonzis.community.mapper.CommunityViewMapper;
import org.joonzis.community.vo.BoardFileVO;
import org.joonzis.community.vo.CategoryVO;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommunityViewServiceImpl implements CommunityViewService {

	private final CommunityViewMapper mapper;

	@Override
	@Transactional
	public void increaseViewCount(int board_id) {
		mapper.increaseViewCount(board_id);
	}

	@Override
	public CommunityViewDTO getBoard(int board_id) {
		return mapper.selectBoard(board_id);
	}

	@Override
	public CategoryVO getCategory(Integer category_id) {
		if (category_id == null) return null;
		return mapper.selectCategory(category_id);
	}

	@Override
	public List<BoardFileVO> getFiles(int board_id) {
		return mapper.selectFiles(board_id);
	}

	@Override
	public List<CommunityReplyDTO> getRootReplies(int board_id) {
		return mapper.selectRootReplies(board_id);
	}

	@Override
	public Map<String, Object> getPrevNext(int board_id) {
		Map<String, Object> res = new HashMap<>();
		res.put("prev", mapper.selectPrev(board_id));
		res.put("next", mapper.selectNext(board_id));
		return res;
	}

	@Override
	public boolean isLiked(int board_id, int user_id) {
		return mapper.countBoardLike(board_id, user_id) > 0;
	}

	@Override
	@Transactional
	public Map<String, Object> likeOnce(int board_id, int user_id) {
		Map<String, Object> res = new HashMap<>();
		try {
			// 1) 좋아요 기록 insert (UK로 1회 제한)
			mapper.insertBoardLike(board_id, user_id);

			// 2) 게시글 like_cnt 증가
			mapper.increaseLikeCount(board_id);

			int like_cnt = mapper.selectLikeCount(board_id);

			res.put("ok", true);
			res.put("already", false);
			res.put("like_cnt", like_cnt);
			return res;

		} catch (DuplicateKeyException e) {
			// 이미 좋아요 한 상태
			int like_cnt = mapper.selectLikeCount(board_id);

			res.put("ok", true);
			res.put("already", true);
			res.put("like_cnt", like_cnt);
			return res;
		}
	}

	@Override
	@Transactional
	public void report(int board_id, int user_id, String reason) {
		mapper.insertReport(board_id, user_id, reason);
	}
}