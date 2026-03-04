package org.joonzis.community.mapper;

import java.util.List;
import java.util.Map;

import org.joonzis.community.dto.CommunityListDTO;

public interface CommunityListMapper {
  List<CommunityListDTO> selectCommunityList(Map<String, Object> param);
  int countCommunityList(Map<String, Object> param);
}