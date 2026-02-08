package org.joonzis.chatting.service;

import java.util.List;

import org.joonzis.chatting.vo.RoomVO;

public interface RoomService {
	public int getOrCreateRoom(int user1, int user2);
	public RoomVO findRoom(int roomId);
	public List<RoomVO> findRoomByUser(int userId);
	public void updateLastMessage(int roomId, Long msgId);
	public void markAsRead(int userId, int roomId);
}
