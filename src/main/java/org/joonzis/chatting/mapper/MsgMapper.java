package org.joonzis.chatting.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.joonzis.chatting.dto.RoomSearchResultDTO;
import org.joonzis.chatting.vo.MsgVO;

public interface MsgMapper {
	// 메세지 데이터 삽입
	int insert(MsgVO vo);
	
	// 채팅방 id에 있는 메세지 전체 조회
	List<MsgVO> findByRoomId(@Param("room_id") int room_id);
	
	// 특정 메세지 이후의 메세지 조회(마지막으로 읽은 메세지 이후의 메세지 화면에 표시하려는 의도)
	List<MsgVO> findAfterMsgId(@Param("room_id")int room_id,@Param("last_read_msg_id") Long last_read_msg_id);
	
	// 특정 채팅방의 마지막 메세지 조회
	Long findLastMsgIdByRoom(int room_id);
	
	// 특정 메세지를 아이디로 조회
	MsgVO findById(@Param("msg_id") Long msg_id);

	// 메세지로 채팅방 조회
	List<RoomSearchResultDTO> searchByMessage(Map<String, Object> params);

	void deleteAll();
}

