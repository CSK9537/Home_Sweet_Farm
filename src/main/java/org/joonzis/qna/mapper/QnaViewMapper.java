package org.joonzis.qna.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.joonzis.qna.dto.QnaAnswerDTO;
import org.joonzis.qna.dto.QnaQuestionDTO;
import org.joonzis.qna.dto.QnaReplyDTO;

@Mapper
public interface QnaViewMapper {
    QnaQuestionDTO selectQuestion(@Param("board_id") int board_id);
    List<QnaAnswerDTO> selectAnswers(@Param("board_id") int board_id);
    List<QnaReplyDTO> selectReplies(@Param("board_id") int board_id);
    int insertAnswer(@Param("uid") int uid, @Param("title") String title, @Param("content") String content, @Param("parentId") int parentId);
    int deactivateAnswerByBoardId(int boardId);
}
