import { chatState } from "./ChatState.js";
import { appendMessage } from "./ChatMessage.js";
import { loadChatRooms } from "./ChatUI.js";
import { subscribeRoom } from "./ChatWebSocket.js";

// 파일&이미지 업로드 모달
export function initPendingFilesModal() {
  const modal = document.getElementById("pendingFilesModal");
  const container = document.getElementById("pendingFilesContainer");
  const uploadBtn = document.getElementById("uploadAllBtn");
  const closeBtn = document.getElementById("closeModalBtn");
  const attachBtn = document.getElementById("attachBtn");
  const imageInput = document.getElementById("imageInput");
  const fileInput = document.getElementById("fileInput");
  const btnImage = document.querySelector(".btn-image");
  const btnFile = document.querySelector(".btn-file");
  const modalTitle = document.getElementById("modalTitle");

  let currentFiles = [];
  let currentModalType = null; // IMAGE or FILE

  function renderFileList() {

    container.innerHTML = "";

    // ===== Drop Zone =====
    const dropZone = document.createElement("div");
    dropZone.classList.add("drop-zone");

    dropZone.innerHTML = `
            <div class="drop-text">
                이곳에 파일을 끌어서 혹은 첨부 버튼을 눌러서 추가
            </div>
        `;

    dropZone.addEventListener("dragover", e => {
      e.preventDefault();
      dropZone.classList.add("drag-over");
    });

    dropZone.addEventListener("dragleave", () => {
      dropZone.classList.remove("drag-over");
    });

    dropZone.addEventListener("drop", e => {

      e.preventDefault();
      dropZone.classList.remove("drag-over");

      const files = e.dataTransfer.files;

      if (!files || files.length === 0) return;

      handleFileSelect(files);
    });

    // ===== 파일 리스트 =====
    if (currentFiles.length === 0) {
      container.appendChild(dropZone);
      uploadBtn.disabled = true;
      uploadBtn.style.background = "gray";
      return;
    }

    const fileContainer = document.createElement("div");
    fileContainer.classList.add("modal-file-container");

    currentFiles.forEach((file, idx) => {
      const wrapper = document.createElement("div");

      // ===== 이미지 vs 파일 분기 =====
      if (currentModalType === "IMAGE" && file.type.startsWith("image/")) {
        wrapper.classList.add("pending-file-item", "image-item");

        const img = document.createElement("img");
        img.classList.add("pending-thumbnail");
        const reader = new FileReader();
        reader.onload = e => img.src = e.target.result;
        reader.readAsDataURL(file);

        wrapper.appendChild(img);

        // 삭제 버튼
        const removeBtn = document.createElement("button");
        removeBtn.innerText = "✕";
        removeBtn.className = "";
        removeBtn.classList.add("image-remove-btn");
        removeBtn.addEventListener("click", () => {
          currentFiles.splice(idx, 1);
          renderFileList();
        });
        wrapper.appendChild(removeBtn);

      } else { // FILE 모달 또는 IMAGE지만 이미지 아님
        wrapper.classList.add("pending-file-item", "file-item");

        const span = document.createElement("span");
        span.classList.add("file-name");
        span.innerText = `📎 ${file.name}`;
        wrapper.appendChild(span);

        // 삭제 버튼
        const removeBtn = document.createElement("button");
        removeBtn.innerText = "삭제";
        removeBtn.className = "";
        removeBtn.classList.add("file-remove-btn");
        removeBtn.addEventListener("click", () => {
          currentFiles.splice(idx, 1);
          renderFileList();
        });
        wrapper.appendChild(removeBtn);
      }

      fileContainer.appendChild(wrapper);
    });

    container.appendChild(fileContainer);

    uploadBtn.disabled = false;
    uploadBtn.style.background = "#6B715D";
  }

  function handleFileSelect(files) {
    const filtered = Array.from(files).filter(file => {

      if (currentModalType === "IMAGE") {
        return file.type.startsWith("image/");
      }

      return true; // FILE 모달은 전부 허용
    });

    const existingNames = new Set(currentFiles.map(f => f.name + f.size + f.lastModified));
    const newFiles = filtered.filter(f => !existingNames.has(f.name + f.size + f.lastModified))

    currentFiles = [...currentFiles, ...newFiles];
    renderFileList();

    modal.classList.add("show");
    document.body.classList.add("modal-open");

    imageInput.value = "";
    fileInput.value = "";
  }

  async function uploadSelectedFiles() {
    if (currentFiles.length === 0) return;

    const uploadGroupId = Date.now();

    const filesToUpload = [...currentFiles];
    currentFiles = [];
    renderFileList();

    modal.classList.remove("show");
    document.body.classList.remove("modal-open");

    for (const file of filesToUpload) {
      try {
        await uploadFile(file, currentModalType, uploadGroupId);
      } catch (err) {
        console.error(`${file.name} 전송 실패:`, err);
      }
    }
  }

  // ---------------- 이벤트 바인딩 ----------------

  // 모달 닫기
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("show");
    document.body.classList.remove("modal-open");
    currentFiles = [];
    renderFileList();
  });

  // 채팅 입력란 버튼 클릭 → 모달 열기 + 타입 설정
  [btnImage, btnFile].forEach(btn => {
    btn.addEventListener("click", () => {
      currentModalType = btn.classList.contains("btn-image") ? "IMAGE" : "FILE";
      modalTitle.innerText = currentModalType === "IMAGE" ? "이미지 첨부" : "파일 첨부";

      modal.classList.remove("image-modal", "file-modal");
      modal.classList.add(currentModalType === "IMAGE" ? "image-modal" : "file-modal");

      currentFiles = [];
      renderFileList();

      modal.classList.add("show");
      document.body.classList.add("modal-open");

      imageInput.value = "";
      fileInput.value = "";
    });
  });

  // 모달 내 첨부 버튼 클릭 → 분기
  attachBtn.addEventListener("click", () => {
    if (currentModalType === "IMAGE") imageInput.click();
    else if (currentModalType === "FILE") fileInput.click();
  });

  // 파일 선택
  imageInput.addEventListener("change", e => handleFileSelect(e.target.files));
  fileInput.addEventListener("change", e => handleFileSelect(e.target.files));

  // 업로드 버튼
  uploadBtn.addEventListener("click", uploadSelectedFiles);

  // Drag & Drop 업로드
  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ["dragenter", "dragover", "dragleave", "drop"]
    .forEach(eventName => {
      modal.addEventListener(eventName, preventDefaults);
    });

  // 드래그 들어오면 강조
  modal.addEventListener("dragenter", () => {
    modal.classList.add("drag-over");
  });

  modal.addEventListener("dragleave", () => {
    modal.classList.remove("drag-over");
  });

  modal.addEventListener("drop", (e) => {

    modal.classList.remove("drag-over");

    const files = e.dataTransfer.files;

    if (!files || files.length === 0) return;

    //IMAGE 모달인지 FILE 모달인지 유지
    handleFileSelect(files);
  });

  modal.addEventListener("click", (e) => {
    const target = e.target;

    // 업로드 버튼 클릭 시
    if (target && target.id === "uploadAllBtn") {
      if (!target.disabled) {
        console.log("[SUCCESS] 업로드 시작");
        uploadSelectedFiles();
      }
    }

    // 닫기 버튼 클릭 시
    if (target && target.id === "closeModalBtn") {
      modal.classList.remove("show");
      document.body.classList.remove("modal-open");
      currentFiles = [];
      renderFileList();
    }
  });
}

// 실제 업로드 함수
function uploadFile(file, type, uploadGroupId) {
  const formData = new FormData();
  const currentRoomId = String(chatState.session.currentRoomId);
  formData.append("file", file);
  formData.append("room_id", currentRoomId);
  formData.append("msg_type", type);
  formData.append("client_group_id", uploadGroupId);

  // 현재 세션 상태 확인

  // [핵심] 가상 방일 때 receiver_id를 반드시 포함
  if (currentRoomId === "0") {
    formData.append("receiver_id", chatState.session.receiverId);
    console.log("[DEBUG] 첫 파일 전송: 방 생성 프로세스 시작");
  }

  fetch(`/chat/rooms/upload`, {
    method: "POST",
    body: formData
  })
    .then(async res => {
      const text = await res.text();
      if (!res.ok) {
        // 이제 서버 에러 페이지 내용이 콘솔에 찍힐 겁니다.
        console.error("[ERROR] 서버 내부 오류 발생:", text);
        throw new Error("서버 업로드 실패");
      }
      return JSON.parse(text);
    })
    .then(data => {
      // 성공 처리 (방 번호 갱신 및 메시지 추가)
      if (currentRoomId === "0" && data.room_id) {
        chatState.session.currentRoomId = data.room_id;
        if (typeof subscribeRoom === "function") subscribeRoom(data.room_id);
        loadChatRooms(); // 목록 새로고침
      }
      appendMessage(data);
    })
    .catch(err => console.error("파일 업로드 에러:", err));
}

// 이미지 모달
export function initImagePreviewModal() {
  const modal = document.getElementById("imagePreviewModal");
  const previewImg = document.getElementById("previewImage");
  const closeBtn = document.getElementById("closeImageModal");
  const downloadBtn = document.getElementById("downloadImageBtn");

  let currentImageUrl = null;
  // 이미지 클릭 시
  document.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG" && e.target.classList.contains("chat-thumbnail")) {
      currentImageUrl = e.target.src;
      previewImg.src = currentImageUrl;
      modal.classList.add("show");
      document.body.classList.add("modal-open");
    }
  });

  // 다운로드 
  downloadBtn.addEventListener("click", () => {

    if (!currentImageUrl) return;

    const a = document.createElement("a");
    a.href = currentImageUrl;
    a.download = decodeURIComponent(
      currentImageUrl.split("/").pop()
    );

    document.body.appendChild(a);
    a.click();
    a.remove();
  });

  // 모달 닫기
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("show");
    document.body.classList.remove("modal-open");
    previewImg.src = "";
    currentImageUrl = null;
  });

  // 모달 바깥 클릭 시 닫기
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("show");
      document.body.classList.remove("modal-open");
      previewImg.src = "";
    }
  });
}