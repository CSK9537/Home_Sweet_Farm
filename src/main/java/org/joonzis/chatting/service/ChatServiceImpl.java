package org.joonzis.chatting.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.joonzis.chatting.dto.ChatRoomDTO;
import org.joonzis.chatting.dto.RoomSearchResultDTO;
import org.joonzis.chatting.mapper.ChatRoomUserMapper;
import org.joonzis.chatting.mapper.MsgMapper;
import org.joonzis.chatting.vo.MsgVO;
import org.joonzis.chatting.vo.RoomVO;
import org.joonzis.user.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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
	@Autowired
	private MsgMapper msgMapper;
	@Autowired
	private UserMapper userMapper;

    // 1. 메세지 전송
	@Transactional
	public MsgVO sendMessage(int sender_id, int receiver_id, MsgVO msgVO) {
	    // 채팅방 조회 or 생성
	    int room_id = roomService.getOrCreateRoom(sender_id, receiver_id);
	    // 메시지 저장
	    msgVO.setRoom_id(room_id);
	    msgVO.setSender_id(sender_id);
	    msgService.sendMessage(msgVO);
	    
	    // DB에 저장된 메시지 조회
	    MsgVO savedMsg = msgService.findById(msgVO.getMsg_id());
	    return savedMsg;
	}

    // 2. 마지막으로 읽은 메세지 이후 메세지 조회
    @Transactional(readOnly = true)
    public List<MsgVO> getMessages(int user_id, int room_id) {
//        Long lastReadMsgId =
//            chatRoomUserMapper.findLastReadMsgId(user_id, room_id);
//
//        if (lastReadMsgId == null) {
//            return msgService.findRoomId(room_id);
//        }
//        return msgService.findAfterMsgId(room_id, lastReadMsgId);
    	return msgService.findRoomId(room_id);
    }


    // 3. 유저가 참여 중인 채팅방 목록
    @Transactional(readOnly = true)
    public List<ChatRoomDTO> getUserRooms(int user_id) {
        List<RoomVO> rooms = roomService.findRoomByUser(user_id);

        List<ChatRoomDTO> dtoList = new ArrayList<>();
        for (RoomVO room : rooms) {
            int otherUserId = (room.getUser1_id() == user_id) ? room.getUser2_id() : room.getUser1_id();
            String otherUserName = userMapper.findNicknameById(otherUserId);
            // 마지막 메시지 ID 가져오기
            Long lastMsgId = msgMapper.findLastMsgIdByRoom(room.getRoom_id());
            MsgVO lastMsg = null;
            if (lastMsgId != null) {
                lastMsg = msgMapper.findById(lastMsgId); // findById는 없으면 만들어야 함
            }
            // 읽지 않은 메시지 수
            int unreadCount = chatRoomUserMapper.countUnread(user_id,room.getRoom_id());
            System.out.println("room_id=" + room.getRoom_id() + ", user_id=" + user_id + ", unread=" + unreadCount);
            dtoList.add(new ChatRoomDTO(
                room.getRoom_id(),
                otherUserId,
                otherUserName,
                lastMsg != null ? lastMsg.getContent() : "",
                unreadCount
            ));
        }

        return dtoList;
    }

    // 4. 읽음 처리
    public void readMessage(int user_id, int room_id) {
        roomService.markAsRead(user_id, room_id);
    }

    // 5. 채팅방 생성 (외부에서 직접 호출할 경우)
    public int createRoom(int user1, int user2) {
        return roomService.getOrCreateRoom(user1, user2);
    }
    
    public Long getFirstUnreadMsgId(int user_id, int room_id){

        Long lastRead = chatRoomUserMapper
            .findLastReadMsgId(user_id, room_id);

        List<MsgVO> list =
            msgMapper.findAfterMsgId(room_id, lastRead);

        if(list == null || list.isEmpty()) return null;

        return list.get(0).getMsg_id();
    }

    // 6. 메세지로 채팅방 조회
    public List<RoomSearchResultDTO> searchRooms(int user_id, String keyword, String type) {
        if ("message".equals(type)) {
            // 메시지 검색은 Map으로 전달
            Map<String, Object> param = new HashMap<>();
            param.put("user_id", user_id);
            param.put("keyword", keyword);
            return msgMapper.searchByMessage(param);
        } else { // user
            // 유저 검색은 단순 @Param으로 전달
            return chatRoomUserMapper.searchByUser(user_id, keyword);
        }
    }
}
