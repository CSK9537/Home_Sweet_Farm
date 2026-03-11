package org.joonzis.community.service;

import java.util.List;

import org.joonzis.community.dto.ReplyDTO;
import org.joonzis.community.mapper.ReplyMapper;
import org.joonzis.community.vo.ReplyVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.log4j.Log4j;

@Service
@Log4j
public class ReplyServiceImpl implements ReplyService {

    @Autowired
    private ReplyMapper replyMapper;

    @Transactional
    @Override
    public int register(ReplyVO vo) {
        // 1. 댓글 등록
        int result = replyMapper.insertReply(vo);
        
        // 2. 해당 게시글의 댓글 수 동기화 (전달받은 vo의 board_id 활용)
        if (result == 1) {
            replyMapper.syncReplyCount(vo.getBoard_id());
        }
        return result;
    }

    @Override
    public List<ReplyDTO> getChildList(int parent_reply_id) {
        return replyMapper.selectChildReplies(parent_reply_id);
    }

    @Override
    public int remove(int reply_id, int user_id) {
        return replyMapper.deleteReply(reply_id, user_id);
    }
}