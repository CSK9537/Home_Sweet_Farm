package org.joonzis.qna.service;

import java.util.List;
import org.joonzis.community.service.CommunityViewService;
import org.joonzis.qna.dto.QnaAnswerDTO;
import org.joonzis.qna.dto.QnaQuestionDTO;
import org.joonzis.qna.dto.QnaReplyDTO;
import org.joonzis.qna.dto.QnaViewDTO;
import org.joonzis.qna.mapper.QnaViewMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QnaViewServiceImpl implements QnaViewService {

    private final QnaViewMapper qnaViewMapper;
    private final CommunityViewService communityViewService;

    @Override
    @Transactional
    public QnaViewDTO getQnaView(int board_id) {
        // 1. 조회수 증가 (기능은 유지하므로 CommunityViewService 활용)
        communityViewService.increaseViewCount(board_id);

        // 2. 질문 본문 가져오기 (전용 매퍼 활용)
        QnaQuestionDTO board = qnaViewMapper.selectQuestion(board_id);
        if (board == null) return null;

        // 3. 답변 리스트 가져오기
        List<QnaAnswerDTO> answerList = qnaViewMapper.selectAnswers(board_id);

        // 4. 질문글의 댓글(의견) 가져오기 (전용 매퍼 활용)
        List<QnaReplyDTO> replyList = qnaViewMapper.selectReplies(board_id);

        return new QnaViewDTO(board, answerList, replyList);
    }

    @Override
    @Transactional
    public int registerAnswer(int uid, String title, String content, int parentId) {
        return qnaViewMapper.insertAnswer(uid, title, content, parentId);
    }
}
