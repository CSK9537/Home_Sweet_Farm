import { chatState } from "./ChatState.js";
import { appendMessage, markAsRead } from "./ChatMessage.js";
import { updateRoomListRealtime } from "./ChatUI.js";
import { isScrollBottom } from "./ChatScroll.js";

// 웹소켓 연결
export async function connectWS() {

  if (!chatState.session.myUserId) {
    try {
      const response = await fetch('/user/me'); // UserController의 @GetMapping("/me") 호출
      const user = await response.json();
      chatState.session.myUserId = user.user_id;
      console.log("세션으로부터 ID 획득:", chatState.session.myUserId);
    } catch (e) {
      console.error("로그인 정보 확인 실패:", e);
      return; // ID 없으면 소켓 연결 진행 불가
    }
  }

  const socket = new SockJS("/ws-chat");
  chatState.socket.stompClient = Stomp.over(socket);

  chatState.socket.stompClient.connect({}, () => {
    console.log("WS CONNECTED (User ID: " + chatState.session.myUserId + ")");

    // 개인 채널 구독
    subscribeUserChannel();
    console.log("SUBSCRIBE USER =", chatState.session.myUserId);
    if (chatState.session.currentRoomId) {
      subscribeRoom(chatState.session.currentRoomId);
    }
  },
    (error) => {
      console.log("WS ERROR", error);
      reconnectWS();
    });

  // 진짜 연결 끊김 감지
  socket.onclose = function () {
    console.log("WS CLOSED");
    reconnectWS();
  };
}

export function reconnectWS() {

  if (chatState.socket.reconnectTimer) return; // 중복 방지

  console.log("3초 후 재연결 시도");

  chatState.socket.reconnectTimer = setTimeout(() => {
    chatState.socket.reconnectTimer = null;
    connectWS();
  }, 3000);
}

// 방 구독 함수
export function subscribeRoom(roomId) {
    if (!chatState.socket.stompClient) return;

    console.log(`[WS] 채팅방 구독 시작: ${roomId}`);
    chatState.socket.roomSubscription = chatState.socket.stompClient.subscribe(
        `/topic/room.${roomId}`,
        (tick) => {
            const msg = JSON.parse(tick.body);
            const container = document.getElementById("messages");
            const newMsgBtn = document.getElementById("new-msg-btn"); 

            const wasAtBottom = isScrollBottom(); 
            const isMyMsg = msg.sender_id === chatState.session.myUserId;

            appendMessage(msg);

            if (!isMyMsg) {
                markAsRead(roomId, msg.msg_id);
            }

            if (isMyMsg || wasAtBottom) {
                container.scrollTop = container.scrollHeight;
                if (newMsgBtn) newMsgBtn.style.display = "none";
            } else {
                if (newMsgBtn) newMsgBtn.style.display = "block";
            }

            if (msg.msg_type === 'IMAGE' || msg.msg_type === 'FILE_IMAGE') {
                const lastMsgBox = container.lastElementChild;
                const img = lastMsgBox ? lastMsgBox.querySelector('img') : null;

                if (img) {
                    img.onload = () => {
                        if (isMyMsg || isScrollBottom()) {
                            container.scrollTop = container.scrollHeight;
                        }
                    };
                }
            }
        }
    );
}

// 유저 구독 함수
export function subscribeUserChannel() {
    chatState.socket.stompClient.subscribe(
        "/topic/user." + chatState.session.myUserId,
        (msg) => {
            try {
                const data = JSON.parse(msg.body);
                if (!data.room_id) return;

                console.log("실시간 개인 알림 수신:", data);

                if (chatState.session.currentRoomId === data.room_id) {
                    if (data.sender_id !== chatState.session.myUserId) {
                        markAsRead(data.room_id, data.msg_id);
                    }
                }
                updateRoomListRealtime(data);

            } catch (err) {
                console.error("실시간 메시지 처리 실패:", err);
            }
        }
    );
}