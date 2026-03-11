package org.joonzis.chatting.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

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
import org.springframework.http.HttpStatus;
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
	private ChatRoomMapper chatRoomMapper;
	@Autowired
	private ChatRoomUserMapper chatRoomUserMapper;
	@Autowired
	private org.joonzis.user.service.UserService userService;

	/**
	 * 메세지 전송 (텍스트만)
	 */
	@PostMapping("/messages")
	public ResponseEntity<MsgVO> sendMessage(@RequestParam int receiver_id, @RequestParam String content,
			HttpSession session) {
		int sender_id = getUserId(session);

		MsgVO msgVO = new MsgVO();
		msgVO.setSender_id(sender_id);
		msgVO.setContent(content);
		msgVO.setMsg_type("TEXT");

		MsgVO savedMsg = chatService.sendMessage(sender_id, receiver_id, msgVO);

		// 🔹 서버 로그 찍기
		System.out.println(
				"[DEBUG] sendMessage 호출됨 -> roomId=" + savedMsg.getRoom_id() + ", msgId=" + savedMsg.getMsg_id()
						+ ", sender=" + sender_id + ", receiver=" + receiver_id + ", content=" + content);

		messagingTemplate.convertAndSend("/topic/room." + savedMsg.getRoom_id(), savedMsg);
		messagingTemplate.convertAndSend("/topic/user." + receiver_id, savedMsg);
		messagingTemplate.convertAndSend("/topic/user." + sender_id, savedMsg);

		return ResponseEntity.ok(savedMsg);
	}

	/**
	 * 채팅방 메세지 조회 - 최초 입장: 전체 조회 - after_msg_id 기준 조회
	 */
	@GetMapping(value = "/rooms/{room_id}/messages", produces = "application/json; charset=UTF-8")
	public List<MsgVO> getMessages(@PathVariable int room_id,
			@RequestParam(required = false, defaultValue = "0") int offset,
			@RequestParam(required = false, defaultValue = "40") int size, HttpSession session) {
		int user_id = getUserId(session);
		int page = offset / size;
		return chatService.getMessages(user_id, room_id, page, size);
	}
	
	/**
	 * 상대방 유저 정보 조회 (이름 등)
	 */
	@GetMapping(value = "/user/info/{targetId}", produces = "application/json; charset=UTF-8")
	public ResponseEntity<?> getTargetUserInfo(@PathVariable int targetId) {
	    UserVO user = userService.selectUser(targetId); 
	    
	    if (user == null) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	    }
	    
	    return ResponseEntity.ok(Map.of(
	        "user_id", user.getUser_id(),
	        "username", user.getUsername(),
	        "nickname", user.getNickname() != null ? user.getNickname() : "",
	        "profile_filename", user.getProfile_filename() != null ? user.getProfile_filename() : "",
	        "grade_id", user.getGrade_id()
	    ));
	}

	/**
	 * 채팅방 목록 조회
	 */
	@GetMapping(value = "/rooms", produces = "application/json")
	public List<ChatRoomDTO> getUserRooms(HttpSession session) {
		int user_id = getUserId(session);
		return chatService.getUserRooms(user_id);
	}

	/**
	 * 메세지 읽음 처리 (해당 채팅방의 마지막 메세지까지 읽음)
	 */
	@PostMapping("/rooms/{room_id}/read")
	public ResponseEntity<Void> readMessage(@PathVariable int room_id, HttpSession session) {
		int user_id = getUserId(session);
		System.out.println("readMessage 호출: user_id=" + user_id + ", room_id=" + room_id);
		chatService.readMessage(user_id, room_id);
		return ResponseEntity.ok().build();
	}

	/**
	 * 마지막 읽은 메세지 ID 조회
	 */
	@GetMapping(value = "/rooms/{room_id}/last-read", produces = "application/json; charset=UTF-8")
	public ResponseEntity<Map<String, Long>> getLastRead(@PathVariable int room_id, HttpSession session) {
		int user_id = getUserId(session);
		Long lastReadMsgId = chatRoomUserMapper.findLastReadMsgId(user_id, room_id); // DB 조회

		return ResponseEntity.ok(Map.of("last_read_msg_id", lastReadMsgId));
	}

	/**
	 * 채팅방 생성 (없으면 생성)
	 */
	@PostMapping("/rooms")
	public ResponseEntity<Integer> createRoom(@RequestParam int target_user_id, HttpSession session) {
		int user_id = getUserId(session);
		int room_id = chatService.createRoom(user_id, target_user_id);
		return ResponseEntity.ok(room_id);
	}

	private int getUserId(HttpSession session) {
	    UserVO loginUser = (UserVO) session.getAttribute("loginUser");
	    if (loginUser == null) {
	        throw new RuntimeException("로그인 세션이 만료되었습니다.");
	    }
	    return loginUser.getUser_id();
	}

	/**
	 * 채팅방 검색
	 */
	@GetMapping(value = "/rooms/search", produces = "application/json; charset=UTF-8")
	public List<RoomSearchResultDTO> searchRooms(@RequestParam String keyword, @RequestParam String type,
			HttpSession session) {

		int user_id = getUserId(session);
		return chatService.searchRooms(user_id, keyword, type);
	}
	
	@GetMapping(value = "/rooms/{room_id}/message-offset/{msg_id}", produces = "application/json; charset=UTF-8")
	public ResponseEntity<Map<String, Integer>> getMessageOffset(
	        @PathVariable int room_id,
	        @PathVariable long msg_id) {
	    
	    int rowNum = chatRoomMapper.getMessageRowNum(room_id, msg_id);
	    
	    // 명시적으로 Map 생성
	    Map<String, Integer> response = new HashMap<>();
	    response.put("offset", rowNum);
	    
	    return ResponseEntity.ok(response);
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
            @RequestParam String msg_type,
            @RequestParam(value = "client_group_id", required = false, defaultValue = "0") long client_group_id,
            @RequestParam(value = "receiver_id", required = false, defaultValue = "0") int receiver_id,
            HttpSession session
    ) throws IOException {

    	// 유저 세션 체크
    	int sender_id = getUserId(session);

        // 1. 저장 경로 설정
        String projectPath = System.getProperty("user.dir");
        String savePath = "//192.168.0.153/projecthsf/chat_upload/";

        File folder = new File(savePath);
        if (!folder.exists()) {
            folder.mkdirs(); // 폴더가 없으면 src 하위에 생성
        }

        // 2. 파일명 중복 방지 (UUID)
        String originalName = file.getOriginalFilename();
        String savedName = UUID.randomUUID().toString() + "_" + originalName;
        String dbPath = "/chat/files/" + savedName;

        try {
            // 3. 실제 파일 물리 저장
            file.transferTo(new File(savePath + File.separator + savedName));
        

	        // 3. MsgVO 생성
	        MsgVO msg = new MsgVO();
	        msg.setSender_id(sender_id);
	        msg.setRoom_id(room_id);
	        msg.setMsg_type(msg_type);
	        msg.setContent("");
	        msg.setOriginal_name(file.getOriginalFilename());
	        msg.setSaved_name(savedName);
	        msg.setFile_path(dbPath);
//        	msg.setFile_size(file.getSize());
	        msg.setIs_active("Y");

	        // 4. DB 저장
	        long group_id = (client_group_id > 0) ? client_group_id : chatService.getNextGroupId(room_id);
	        MsgVO savedMsg = chatService.sendFileMessage(sender_id, receiver_id, room_id, msg, group_id);
	        
	        int actualRoomId = savedMsg.getRoom_id();
	        int targetId = (receiver_id > 0) ? receiver_id : chatRoomMapper.selectOtherUserId(actualRoomId, sender_id);
	        
	        messagingTemplate.convertAndSend("/topic/room." + actualRoomId, savedMsg);
	        messagingTemplate.convertAndSend("/topic/user." + sender_id, savedMsg);
	        messagingTemplate.convertAndSend("/topic/user." + targetId, savedMsg);
	
	        return ResponseEntity.ok(savedMsg);
        }catch (IOException e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	    }
    }

	@GetMapping("/rooms/upload/test")
	public String testUpload() {
		System.out.println("[DEBUG] /rooms/upload/test 호출됨");
		return "OK";
	}

}
