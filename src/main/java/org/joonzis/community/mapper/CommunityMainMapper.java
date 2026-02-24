package org.joonzis.community.mapper;

import java.util.List;
import java.util.Map;

import org.joonzis.community.dto.CommunityPostCardDTO;

public interface CommunityMainMapper {

	List<CommunityPostCardDTO> selectPopularPosts(int limit);
    List<CommunityPostCardDTO> selectHotPosts(int limit);
    List<CommunityPostCardDTO> selectLatestPosts(int limit);
    List<CommunityPostCardDTO> selectQaPosts(int limit);

    // 전체보기용(최대 100)
    List<CommunityPostCardDTO> selectMorePosts(Map<String, Object> param);
}
