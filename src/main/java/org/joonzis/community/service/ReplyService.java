package org.joonzis.community.service;

import java.util.List;

import org.joonzis.community.dto.ReplyDTO;
import org.joonzis.community.vo.ReplyVO;

public interface ReplyService {
    int register(ReplyVO vo);
    List<ReplyDTO> getChildList(int parent_reply_id); // 컨트롤러 호출용
    int remove(int reply_id, int user_id);
}
