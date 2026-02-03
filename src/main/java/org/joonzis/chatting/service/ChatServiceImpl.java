package org.joonzis.chatting.service;

import java.util.List;

import org.joonzis.chatting.mapper.ChatRoomUserMapper;
import org.joonzis.chatting.vo.MsgVO;
import org.joonzis.chatting.vo.RoomVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.log4j.Log4j;

@Log4j
@Service
public class ChatServiceImpl implements ChatService{

	@Autowired
    private RoomService roomService;
	@Autowired
    private MsgService msgService;
	@Autowired
    private ChatRoomUserMapper chatRoomUserMapper;

    // 1. 메세지 전송
    public void sendMessage(int sender_id, int receiver_id, MsgVO msgVO) {
        //  채팅방 조회 or 생성
        int room_id = roomService.getOrCreateRoom(sender_id, receiver_id);

        //  메세지 저장
        msgVO.setRoom_id(room_id);
        msgService.sendMessage(msgVO);
    }

    // 2. 마지막으로 읽은 메세지 이후 메세지 조회
    @Transactional(readOnly = true)
    public List<MsgVO> getMessages(int user_id, int room_id) {
        Long lastReadMsgId =
                chatRoomUserMapper.findLastReadMsgId(user_id, room_id);

        if (lastReadMsgId == null) {
            return msgService.findRoomId(room_id);
        }
        return msgService.findAfterMsgId(room_id, lastReadMsgId);
    }

    // 3. 유저가 참여 중인 채팅방 목록
    @Transactional(readOnly = true)
    public List<RoomVO> getUserRooms(int user_id) {
        return roomService.findRoomByUser(user_id);
    }

    // 4. 읽음 처리
    public void readMessage(int user_id, int room_id) {
        roomService.markAsRead(user_id, room_id);
    }

    // 5. 채팅방 생성 (외부에서 직접 호출할 경우)
    public int createRoom(int user1, int user2) {
        return roomService.getOrCreateRoom(user1, user2);
    }
}
