package org.joonzis.qna.mapper;

import java.util.List;
import java.util.Map;
import org.joonzis.qna.dto.QnaListDTO;
import org.joonzis.qna.dto.TagTopListDTO;

public interface QnaListMapper {
    // Q&A 목록 조회 (정렬, 필터, 페이징 포함)
    List<QnaListDTO> selectQnaTopList(Map<String, Object> param);
    
    // 전체 게시글 수 조회 (필터 포함)
    int getCountQnaList(Map<String, Object> param);
    
    // 상위 태그 목록 조회
    List<TagTopListDTO> selectQnaTagTopList();
}
