package org.joonzis.user.service;

import java.util.List;
import java.util.Map;

import org.joonzis.community.dto.CommunityPostCardDTO;
import org.joonzis.community.vo.ReplyVO;
import org.joonzis.user.dto.MyPageItemDTO;
import org.joonzis.user.dto.MyPageReplyDTO;
import org.joonzis.user.mapper.MypageMapper;
import org.joonzis.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.log4j.Log4j;

@Log4j
@Service
public class MypageServiceImpl implements MypageService{
	
	@Autowired
	private MypageMapper mpMapper;
	
	@Override
    public int getMyPostsCount(String userId, String tab) {
        return mpMapper.countMyPosts(userId, tab);
    }

    @Override
    public List<MyPageItemDTO> getMyPosts(String userId, String tab, int page, int pageSize) {
        int offset = (page - 1) * pageSize;
        return mpMapper.selectMyPosts(userId, tab, offset, pageSize);
    }

    @Override
    public int getMyQuestionsCount(String userId, String tab) {
        return mpMapper.countMyQuestions(userId, tab);
    }

    @Override
    public List<MyPageItemDTO> getMyQuestions(String userId, String tab, int page, int pageSize) {
        int offset = (page - 1) * pageSize;
        return mpMapper.selectMyQuestions(userId, tab, offset, pageSize);
    }
	
	@Override
	public int getMyAnswersCount(String userId, String tab) {
		return mpMapper.countMyAnswers(userId, tab);
	}
	
	@Override
	public List<MyPageItemDTO> getMyAnswers(String userId, String tab, int page, int pageSize) {
		int offset = (page - 1) * pageSize;
		return mpMapper.selectMyAnswers(userId, tab, offset, pageSize);
	}
	
	@Override
	public int getMyReplysCount(String userId, String tab) {
		return mpMapper.countMyReplys(userId, tab);
	}
	
	@Override
	public List<MyPageReplyDTO> getMyReplys(String userId, String tab, int page, int pageSize) {
		int offset = (page - 1) * pageSize;
		return mpMapper.selectMyReplys(userId, tab, offset, pageSize);
	}
	
	
	@Override
	public boolean updateMypage(UserVO vo) {
		return mpMapper.updateMypage(vo) > 0;
	}
	@Override
	public List<Map<String, Object>> searchHashtag(String keyword) {
		if(keyword == null) keyword = "";
		keyword = keyword.trim();
		return mpMapper.searchHashtag(keyword);
	}
	@Override
	public int insertUserAspect(int userId, int hashtagId) {
		return mpMapper.insertUserAspect(userId,hashtagId);
	}
	
	@Override
	public String getProfile(int user_id) {
		return mpMapper.getProfile(user_id);
	}
	
	@Override
	public boolean updateProfile(int user_id, String profile_filename) {
		return mpMapper.updateProfile(user_id, profile_filename) > 0;
	}
	
	@Override
	public int updateIntro(UserVO vo) {
		return mpMapper.updateIntro(vo);
	}
	
}