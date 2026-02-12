package org.joonzis.chatting.service;

import java.util.List;

import org.joonzis.chatting.dto.ChatRoomDTO;
import org.joonzis.chatting.dto.RoomSearchResultDTO;
import org.joonzis.chatting.vo.MsgVO;
import org.joonzis.chatting.vo.RoomVO;

public interface ChatService {
	public MsgVO sendMessage(int sender_id, int receiver_id, MsgVO msgVO);
	public List<MsgVO> getMessages(int user_id, int room_id);
	public List<ChatRoomDTO> getUserRooms(int user_id);
	public void readMessage(int user_id, int room_id);
	public int createRoom(int user1_id, int user2_id);
	public Long getFirstUnreadMsgId(int user_id, int room_id);
	public List<RoomSearchResultDTO> searchRooms(int user_id, String keyword, String type);
}
