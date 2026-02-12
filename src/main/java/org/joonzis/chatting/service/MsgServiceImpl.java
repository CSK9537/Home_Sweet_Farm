package org.joonzis.chatting.service;

import java.util.List;

import org.joonzis.chatting.mapper.MsgMapper;
import org.joonzis.chatting.vo.MsgVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.log4j.Log4j;

@Log4j
@Service
@Transactional
public class MsgServiceImpl implements MsgService{

	@Autowired
    private MsgMapper msgMapper;

    // 1. 메세지 저장
    public void sendMessage(MsgVO msgVO) {
        msgMapper.insert(msgVO);
    }

    // 2. 채팅방 전체 메세지 조회
    @Transactional(readOnly = true)
    public List<MsgVO> findRoomId(int roomId) {
        return msgMapper.findByRoomId(roomId);
    }

    // 3. 마지막으로 읽은 메세지 이후 조회
    @Transactional(readOnly = true)
    public List<MsgVO> findAfterMsgId(int roomId, Long msgId) {
        return msgMapper.findAfterMsgId(roomId, msgId);
    }
    
  // 5. 특정 메세지 조회 
  public MsgVO findById(Long msgId) {
      return msgMapper.findById(msgId);
  }

//    // 4. 메세지 삭제
//    public void deleltMessage(Long msgId) {
//        // msgMapper.delete(msgId);
//    }


}
