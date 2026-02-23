import { appendMessage } from "./ChatMessage.js";
import { chatState } from "./ChatState.js";

export function handleFileUpload() {

  if (window.fileUploadBound) return;
  window.fileUploadBound = true;

  document.addEventListener("change", (e) => {

    if (e.target.id !== "fileInput") return;

    onFileChange(e);
  });
}

function onFileChange(e) {

  const fileInput = e.target;
  const file = fileInput.files[0];
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
    .then(data => appendMessage(data))
    .catch(err => console.error(err))
    .finally(() => {
      fileInput.value = "";
    });
}