package org.joonzis.chatting.service;

import java.time.LocalDateTime;
import java.util.List;

import org.joonzis.chatting.dto.RoomCreateDTO;
import org.joonzis.chatting.mapper.ChatRoomUserMapper;
import org.joonzis.chatting.mapper.MsgMapper;
import org.joonzis.chatting.mapper.RoomMapper;
import org.joonzis.chatting.vo.ChatRoomUserVO;
import org.joonzis.chatting.vo.RoomVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.log4j.Log4j;

@Log4j
@Service
public class RoomServiceImpl implements RoomService{

	@Autowired
    private RoomMapper roomMapper;
	@Autowired
    private ChatRoomUserMapper chatRoomUserMapper;
	@Autowired
	private MsgMapper msgMapper;

    // 1. 채팅방 조회 or 생성
    @Transactional
    public int getOrCreateRoom(int user1_id, int user2_id) {
    	Integer room_id = roomMapper.findRoomId(user1_id, user2_id);
		if (room_id != null) {
			return room_id;
		}
		

	    RoomCreateDTO dto = new RoomCreateDTO(user1_id, user2_id);

	    RoomVO room = new RoomVO();   // ❗ 생성자 안 만듦
	    room.setUser1_id(dto.getUser1_id());
	    room.setUser2_id(dto.getUser2_id());

	    roomMapper.insert(room);
	   
	    
	    ChatRoomUserVO cru1 = new ChatRoomUserVO();
	    cru1.setRoom_id(room.getRoom_id());
	    cru1.setUser_id(user1_id);

	    ChatRoomUserVO cru2 = new ChatRoomUserVO();
	    cru2.setRoom_id(room.getRoom_id());
	    cru2.setUser_id(user2_id);

	    chatRoomUserMapper.insert(cru1);
	    chatRoomUserMapper.insert(cru2);

	    return room.getRoom_id();
    }
    
    
    

    // 2. 채팅방 단건 조회
    public RoomVO findRoom(int room_id) {
        return roomMapper.findById(room_id);
    }

    // 3. 유저가 속한 채팅방 조회
    public List<RoomVO> findRoomByUser(int user_id) {
        return roomMapper.findByUserId(user_id);
    }

    // 4. 마지막 메세지 ID 업데이트 (선택)
    public void updateLastMessage(int room_id, Long msg_id) {
        // room 테이블에 last_msg_id 컬럼 있을 경우
        // roomMapper.updateLastMsgId(room_id, msg_id);
    }

    // 5. 읽음 처리
    public void markAsRead(int user_id, int room_id) {
        // 가장 최신 메세지 id 조회했다고 가정
        Long last_read_msg_id = msgMapper.findLastMsgIdByRoom(room_id); // MsgMapper로 가져와도 됨

        if (last_read_msg_id == null) {
            return;
        }
        
        chatRoomUserMapper.updateLastReadMsgId(
                user_id,
                room_id,
                last_read_msg_id
        );
    }
}
