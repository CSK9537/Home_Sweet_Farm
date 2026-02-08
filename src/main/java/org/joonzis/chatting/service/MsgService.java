package org.joonzis.chatting.service;

import java.util.List;

import org.joonzis.chatting.vo.MsgVO;

public interface MsgService {
	public void sendMessage(MsgVO msgVO);
	public List<MsgVO> findRoomId(int roomId);
	public List<MsgVO> findAfterMsgId(int roomId, Long msgId);
//	public void deleltMessage(Long msgId);
//	public MsgVO findMessage(Long msgId);
}
