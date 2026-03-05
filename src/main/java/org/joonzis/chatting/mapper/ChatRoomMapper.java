package org.joonzis.chatting.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.joonzis.chatting.dto.ChatRoomDTO;
import org.joonzis.chatting.vo.MsgVO;

public interface ChatRoomMapper {
	List<ChatRoomDTO> findUserChatRooms(@Param("user_id")int user_id);
	int selectOtherUserId(@Param("room_id") int room_id, @Param("sender_id") int sender_id);
	long findMaxGroupId(@Param("room_id") int room_id);
	List<MsgVO> selectMessagesWithPaging(@Param("room_id")int room_id, @Param("user_id")int user_id, @Param("size")int size,@Param("offset") int offset);
}
