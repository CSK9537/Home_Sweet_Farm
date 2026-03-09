package org.joonzis.community.mapper;

import java.util.List;
import java.util.Map;

import org.joonzis.community.dto.CommunityPostCardDTO;

public interface CommunityListMapper {
    List<CommunityPostCardDTO> selectCommunityList(Map<String, Object> param);
    int countCommunityList(Map<String, Object> param);
}