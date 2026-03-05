package org.joonzis.community.service;

import java.util.Map;

public interface CommunityListService {
  Map<String, Object> getList(String type, String q, int page, int size);
}