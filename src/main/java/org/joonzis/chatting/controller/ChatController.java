package org.joonzis.chatting.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.joonzis.chatting.dto.ChatMessageDTO;
import org.joonzis.chatting.dto.ChatRoomDTO;
import org.joonzis.chatting.dto.RoomSearchResultDTO;
import org.joonzis.chatting.mapper.ChatRoomMapper;
import org.joonzis.chatting.mapper.ChatRoomUserMapper;
import org.joonzis.chatting.service.ChatService;
import org.joonzis.chatting.service.MsgService;
import org.joonzis.chatting.vo.MsgVO;
import org.joonzis.chatting.vo.RoomVO;
import org.joonzis.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private MsgService msgService;
    @Autowired
    private ChatRoomMapper chatRoomMapper;
    @Autowired
    private ChatRoomUserMapper chatRoomUserMapper;

    
    /**
     * 메세지 전송 (텍스트만)
     */
    @PostMapping("/messages")
    public ResponseEntity<MsgVO> sendMessage(
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
        
        // 🔹 서버 로그 찍기
        System.out.println("[DEBUG] sendMessage 호출됨 -> roomId=" + savedMsg.getRoom_id() +
                           ", msgId=" + savedMsg.getMsg_id() +
                           ", sender=" + sender_id +
                           ", receiver=" + receiver_id +
                           ", content=" + content);

        messagingTemplate.convertAndSend(
                "/topic/room." + savedMsg.getRoom_id(),
                savedMsg
        );
        
        messagingTemplate.convertAndSend(
        		"/topic/user." + receiver_id,
        		savedMsg
        );

        	messagingTemplate.convertAndSend(
        		"/topic/user." + sender_id,
        		savedMsg
        );
        	
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
    	public List<ChatMessageDTO> getMessages(
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
    	System.out.println("[DEBUG] readMessage 호출: user_id=" + user_id + ", room_id=" + room_id);
        chatService.readMessage(user_id, room_id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping(
    		value = "/rooms/{room_id}/last-read", 
    		produces = "application/json; charset=UTF-8"
    )
    public ResponseEntity<Map<String, Long>> getLastRead(
            @PathVariable int room_id,
            @RequestParam(required = false) Integer testUser_id,
            HttpSession session
    ) {
        int user_id = getUserId(session, testUser_id);
        Long lastReadMsgId = chatRoomUserMapper.findLastReadMsgId(user_id, room_id); // DB 조회

        return ResponseEntity.ok(Map.of("last_read_msg_id", lastReadMsgId));
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

        if (testUser_id != null) {
            System.out.println("[DEBUG] testUser_id 사용: " + testUser_id);
            return testUser_id;
        }

        Integer userId = (Integer) session.getAttribute("user_id");

        if (userId == null) {
            throw new RuntimeException("로그인 세션 없음");
        }

        System.out.println("[DEBUG] session user_id 사용: " + userId);

        return userId;
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

    /**
     * 이미지/파일 업로드
     */
    @PostMapping(
            value = "/rooms/upload",
            produces = "application/json; charset=UTF-8"
    )
    public ResponseEntity<MsgVO> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam int room_id,
            @RequestParam(required = false) Integer testUser_id,
            @RequestParam String msg_type,
            @RequestParam String upload_group_id,
            HttpSession session
    ) throws IOException {

        // 1. 업로드 유저
        int sender_id = getUserId(session, testUser_id);
        int receiver_id = chatRoomMapper.selectOtherUserId(room_id, sender_id);
        // 2. 파일 저장
        String savedName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        String dbPath = "/upload/files/" + savedName;

        File destDir = new File("C:\\upload\\files");
        if (!destDir.exists()) destDir.mkdirs();

        File dest = new File(destDir, savedName);
        file.transferTo(dest);
        

        // 3. MsgVO 생성
        MsgVO msg = new MsgVO();
        msg.setSender_id(sender_id);
        msg.setRoom_id(room_id);
        msg.setMsg_type(msg_type);
        msg.setContent("");
        msg.setOriginal_name(file.getOriginalFilename());
        msg.setSaved_name(savedName);
        msg.setFile_path(dbPath);
//        msg.setFile_size(file.getSize());
        msg.setIs_active("Y");
        msg.setCreated_at(new Date());

        // 4. DB 저장
        msgService.sendMessage(msg);
        
        // 5. DTO 변환
        ChatMessageDTO dto = new ChatMessageDTO();

        dto.setMsg_id(msg.getMsg_id());
        dto.setRoom_id(msg.getRoom_id());
        dto.setSender_id(msg.getSender_id());
        dto.setContent(msg.getContent());
        dto.setMsg_type(msg.getMsg_type());
        dto.setOriginal_name(msg.getOriginal_name());
        dto.setSaved_name(msg.getSaved_name());
        dto.setFile_path(msg.getFile_path());
        dto.setCreated_at(msg.getCreated_at());
//        dto.setFile_size(msg.setFile_size(file_size));
        dto.setUpload_group_id(upload_group_id);

        // 6. WebSocket 전송
        messagingTemplate.convertAndSend("/topic/room." + room_id, dto);
        messagingTemplate.convertAndSend("/topic/user." + receiver_id, dto);
        messagingTemplate.convertAndSend("/topic/user." + sender_id, dto);

        return ResponseEntity.ok(msg);
    }
    

}


