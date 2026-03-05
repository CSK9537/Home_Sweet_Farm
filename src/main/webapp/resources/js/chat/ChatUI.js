import { chatState } from "./ChatState.js";
import { loadMessages, markAsRead } from "./ChatMessage.js";
import { subscribeRoom } from "./ChatWebSocket.js";
import { updateSearchCounter } from "./ChatSearch.js";

// 채팅방 프리뷰 분기
function makePreviewMessage(msg, type) {

    if (type === "IMAGE") return "[이미지]";
    if (type === "FILE") return "[파일]";

    if (!msg) return "";

    return String(msg)
        .replace(/\n/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

// 채팅방 최근 메세지 날짜 계산
function formatChatTime(dateString) {

    if (!dateString) return "";

    const msgDate = new Date(dateString);
    const now = new Date();

    const isToday =
        msgDate.getFullYear() === now.getFullYear() &&
        msgDate.getMonth() === now.getMonth() &&
        msgDate.getDate() === now.getDate();

    //오늘 → 시간
    if (isToday) {
        return msgDate.toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    //올해 → MM.DD
    if (msgDate.getFullYear() === now.getFullYear()) {
        return `${String(msgDate.getMonth() + 1).padStart(2, '0')}.${String(msgDate.getDate()).padStart(2, '0')}`;
    }

    //다른 해 -> YYYY.MM.DD
    return `${msgDate.getFullYear()}.${String(msgDate.getMonth() + 1).padStart(2, '0')}.${String(msgDate.getDate()).padStart(2, '0')}`;
}

//좌측 채팅 목록 불러오기
export function loadChatRooms() {
    const chatListContainer = document.querySelector('.chat-items');

    fetch(`/chat/rooms`)
        .then(async res => {
            const text = await res.text();
            console.log("[DEBUG] 서버 원본 응답:", text);

            // [추가] 서버가 XML을 던질 경우를 대비한 방어 로직
            if (text.trim().startsWith('<')) {
                console.warn("서버가 XML 데이터를 반환했습니다. JSON 변환을 시도하지 않습니다.");
                return [];
            }

            try {
                return JSON.parse(text);
            } catch (e) {
                console.error("JSON 파싱 실패:", e);
                throw e;
            }
        })
        .then(rooms => {
            console.log("채팅방 데이터:", rooms);
            chatListContainer.innerHTML = "";

            rooms.forEach(room => {
                const item = document.createElement("div");
                item.classList.add("chat-item");
                item.dataset.room_id = room.room_id;
                item.dataset.user_id = room.other_user_id;

                item.innerHTML = `
                    <img src="https://via.placeholder.com/40" alt="유저">
                    <div class="info">
                        <div class="name">${room.other_user_name}</div>
                        <div class="last-msg">
                            ${makePreviewMessage(room.last_msg, room.last_msg_type)}
                        </div>
                    </div>
                    <div class="right">
                        <div class="time">
                            ${formatChatTime(room.last_msg_at || room.created_at)}
                        </div>
                        ${room.unread_count > 0 ? `<div class="badge">${room.unread_count}</div>` : ``}
                    </div>
                `;

                chatListContainer.appendChild(item);

                item.addEventListener('click', () => {

                    chatState.session.currentRoomId = room.room_id;
                    chatState.session.receiverId = room.other_user_id;

                    if (chatState.socket.roomSubscription) chatState.socket.roomSubscription.unsubscribe();
                    subscribeRoom(chatState.session.currentRoomId);

                    document.getElementById("empty-view").style.display = "none";
                    document.getElementById("chat-view").style.display = "flex";

                    const headerName = document.querySelector('.chat-header .name');
                    if (headerName) headerName.innerText = room.other_user_name;

                    loadMessages(chatState.session.currentRoomId, 0, 40, false, true)
                        .then(() => {
                            markAsRead(room.room_id);
                            const badge = item.querySelector(".badge");
                            if (badge) {
                                badge.remove();
                            }

                        });
                });
            });
        })
        .catch(err => console.error("채팅방 목록 로드 실패", err));
}

//채팅방 목록 실시간 업데이트
export function updateRoomListRealtime(msg) {
    console.log("realtime msg =", msg);


    const chatListContainer = document.querySelector('.chat-items');

    // 핵심
    const roomId = String(msg.room_id);

    const isCurrentRoom =
        roomId === String(chatState.session.currentRoomId);

    let item = chatListContainer.querySelector(
        `[data-room_id="${roomId}"]`
    );

    // ===== 채팅방 없으면 새로 생성 =====
    if (!item) {

        item = document.createElement("div");
        item.classList.add("chat-item");
        item.dataset.room_id = roomId;

        const imgSrc = (msg.msg_type === 'IMAGE')
            ? `/chat/files/${msg.content}`
            : `https://via.placeholder.com/40`;

        item.innerHTML = `
        <img src="${imgSrc}" class="chat-thumbnail-list">
        <div class="info">
            <div class="name">${msg.sender_name || "유저"}</div>
            <div class="last-msg">
                ${makePreviewMessage(msg.content, msg.msg_type)}
            </div>
        </div>
    `;
        chatListContainer.prepend(item);
    }

    // 마지막 메시지 갱신 
    const lastMsg = makePreviewMessage(msg.content, msg.msg_type);
    const lastMsgEl = item.querySelector(".last-msg");
    if (lastMsgEl) {
        lastMsgEl.innerText = lastMsg;
    }

    // 시간 갱신
    const timeEl = item.querySelector(".time");
    if (timeEl) {
        timeEl.innerText = formatChatTime(msg.created_at);
    }

    // 현재 보고 있는 채팅방일 시  unread배지 제거
    if (isCurrentRoom) {
        const badge = item.querySelector(".badge");
        if (badge) badge.remove();

        if (chatState.message.roomUnreadGroupMap[roomId]) {
            chatState.message.roomUnreadGroupMap[roomId].clear();
        }
    }

    // unread 카운트
    if (!isCurrentRoom && msg.sender_id !== chatState.session.myUserId) {

        const groupId = msg.group_id || msg.msg_id;
        const roomKey = String(roomId);

        if (!chatState.message.roomUnreadGroupMap[roomKey]) {
            chatState.message.roomUnreadGroupMap[roomKey] = new Set();
        }

        const unreadGroupSet = chatState.message.roomUnreadGroupMap[roomKey];

        // 이미 unread 처리된 그룹이면 무시
        if (unreadGroupSet.has(groupId)) return;

        unreadGroupSet.add(groupId);

        const right = item.querySelector(".right");
        let badge = right.querySelector(".badge");

        if (!badge) {
            badge = document.createElement("div");
            badge.classList.add("badge");
            badge.innerText = "1";
            right.appendChild(badge);
        } else {
            badge.innerText =
                String(parseInt(badge.innerText || "0") + 1);
        }
    }

    // 재정렬 안정화
    if (!isCurrentRoom &&
        chatListContainer.firstElementChild !== item) {
        chatListContainer.prepend(item);
    }

    // unread-only 필터
    const unreadCheckbox = document.getElementById("unread-only");

    if (unreadCheckbox && unreadCheckbox.checked) {
        const badge = item.querySelector(".badge");
        item.style.display = badge ? "flex" : "none";
    } else {
        item.style.display = "flex";
    }

    // 최신 채팅방 위로
    chatListContainer.prepend(item);
}

export function initTabs() {
    const tabAll = document.getElementById('tab-all');
    const tabSearch = document.getElementById('tab-search');
    const searchBox = document.querySelector('.chat-search-box');
    const searchInput = document.getElementById("search-input");

    tabAll.addEventListener('click', () => {
        tabAll.classList.add('active');
        tabSearch.classList.remove('active');
        searchBox.style.display = 'none';

        if (searchInput) searchInput.value = "";

        // 채팅방 전체 다시 표시
        document.querySelectorAll(".chat-item").forEach(item => {
            item.dataset.jump_msg_id = "";
            item.dataset.search_msg_ids = "[]";
        });

        // 검색 하이라이트 제거
        document.querySelectorAll(".highlight-search, .highlight-jump").forEach(el => {
            const box = el.closest(".message-box");
            if (box && box.dataset.original) {
                box.innerText = box.dataset.original;
                delete box.dataset.original;
            } else {
                el.replaceWith(el.innerText); // fallback
            }
        });

        // 검색 상태 초기화
        chatState.search.isSearchMode = false;
        chatState.search.searchMsgIds = [];
        chatState.search.currentSearchIndex = -1;
        chatState.search.currentSearchKeyword = "";
        chatState.scroll.jumpMsgId = null;
        chatState.search.isSearchJump = false;

        updateSearchCounter();
        loadChatRooms();
    });

    tabSearch.addEventListener('click', () => {
        tabSearch.classList.add('active');
        tabAll.classList.remove('active');
        searchBox.style.display = 'flex';
    });
}

export function initUnreadFilter() {
    const unreadCheckbox = document.getElementById("unread-only");
    unreadCheckbox.addEventListener("change", () => {

        const items = document.querySelectorAll(".chat-item");

        items.forEach(item => {

            const badge = item.querySelector(".badge");

            if (unreadCheckbox.checked) {
                // unread 없는 방 숨김
                if (!badge) {
                    item.style.display = "none";
                }
            } else {
                // 전체 다시 표시
                item.style.display = "flex";
            }

        });
    });
}

export function initDropdownMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const menuDropdown = document.getElementById('menuDropdown');

    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        menuDropdown.style.display =
            menuDropdown.style.display === 'flex' ? 'none' : 'flex';
    });

    document.addEventListener('click', () => {
        menuDropdown.style.display = 'none';
    });
}

export function initCharCount() {

    const textarea = document.getElementById("chat-textarea");
    const counter = document.getElementById("char-count");

    if (!textarea || !counter) return;

    const MAX = 1000;

    textarea.addEventListener("input", () => {

        let length = textarea.value.length;

        // 혹시 maxlength 무시되는 상황 대비
        if (length > MAX) {
            textarea.value = textarea.value.slice(0, MAX);
            length = MAX;
        }

        counter.innerText = `${length}/${MAX}`;

    });
}


// ==================== modal =======================
// 모달 & 파일 대기 리스트
// ChatModal.js

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

    function uploadSelectedFiles() {

        currentFiles.forEach(file => {
            const type = currentModalType;
            uploadFile(file, type);
        });
        currentFiles = [];
        renderFileList();
        modal.classList.remove("show");
        document.body.classList.remove("modal-open");
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
}

// 실제 업로드 함수
function uploadFile(file, type) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("room_id", chatState.session.currentRoomId);
    formData.append("msg_type", type);

    fetch(`/chat/rooms/upload`, {
        method: "POST",
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            console.log("[SUCCESS] 파일 업로드 완료:", data);
        })
        .catch(err => console.error("파일 업로드 에러:", err));
}

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

