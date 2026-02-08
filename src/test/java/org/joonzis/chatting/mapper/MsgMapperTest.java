package org.joonzis.chatting.mapper;

import java.time.LocalDateTime;
import java.util.List;

import org.joonzis.chatting.vo.MsgVO;
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
public class MsgMapperTest {

    @Autowired
    private MsgMapper mapper;

    // 1. 메시지 삽입
    @Test
    public void insertTest() {
        MsgVO msg = new MsgVO();
        msg.setRoom_id(2);
        msg.setSender_id(3);
        msg.setContent("테스트 메시지 insert");
        msg.setCreated_at(LocalDateTime.now());

        int inserted = mapper.insert(msg);
        log.info("Inserted rows: " + inserted);
        log.info("Inserted msg ID: " + msg.getMsg_id()); // 시퀀스 적용 시 자동 생성된 ID 확인
    }

    // 2. 채팅방의 모든 메시지 조회
//    @Test
//    public void findByRoomIdTest() {
//
//        List<MsgVO> msgs = mapper.findByRoomId(2);
//        msgs.forEach(m -> System.out.println(m.getContent()));
//        log.info("Messages in room 2:");
//        msgs.forEach(m -> log.info(m.getMsg_id() + " | " + m.getContent() + " | " + m.getCreated_at()));
//    }

    // 3. 마지막 읽은 메시지 이후 메시지 조회
//    @Test
//    public void findAfterMsgIdTest() {
//        List<MsgVO> msgsAfter = mapper.findAfterMsgId(5, 5L);
//        log.info("Messages after msg ID 5:");
//        msgsAfter.forEach(m -> log.info(m.getMsg_id() + " | " + m.getContent() + " | " + m.getCreated_at()));
//    }
}