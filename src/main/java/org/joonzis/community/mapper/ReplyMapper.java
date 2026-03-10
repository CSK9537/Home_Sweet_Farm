package org.joonzis.community.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Param;
import org.joonzis.community.vo.ReplyVO;
import org.joonzis.community.dto.CommunityReplyDTO;
import org.joonzis.community.dto.ReplyDTO;

public interface ReplyMapper {

    public int insertReply(ReplyVO vo);
    public int updateReply(ReplyVO vo);
    public int deleteReply(@Param("reply_id") int reply_id, @Param("user_id") int user_id);
    public int syncReplyCount(int board_id);
    public int updateLikeCount(@Param("reply_id") int reply_id, @Param("amount") int amount);
    public List<ReplyDTO> selectChildReplies(@Param("parent_reply_id") int parent_reply_id);

}