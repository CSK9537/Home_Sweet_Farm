package org.joonzis.community.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.joonzis.community.dto.CommunityPostCardDTO;
import org.joonzis.community.mapper.CommunityMainMapper;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommunityMainServiceImpl implements CommunityMainService {

    private final CommunityMainMapper communityMainMapper;

@Override
    public Map<String, Object> dbCheck() {
    	// TODO Auto-generated method stub
    	return null;
    }
    
    @Override
    public Map<String, List<CommunityPostCardDTO>> getRails(int railLimit) {
        Map<String, List<CommunityPostCardDTO>> result = new HashMap<String, List<CommunityPostCardDTO>>();
        result.put("popularPosts", communityMainMapper.selectPopularPosts(railLimit));
        result.put("hotPosts",     communityMainMapper.selectHotPosts(railLimit));
        result.put("latestPosts",  communityMainMapper.selectLatestPosts(railLimit));
        return result;
    }

    @Override
    public List<CommunityPostCardDTO> getMore(String kind, int limit) {
        Map<String, Object> p = new HashMap<String, Object>();
        p.put("kind", kind);
        p.put("limit", limit);

        // Q&A 전체보기면 boardType 제한
        if ("qa".equals(kind)) {
            p.put("boardType", "QNA");
            // qa는 최신순이 자연스러우므로 kind는 latest처럼 처리해도 됨
            p.put("kind", "latest");
        }

        return communityMainMapper.selectMorePosts(p);
    }
}