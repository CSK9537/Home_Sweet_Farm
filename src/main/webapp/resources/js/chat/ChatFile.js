import { appendMessage } from "./ChatMessage.js";
import { chatState } from "./ChatState.js";

export function handleFileUpload(e) {
  const fileInput = document.getElementById("fileInput");
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("sender_id", chatState.session.myUserId);
    formData.append("receiver_id", chatState.session.receiverId);
    formData.append("room_id", chatState.session.currentRoomId);

    fetch("/chat/rooms/upload", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        // 전송 후 appendMessage 호출 가능
        appendMessage(data);
      })
      .catch(err => console.error("파일 전송 실패", err));

    fileInput.value = ""; // 다음 업로드를 위해 초기화
  });

}