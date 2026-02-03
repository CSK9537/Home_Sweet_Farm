package org.joonzis.chatting.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;

import java.util.List;

import org.joonzis.chatting.mapper.ChatRoomUserMapper;
import org.joonzis.chatting.mapper.MsgMapper;
import org.joonzis.chatting.mapper.RoomMapper;
import org.joonzis.chatting.vo.MsgVO;
import org.joonzis.chatting.vo.RoomVO;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import lombok.extern.log4j.Log4j;

@Log4j
@WebAppConfiguration
@RunWith(SpringJUnit4ClassRunner.class) 
@ContextConfiguration( 
		"file:src/main/webapp/WEB-INF/spring/root-context.xml")
public class ChatServiceTest {
	
	@Autowired
	private ChatService chatService;
	@Autowired
    private RoomService roomService;
	@Autowired
    private MsgService msgService;
	@Autowired
    private ChatRoomUserMapper chatRoomUserMapper;
	@Autowired 
	private MsgMapper msgMapper;
	@Autowired
	private RoomMapper roomMapper;

	@Before
	public void setUp() {
	    msgMapper.deleteAll();
	    chatRoomUserMapper.deleteAll();
	    roomMapper.deleteAll();
	}
	
    /**
     * 1. 메세지 전송
     * - 채팅방 생성
     * - 메세지 저장
     */
//    @Test
//    public void sendMessage_createsRoomAndSavesMessage() {
//        int senderId = 2;
//        int receiverId = 3;
//
//        MsgVO msg = new MsgVO();
//        msg.setSender_id(senderId);
//        msg.setContent("hello");
//
//        chatService.sendMessage(senderId, receiverId, msg);
//
//        List<RoomVO> rooms = roomService.findRoomByUser(senderId);
//        assertFalse(rooms.isEmpty());
//
//        int roomId = rooms.get(0).getRoom_id();
//        List<MsgVO> messages = msgService.findRoomId(roomId);
//
//        assertEquals(1, messages.size());
//        assertEquals("hello", messages.get(0).getContent());  
//    }

//    /**
//     * 2. 처음 입장 (last_read_msg_id = null)
//     * - 모든 메세지 조회
//     */
//    @Test
//    public void getMessages_whenFirstEnterRoom_returnsAllMessages() {
//        int user1_id = 2;
//        int user2_id = 21;
//
//        MsgVO msg1 = new MsgVO();
//        msg1.setContent("msg1");
//        msg1.setSender_id(user1_id);
//        MsgVO msg2 = new MsgVO();
//        msg2.setContent("msg2");
//        msg2.setSender_id(user2_id);
//        
//        
//        
//        chatService.sendMessage(user1_id, user2_id, msg1);
//        chatService.sendMessage(user1_id, user2_id, msg2);
//
//        int room_id =
//            roomService.findRoomByUser(user1_id).get(0).getRoom_id();
//
//        List<MsgVO> result =
//            chatService.getMessages(user2_id, room_id);
//
//        System.out.println("DEBUG - messages: ");
//        for (MsgVO msg : result) {
//            System.out.println("msg_id: " + msg.getMsg_id() + ", content: " + msg.getContent() + ", sender_id: " + msg.getSender_id());
//        }
//        
//        assertEquals(2, result.size());
//    }

    /**
     * 3. 읽음 처리 이후
     * - 마지막으로 읽은 메세지 이후만 조회
     */
	@Test
	public void getMessages_afterRead_returnsOnlyNewMessages() {
	    int senderId = 2;
	    int receiverId = 3;

	    // 1️ 메시지 생성
	    MsgVO msg1 = new MsgVO();
	    msg1.setContent("msg1");
	    msg1.setSender_id(senderId);

	    MsgVO msg2 = new MsgVO();
	    msg2.setContent("msg2");
	    msg2.setSender_id(senderId);

	    // 2️ 방 생성 및 msg1 전송
	    chatService.sendMessage(senderId, receiverId, msg1);
	    int roomId = roomService.getOrCreateRoom(senderId, receiverId);
	    msg1.setRoom_id(roomId);

	    // 3️ 읽음 처리 (receiver 기준)
	    chatService.readMessage(receiverId, roomId);

	    // 4️ msg2 전송 (새 메시지)
	    msg2.setRoom_id(roomId);
	    chatService.sendMessage(senderId, receiverId, msg2);

	    // 5️ 읽지 않은 메시지 조회
	    List<MsgVO> result = chatService.getMessages(receiverId, roomId);

	    // 6️ 검증
	    assertEquals(1, result.size());
	    assertEquals("msg2", result.get(0).getContent());

	    //  디버그
	    System.out.println("Unread messages after read:");
	    for (MsgVO msg : result) {
	        System.out.println("msg_id=" + msg.getMsg_id() + ", content=" + msg.getContent());
	    }
	}

//    /**
//     * 4. 채팅방 목록 조회
//     */
//	@Test
//	public void getUserRooms_returnsRooms() {
//	    int user1_id = 2;
//	    int user2_id = 3;
//
//	    // 1. 방 가져오기 또는 생성 → room_id 반환
//	    int room_id = roomService.getOrCreateRoom(user1_id, user2_id);
//
//	    // 2. 메시지 생성
//	    MsgVO msg = new MsgVO();
//	    msg.setContent("hello");
//	    msg.setSender_id(user1_id);
//	    msg.setRoom_id(room_id);  // room_id 필수!
//
//	    // 3. 메시지 전송
//	    chatService.sendMessage(user1_id, user2_id, msg);
//
//	    // 4. 채팅방 목록 조회
//	    List<RoomVO> rooms = chatService.getUserRooms(user1_id);
//
//	    assertEquals(1, rooms.size());
//	}

    /**
     * 5. 채팅방 중복 생성 방지
     * - 같은 유저 조합이면 같은 room_id
     */
//    @Test
//    public void createRoom_shouldNotCreateDuplicateRoom() {
//        int user1_id = 2;
//        int user2_id = 21;
//
//        int room1 = chatService.createRoom(user1_id, user2_id);
//        int room2 = chatService.createRoom(user1_id, user2_id);
//
//        assertEquals(room1, room2);
//    }
}
