package org.joonzis.chatting.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.joonzis.chatting.service.ChatService;
import org.joonzis.chatting.vo.MsgVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sun.security.auth.UserPrincipal;

@RestController
@RequestMapping("/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    /**
     * 메세지 전송 (텍스트 / 파일)
     */
    @PostMapping("/rooms/{roomId}/messages")
    public ResponseEntity<Void> sendMessage(
            @PathVariable int roomId,
            @RequestParam(required = false) String content,
            @RequestParam(required = false) MultipartFile file,
            HttpSession session
    ) {
        UserVO loginUser = (UserVO) session.getAttribute("loginUser");
        int userId = loginUser.getUser_id();

        chatService.sendMessage(roomId, userId, content, file);
        return ResponseEntity.ok().build();
    }

    /**
     * 채팅방 메세지 조회
     * - afterMsgId 없으면: 최초 입장
     * - afterMsgId 있으면: 이후 메세지 조회
     */
    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<List<MsgVO>> getMessages(
            @PathVariable int roomId,
            @RequestParam(required = false) Long afterMsgId,
            HttpSession session
    ) {
        UserVO loginUser = (UserVO) session.getAttribute("loginUser");
        int userId = loginUser.getUser_id();

        if (afterMsgId == null) {
            return ResponseEntity.ok(
                chatService.getMessages(roomId, userId)
            );
        }

        return ResponseEntity.ok(
            chatService.getMessages(roomId, userId, afterMsgId)
        );
    }

    /**
     * 채팅방 목록 조회
     */
    @GetMapping("/rooms")
    public ResponseEntity<List<Map<String, Object>>> getUserRooms(
            HttpSession session
    ) {
        UserVO loginUser = (UserVO) session.getAttribute("loginUser");
        int userId = loginUser.getUser_id();

        return ResponseEntity.ok(
            chatService.getUserRooms(userId)
        );
    }

    /**
     * 메세지 읽음 처리
     */
    @PostMapping("/rooms/{roomId}/read")
    public ResponseEntity<Void> readMessage(
            @PathVariable int roomId,
            HttpSession session
    ) {
        UserVO loginUser = (UserVO) session.getAttribute("loginUser");
        int userId = loginUser.getUser_id();

        chatService.readMessage(userId, roomId);
        return ResponseEntity.ok().build();
    }

    /**
     * 채팅방 생성 (없으면 생성, 있으면 반환)
     */
    @PostMapping("/rooms")
    public ResponseEntity<Integer> createRoom(
            @RequestParam int targetUserId,
            HttpSession session
    ) {
        UserVO loginUser = (UserVO) session.getAttribute("loginUser");
        int userId = loginUser.getUser_id();

        int roomId = chatService.createRoom(userId, targetUserId);
        return ResponseEntity.ok(roomId);
    }
}

