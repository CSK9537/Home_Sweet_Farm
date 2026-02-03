package org.joonzis.chatting.mapper;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.joonzis.chatting.vo.RoomVO;
import org.junit.Before;
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
public class RoomMapperTest {

    @Autowired
    private RoomMapper roomMapper;

//    // 1. 두 유저의 채팅방 아이디 찾기(중복 방지를 위한)
//    @Test
//    public void findRoomIdTest() {
//        int roomId = roomMapper.findRoomId(2, 3);
//        log.info("roomId = " + roomId);
//    }

    // 2. 채팅방 insert
//    @Test
//    public void insertRoomTest() {
//        RoomVO room = new RoomVO();
//        room.setUser1_id(21);
//        room.setUser2_id(2);
//        roomMapper.insert(room);
//        log.info("Inserted room_id = " + room.getRoom_id());
//    }

//    // 3. 채팅방 상세 조회
//    @Test
//    public void findByIdTest() {
//        RoomVO room = roomMapper.findById(2);
//        log.info("Room detail: " + room);
//    }

    
//    // 4. 유저가 속한 모든 채팅방 조회(chatroomuser가 선행되어야함)
//    @Test
//    public void findByUserIdTest() {
//        List<RoomVO> rooms = roomMapper.findByUserId(3);
//        rooms.forEach(r -> log.info("Room: " + r));
//    }
}
