package org.joonzis.community.service;

import java.util.List;
import java.util.Map;

import org.joonzis.community.dto.CommunityPostCardDTO;

public interface CommunityMainService {
	Map<String, Object> dbCheck();
    Map<String, List<CommunityPostCardDTO>> getRails(int railLimit);
    List<CommunityPostCardDTO> getMore(String kind, int limit);
}