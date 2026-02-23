import { chatState } from "./ChatState.js";
import { appendMessage } from "./ChatMessage.js";
import { updateRoomListRealtime } from "./ChatUI.js";
import { isScrollBottom } from "./ChatScroll.js";

// 웹소켓 연결
export function connectWS() {
  const socket = new SockJS("/ws-chat");
  chatState.socket.stompClient = Stomp.over(socket);

  chatState.socket.stompClient.connect({}, () => {
    console.log("WS CONNECTED");

    // 개인 채널 구독
    subscribeUserChannel();
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
export function subscribeRoom(room_id) {

  if (chatState.socket.roomSubscription) {
    chatState.socket.roomSubscription.unsubscribe();
  }
  console.log("Subscribing to room:", "/topic/room." + room_id);
  chatState.socket.roomSubscription = chatState.socket.stompClient.subscribe(
    "/topic/room." + room_id,
    (msg) => {
      console.log("WS received:", msg.body);
      const data = JSON.parse(msg.body);

      if (chatState.loading.isLoadingMessages || chatState.message.appendedMsgSet.has(Number(data.msg_id))) {
        return;
      }

      const container = document.getElementById("messages");
      const wasAtBottom =
        Math.abs(container.scrollHeight - container.clientHeight - container.scrollTop) < 150;

      appendMessage(data);

      if (data.sender_id === chatState.session.myUserId || wasAtBottom) {
        requestAnimationFrame(() => {
          container.scrollTop = container.scrollHeight;
        });
      } else {
        const newMsgBtn = document.getElementById("new-msg-btn");
        if (newMsgBtn) newMsgBtn.style.display = "block";
      }
    }
  );
  console.log("SUBSCRIBED TO ROOM", room_id);
}

// 유저 구독 함수
export function subscribeUserChannel() {
    chatState.socket.stompClient.subscribe(
        "/topic/user." + chatState.session.myUserId,
        (msg) => {
            let data;
            try {
                data = JSON.parse(msg.body);

                // 필수 필드 확인
                if (!data.room_id || !data.sender_id || !data.content) {
                    console.warn("⚠️ 잘못된 payload:", data);
                    return; // 필수 값 없으면 처리 중단
                }

                // sender_name 없으면 fallback
                if (!data.sender_name) {
                    data.sender_name = "유저";
                }

            } catch (err) {
                console.error("⚠️ 실시간 메시지 JSON 파싱 실패:", err, msg.body);
                return;
            }

            console.log("✅ 실시간 메시지 payload 확인:", data);

            // 안전하게 채팅방 UI 갱신
            try {
                updateRoomListRealtime(data);
            } catch (err) {
                console.error("⚠️ 채팅방 UI 갱신 중 에러:", err, data);
            }
        }
    );
}