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
import lombok.extern.log4j.Log4j;

@Service
@RequiredArgsConstructor
@Log4j
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
	public BoardFileVO getFile(int file_id) {
		return mapper.selectFileById(file_id);
	}

	@Override
	public List<CommunityReplyDTO> getRootReplies(int board_id) {
		return mapper.selectRootReplies(board_id);
	}

	@Override
	public Map<String, Object> getPrevNext(int board_id) {
		Map<String, Object> res = new HashMap<>();

		CommunityViewDTO currentBoard = mapper.selectBoard(board_id);

		if (currentBoard == null || currentBoard.getBoard_type() == null) {
			res.put("prev", null);
			res.put("next", null);
			return res;
		}

		String boardType = currentBoard.getBoard_type();

		res.put("prev", mapper.selectPrev(board_id, boardType));
		res.put("next", mapper.selectNext(board_id, boardType));

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
			mapper.insertBoardLike(board_id, user_id);
			mapper.increaseLikeCount(board_id);

			int like_cnt = mapper.selectLikeCount(board_id);

			res.put("ok", true);
			res.put("already", false);
			res.put("like_cnt", like_cnt);
			return res;

		} catch (DuplicateKeyException e) {
			int like_cnt = mapper.selectLikeCount(board_id);

			res.put("ok", true);
			res.put("already", true);
			res.put("like_cnt", like_cnt);
			return res;

		} catch (Exception e) {
			log.error("좋아요 처리 실패 - board_id=" + board_id + ", user_id=" + user_id, e);
			throw e;
		}
	}

	@Override
	@Transactional
	public void report(int board_id, int user_id, String reason) {
		mapper.insertReport(board_id, user_id, reason);
	}
}