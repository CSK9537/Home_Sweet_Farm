import { chatState } from "./ChatState.js";
import { loadMessages } from "./ChatMessage.js";
import { subscribeRoom } from "./ChatWebSocket.js";
import { updateSearchCounter } from "./ChatSearch.js";

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

    fetch(`/chat/rooms?testUser_id=${chatState.session.myUserId}`)
        .then(res => res.json())
        .then(rooms => {
            console.log("채팅방 데이터:", rooms);
            chatListContainer.innerHTML = ""; // 기존 내용 초기화

            rooms.forEach(room => {
                const item = document.createElement("div");
                item.classList.add("chat-item");
                item.dataset.room_id = room.room_id;
                item.dataset.user_id = room.other_user_id;

                item.innerHTML = `
            <img src="https://via.placeholder.com/40" alt="유저">
            <div class="info">
            <div class="name">${room.other_user_name}</div>
            <div class="last-msg">${room.last_msg || ''}</div>
            </div>
            <div class="right">
                <div class="time">
                    ${formatChatTime(room.created_at)}
                </div>
                ${room.unread_count > 0 ? `<div class="badge">${room.unread_count}</div>` : ``}
            </div>
            `;

                chatListContainer.appendChild(item);

                // 클릭 이벤트
                item.addEventListener('click', () => {
                    chatState.scroll.jumpMsgId = item.dataset.jump_msg_id && item.dataset.jump_msg_id.trim() !== ""
                        ? Number(item.dataset.jump_msg_id)
                        : null;
                    chatState.search.isSearchJump = chatState.scroll.jumpMsgId !== null;

                    // 검색어 배열 적용
                    if (item.dataset.search_msg_ids) {
                        chatState.search.searchMsgIds = JSON.parse(item.dataset.search_msg_ids);
                    } else {
                        chatState.search.searchMsgIds = [];
                    }
                    chatState.search.currentSearchIndex = -1;
                    updateSearchCounter();

                    console.log("jumpMsgId =", chatState.scroll.jumpMsgId); // test

                    if (chatState.session.currentRoomId === room.room_id && !chatState.search.isSearchJump) return;
                    if (!chatState.socket.stompClient || !chatState.socket.stompClient.connected) return;

                    chatState.session.currentRoomId = room.room_id;
                    chatState.session.receiverId = room.other_user_id;

                    // 기존 구독 끊기
                    if (chatState.socket.roomSubscription) chatState.socket.roomSubscription.unsubscribe();
                    // 새 방 구독
                    subscribeRoom(chatState.session.currentRoomId);

                    // 화면 전환
                    document.getElementById("empty-view").style.display = "none";
                    document.getElementById("chat-view").style.display = "flex";

                    // 헤더 업데이트
                    const headerName = document.querySelector('.chat-header .name');
                    const headerImg = document.querySelector('.chat-header img');
                    const headerRole = document.querySelector('.chat-header .role');

                    if (headerName) headerName.innerText = room.other_user_name;
                    if (headerImg) headerImg.src = "https://via.placeholder.com/40"; // 나중에 실제 이미지 적용
                    if (headerRole) headerRole.innerText = "전문가"; // 나중에 role 정보 적용

                    // 메시지 로드
                    loadMessages(chatState.session.currentRoomId);
                    fetch(`/chat/rooms/${chatState.session.currentRoomId}/read?testUser_id=${chatState.session.myUserId}`, {
                        method: "POST"
                    });
                    const badge = item.querySelector(".badge");
                    if (badge) badge.remove();
                    const unreadCheckbox = document.getElementById("unread-only");
                    if (unreadCheckbox.checked) item.style.display = "none";
                });
            });
        })
        .catch(err => console.error("채팅방 목록 로드 실패", err));
}

//채팅방 목록 실시간 업데이트
export function updateRoomListRealtime(msg) {

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

        item.innerHTML = `
            <img src="https://via.placeholder.com/40">
            <div class="info">
                <div class="name">${msg.sender_name || "유저"}</div>
                <div class="last-msg">${msg.content || ""}</div>
            </div>
        `;

        chatListContainer.prepend(item);
    }

    // 마지막 메시지 갱신 
    const lastMsg = item.querySelector(".last-msg");
    if (lastMsg) {
        lastMsg.innerText = msg.content || "";
    }

    // 시간 갱신
    const timeEl = item.querySelector(".time");
    if (timeEl) {
        timeEl.innerText = formatChatTime(msg.created_at);
    }

    // unread 카운트
    if (!isCurrentRoom && msg.sender_id !== chatState.session.myUserId) {
        const right = item.querySelector(".right")
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

export function initUploadFile() {
    const btnImage = document.querySelector(".btn-image");
    const btnFile = document.querySelector(".btn-file");

    const imageInput = document.getElementById("imageInput");
    if (imageInput.dataset.bound) return;
    imageInput.dataset.bound = "true";
    const fileInput = document.getElementById("fileInput");

    // 이미지 버튼
    btnImage.addEventListener("click", () => {
        imageInput.click();
    });

    // 파일 버튼
    btnFile.addEventListener("click", () => {
        fileInput.click();
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
        currentFiles.forEach((file, idx) => {
            const div = document.createElement("div");
            div.innerText = file.name;

            const removeBtn = document.createElement("button");
            removeBtn.innerText = "삭제";
            removeBtn.addEventListener("click", () => {
                currentFiles.splice(idx, 1);
                renderFileList();
            });

            div.appendChild(removeBtn);
            container.appendChild(div);
        });

        uploadBtn.disabled = currentFiles.length === 0;
        uploadBtn.style.background = currentFiles.length === 0 ? "gray" : "#4CAF50";
    }

    function handleFileSelect(files) {
        currentFiles = [...currentFiles, ...Array.from(files)];
        renderFileList();
        modal.classList.add("show");
        document.body.classList.add("modal-open");
        imageInput.value = "";
        fileInput.value = "";
    }

    function uploadSelectedFiles() {
        currentFiles.forEach(file => {
            const type = file.type.startsWith("image/") ? "IMAGE" : "FILE";
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
            modalTitle.innerText = currentModalType === "IMAGE"? "이미지 첨부" : "파일 첨부";
            currentFiles = [];
            renderFileList();

            modal.classList.add("show");
            document.body.classList.add("modal-open");
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
}

// 실제 업로드 함수
function uploadFile(file, type) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("sender_id", chatState.session.myUserId);
    formData.append("receiver_id", chatState.session.receiverId);
    formData.append("room_id", chatState.session.currentRoomId);
    formData.append("msg_type", type);

    fetch("/chat/rooms/upload", {
        method: "POST",
        body: formData
    })
        .then(res => res.json())
        .then(msg => console.log("업로드 성공", msg))
        .catch(err => console.error(err));
}

export function initImagePreviewModal() {
    const modal = document.getElementById("imagePreviewModal");
    const previewImg = document.getElementById("previewImage");
    const closeBtn = document.getElementById("closeImageModal");

    // 이미지 클릭 시
    document.addEventListener("click", (e) => {
        if (e.target.tagName === "IMG" && e.target.classList.contains("chat-thumbnail")) {
            previewImg.src = e.target.src;
            modal.classList.add("show");
            document.body.classList.add("modal-open");
        }
    });

    // 모달 닫기
    closeBtn.addEventListener("click", () => {
        modal.classList.remove("show");
        document.body.classList.remove("modal-open");
        previewImg.src = "";
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