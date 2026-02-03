package org.joonzis.chatting.mapper;

import org.apache.ibatis.annotations.Param;
import org.joonzis.chatting.vo.ChatRoomUserVO;

public interface ChatRoomUserMapper {
	// 채팅방 유저 삽입
	int insert(ChatRoomUserVO vo);
	
	// 마지막으로 읽은 메세지 id 업데이트
	Long updateLastReadMsgId(@Param("user_id") int user_id, @Param("room_id") int room_id, @Param("msg_id") Long msg_id);
	
	// 마지막으로 읽은 메세지 id 조회
	Long findLastReadMsgId(@Param("user_id") int user_id, @Param("room_id") int room_id);
	
	// 읽지 않은 메세지 수 세기
	int countUnread(@Param("user_id") int user_id,@Param("room_id") int room_id);
	
	
	
	
	
	
	
	void deleteAll();
}
