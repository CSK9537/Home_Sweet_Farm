package org.joonzis.chatting.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.joonzis.chatting.vo.RoomVO;

public interface RoomMapper {
	// 두 유저가 있는 채팅방 찾기(중복 방지)
	Integer findRoomId(@Param("user1_id") int user1_id,@Param("user2_id") int user2_id);
	
	// 채팅방 insert
	int insert(RoomVO room);
	
	// 채팅방 상세 조회
	RoomVO findById(int room_id);
	
	// 채팅 목록 화면(내가 속한 모든 채팅방)
	List<RoomVO> findByUserId(@Param("user_id") int user_id);
	
	
	
	
	
	
	
	
	
	
	
	
	void deleteAll();
}
