package org.joonzis.user.service;

import java.util.List;
import java.util.Map;

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
}