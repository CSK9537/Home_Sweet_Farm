package org.joonzis.chatting.mapper;

import org.joonzis.chatting.vo.ChatRoomUserVO;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import lombok.extern.log4j.Log4j;

@Log4j
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration( 
		"file:src/main/webapp/WEB-INF/spring/root-context.xml")
public class ChatRoomUserMapperTest {
	@Autowired
	private ChatRoomUserMapper mapper;
	
	// 1. 채팅방 유저 정보 추가
    @Test
    public void insertTest() {
        ChatRoomUserVO vo = new ChatRoomUserVO();
        vo.setRoom_id(2);
        vo.setUser_id(21);
        vo.setLast_read_msg_id(0L);

        int inserted = mapper.insert(vo);
        log.info("Inserted rows: " + inserted);
    }

	// 2. 마지막 읽은 메시지 ID 업데이트
//    @Test
//    public void updateLastReadMsgIdTest() {
//        Long updated = mapper.updateLastReadMsgId(3, 2, 3L);
//        log.info("Updated rows: " + updated);
//    }

	// 3. 마지막 읽은 메시지 ID 조회
//    @Test
//    public void findLastReadMsgIdTest() {
//        Long lastRead = mapper.findLastReadMsgId(2, 2);
//        log.info("Last read msg id: " + lastRead);
//    }

	// 4. 읽지 않은 메세지 수 세기
//    @Test
//    public void countUnreadTest() {
//        int unreadCount = mapper.countUnread(3, 2);
//        log.info("Unread messages: " + unreadCount);
//    }
}
