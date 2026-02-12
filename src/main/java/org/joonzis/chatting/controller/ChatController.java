package org.joonzis.chatting.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.joonzis.chatting.dto.ChatRoomDTO;
import org.joonzis.chatting.dto.RoomSearchResultDTO;
import org.joonzis.chatting.service.ChatService;
import org.joonzis.chatting.vo.MsgVO;
import org.joonzis.chatting.vo.RoomVO;
import org.joonzis.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    
    /**
     * 메세지 전송 (텍스트만)
     */
    @PostMapping("/messages")
    public ResponseEntity<MsgVO> send_message(
            @RequestParam int receiver_id,
            @RequestParam String content,
            @RequestParam(required = false)Integer testUser_id,
            HttpSession session
    ) {
        int sender_id = getUserId(session, testUser_id);

        
        MsgVO msgVO = new MsgVO();
        msgVO.setSender_id(sender_id);
        msgVO.setContent(content);
        msgVO.setMsg_type("TEXT");
        
        MsgVO savedMsg = chatService.sendMessage(sender_id, receiver_id, msgVO);
        
        return ResponseEntity.ok(savedMsg);
    }

    /**
     * 채팅방 메세지 조회
     * - 최초 입장: 전체 조회
     * - after_msg_id 기준 조회
     */
    @GetMapping(
    	    value = "/rooms/{room_id}/messages",
    	    produces = "application/json; charset=UTF-8"
    	)
    	public List<MsgVO> getMessages(
    	        @PathVariable int room_id,
                @RequestParam(required = false)Integer testUser_id,
                HttpSession session
    	) {
    	    int user_id = getUserId(session, testUser_id);
    	    return chatService.getMessages(user_id, room_id);
    }

    /**
     * 채팅방 목록 조회
     */
    @GetMapping(
    		value = "/rooms", 
    		produces = "application/json"
    )
    public List<ChatRoomDTO> getUserRooms(
    		@RequestParam(required = false)Integer testUser_id,
    		HttpSession session
    	) {
        int user_id = getUserId(session, testUser_id);
        return chatService.getUserRooms(user_id);
    }


    /**
     * 메세지 읽음 처리
     * (해당 채팅방의 마지막 메세지까지 읽음)
     */
    @PostMapping("/rooms/{room_id}/read")
    public ResponseEntity<Void> readMessage(
            @PathVariable int room_id,
            @RequestParam(required = false)Integer testUser_id,
            HttpSession session
    ) {
    	int user_id = getUserId(session, testUser_id);
        chatService.readMessage(user_id, room_id);
        return ResponseEntity.ok().build();
    }

    /**
     * 채팅방 생성 (없으면 생성)
     */
    @PostMapping("/rooms")
    public ResponseEntity<Integer> createRoom(
            @RequestParam int target_user_id,
            @RequestParam(required = false)Integer testUser_id,
            HttpSession session
    ) {
        int user_id = getUserId(session, testUser_id);
        int room_id = chatService.createRoom(user_id, target_user_id);
        return ResponseEntity.ok(room_id);
    }
    
    private int getUserId(HttpSession session, Integer testUser_id) {
        int resultId;
        if(testUser_id != null) {
            resultId = testUser_id;
        } else {
            UserVO login_user = (UserVO) session.getAttribute("login_user");
            resultId = login_user != null ? login_user.getUser_id() : 1; // default user_id : 1
        }

        // 🔹 로그 추가
        System.out.println("[DEBUG] 서버에서 사용하는 user_id: " + resultId
                + ", testUser_id 파라미터: " + testUser_id
                + ", 세션 login_user: " + session.getAttribute("login_user"));

        return resultId;
    }
    
    /**
     *  채팅방 검색
     */
    @GetMapping(value = "/rooms/search", produces = "application/json; charset=UTF-8")
    public List<RoomSearchResultDTO> searchRooms(
            @RequestParam int user_id,
            @RequestParam String keyword,
            @RequestParam String type) {

            return chatService.searchRooms(user_id, keyword, type);
    }

    
}


