package org.joonzis.chatting.service;

import java.util.List;

import org.joonzis.chatting.vo.MsgVO;

public interface MsgService {
	public MsgVO sendMessage(MsgVO msgVO);
	public List<MsgVO> findRoomId(int roomId);
	public List<MsgVO> findAfterMsgId(int roomId, Long msgId);
	public MsgVO findById(Long msgId);
//	public void deleltMessage(Long msgId);
}
