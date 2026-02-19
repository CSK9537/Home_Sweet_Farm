import { chatState } from "./ChatState.js";
import { loadMessages } from "./ChatMessage.js";
import { subscribeRoom } from "./ChatWebSocket.js";
import { updateSearchCounter } from "./ChatSearch.js";

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
                    ${room.unread_count > 0 ? `<div class="badge">${room.unread_count}</div>` : ``}
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
    const isCurrentRoom = (msg.room_id === chatState.session.currentRoomId);
    const item = chatListContainer.querySelector(
        `[data-room_id="${msg.room_id}"]`
    );


    if (!item) {
        // 새 방이면 그냥 목록 다시 로드
        loadChatRooms();
        return;
    }

    // 마지막 메시지 업데이트
    const lastMsg = item.querySelector(".last-msg");
    if (lastMsg) {
        lastMsg.innerText = msg.content;
    }

    // unread 증가
    if (!isCurrentRoom && msg.sender_id !== chatState.session.myUserId) {
        let badge = item.querySelector(".badge");

        if (!badge) {
            badge = document.createElement("div");
            badge.classList.add("badge");
            badge.innerText = "1";
            item.appendChild(badge);
        } else {
            badge.innerText = parseInt(badge.innerText) + 1;
        }
    }

    const unreadCheckbox = document.getElementById("unread-only");
    if (unreadCheckbox.checked) {
        item.style.display = "flex";
    }
    //  채팅방 맨 위로 이동
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
    const fileInput = document.getElementById("fileInput");

    // 이미지 버튼
    btnImage.addEventListener("click", () => {
        imageInput.click();
    });

    // 파일 버튼
    btnFile.addEventListener("click", () => {
        fileInput.click();
    });

    imageInput.addEventListener("change", () => {
        uploadFile(imageInput.files[0], "IMAGE");
    });

    fileInput.addEventListener("change", () => {
        uploadFile(fileInput.files[0], "FILE");
    });

}

function uploadFile(file, type) {

    if (!file) return;

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
    .then(msg => {
        console.log("업로드 성공", msg);
    })
    .catch(err => console.error(err));
}


