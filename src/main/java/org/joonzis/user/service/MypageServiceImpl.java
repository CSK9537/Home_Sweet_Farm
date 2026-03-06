package org.joonzis.user.service;

import java.util.List;
import java.util.Map;

import org.joonzis.community.dto.CommunityPostCardDTO;
import org.joonzis.community.vo.ReplyVO;
import org.joonzis.user.mapper.MypageMapper;
import org.joonzis.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.log4j.Log4j;

@Log4j
@Service
public class MypageServiceImpl implements MypageService{
	
	@Override
	public List<CommunityPostCardDTO> selectMyPosts(int user_id) {
		return mpMapper.selectMyPosts(user_id);
	}
	
	@Override
	public List<ReplyVO> selectMyReply(int user_id) {
		return mpMapper.selectMyReply(user_id);
	}
	
	@Autowired
	private MypageMapper mpMapper;
	
	@Override
		public int updateMypage(UserVO vo) {
			return mpMapper.updateMypage(vo);
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
	public void updateProfile(int userId, String profile_filename) {
		mpMapper.updateProfile(userId,profile_filename);
	}
	
	@Override
	public int updateIntro(UserVO vo) {
		return mpMapper.updateIntro(vo);
	}
	
}