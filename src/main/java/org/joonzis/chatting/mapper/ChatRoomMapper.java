package org.joonzis.chatting.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.joonzis.chatting.dto.ChatRoomDTO;

public interface ChatRoomMapper {
	List<ChatRoomDTO> findUserChatRooms(@Param("user_id")int user_id);
}
