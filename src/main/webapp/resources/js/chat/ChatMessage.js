import { chatState } from "./ChatState.js";
import { jumpToMessage, updateSearchCounter } from "./ChatSearch.js";
import { loadChatRooms } from "./ChatUI.js";


function createMessageRow(data) {

    const row = document.createElement("div");
    row.dataset.msg_id = data.msg_id;
    console.log(data.msg_type, data);

    const myId = Number(
        new URLSearchParams(location.search).get("testUser_id")
    );

    row.classList.add(
        "message-row",
        data.sender_id === myId ? "sent" : "received"
    );

    return row;
}


// DB에서 기존 메시지 불러오기
export async function loadMessages(room_id) {
    chatState.session.currentRoomId = room_id;
    chatState.loading.isLoadingMessages = true;
    chatState.loading.isInitialLoad = true;
    chatState.message.appendedMsgSet.clear();
    chatState.message.lastSenderId = null;
    chatState.message.lastTimeStr = null;
    chatState.message.lastTimeElement = null;
    chatState.message.rooms[room_id] = chatState.message.rooms[room_id] || {};
    chatState.message.rooms[room_id][chatState.session.myUserId] = chatState.message.rooms[room_id][chatState.session.myUserId] || {
        lastReadMsgId: 0,
        lastUploadGroupId: null,
        lastAppendedData: null,
        lastImageContainer: null,
        lastFileContainer: null
    };
    chatState.message.roomUnreadGroupMap[room_id] = new Set();

    // 마지막 읽은 메시지 먼저 가져오기
    try {
        const resLast = await fetch(`/chat/rooms/${room_id}/last-read?testUser_id=${chatState.session.myUserId}`);
        const { last_read_msg_id } = await resLast.json();
        chatState.message.rooms[room_id][chatState.session.myUserId].lastReadMsgId = last_read_msg_id || 0;
    } catch (err) {
        console.error("마지막 읽은 메시지 가져오기 실패", err);
    }

    // 메시지 목록 가져오기
    try {
        const res = await fetch(`/chat/rooms/${room_id}/messages?testUser_id=${chatState.session.myUserId}`);
        const list = await res.json();

        const container = document.getElementById("messages");
        container.classList.add("loading");
        container.innerHTML = "";
        chatState.message.lastDateKey = null;

        let prevDateStr = null;
        list.forEach((msg, i) => {
            const date = new Date(msg.created_at);
            const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
            const dayOfWeek = days[date.getDay()];

            const dateStr =
                `${date.getFullYear()}년 ${(date.getMonth() + 1).toString().padStart(2, '0')}월 ${date.getDate().toString().padStart(2, '0')}일 ${dayOfWeek}`;
            const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

            msg.showDate = i === 0 || dateStr !== prevDateStr;
            msg.dateStr = dateStr;
            prevDateStr = dateStr;
            chatState.message.lastDateKey = dateStr;
        });

        // appendMessage 실행
        list.forEach(msg => appendMessage(msg, true));

        //  현재 방 read 처리
        if (list.length > 0) {
            const lastMsgId = list[list.length - 1].msg_id; // 마지막 메시지 ID

            await fetch(`/chat/rooms/${room_id}/read`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: chatState.session.myUserId,
                    last_msg_id: lastMsgId
                })
            });

            // 방 상태 업데이트
            chatState.message.rooms[room_id][chatState.session.myUserId].lastReadMsgId = lastMsgId;
            const roomState = chatState.message.rooms[room_id]?.[chatState.session.myUserId];
            if (roomState) {
                roomState.unread = 0;
                roomState.lastAppendedData = null;
                roomState.lastUploadGroupId = null;
                roomState.lastImageContainer = null;
                roomState.lastFileContainer = null;
            }

            const roomEl = document.querySelector(`#room-${room_id} .unread-count`);
            if (roomEl) {
                roomEl.style.display = "none";
                roomEl.innerText = "";
            }

            loadChatRooms();
        }

        // 스크롤 처리
        requestAnimationFrame(() => {

            const container = document.getElementById("messages");

            // 스크롤 먼저 이동
            if (chatState.scroll.jumpMsgId && chatState.search.isSearchJump) {

                jumpToMessage(
                    chatState.scroll.jumpMsgId,
                    chatState.search.currentSearchKeyword
                );

                chatState.search.currentSearchIndex = 0;
                updateSearchCounter();
                chatState.scroll.jumpMsgId = null;
                chatState.search.isSearchJump = false;

            } else {
                container.scrollTop = container.scrollHeight;
            }

            container.classList.remove("loading");//렌더링 후 보여주기

            chatState.loading.isLoadingMessages = false;
            chatState.loading.isInitialLoad = false;
        });

    } catch (err) {
        console.error("메시지 로드 실패", err);
        chatState.loading.isLoadingMessages = false;
    }
}

export function appendMessage(data, isInitialLoad = false) {
    if (!data.msg_id) return;
    const msgId = Number(data.msg_id);
    if (chatState.message.appendedMsgSet.has(msgId)) {
        console.log("중복 메시지 차단", msgId);
        return;
    }
    const container = document.getElementById("messages");

    const { dateStr, timeStr, currentTime } = prepareMessageMeta(data);

    if (!chatState.message.rooms[data.room_id]) {
        chatState.message.rooms[data.room_id] = {};
    }
    if (!chatState.message.rooms[data.room_id][chatState.session.myUserId]) {
        chatState.message.rooms[data.room_id][chatState.session.myUserId] = {
            lastSenderId: null,
            lastUploadGroupId: null,
            lastMessageTime: null,
            lastTimeStr: null,
            lastDateKey: null,
            lastImageContainer: null,
            lastFileContainer: null
        };
    }
    const roomState = chatState.message.rooms[data.room_id][chatState.session.myUserId];

    const box = document.createElement("div");
    box.classList.add("message-box");

    let shouldAppendRow = true;
    const prevData = roomState.lastAppendedData;
    const sameGroup =
        prevData &&
        data.msg_type !== "TEXT" &&
        prevData.msg_type !== "TEXT" &&
        data.upload_group_id &&
        data.upload_group_id === prevData.upload_group_id &&
        data.sender_id === prevData.sender_id;

    // 메시지 타입별 렌더링
    if (data.msg_type === "TEXT") renderText(box, data, roomState);
    else if (data.msg_type === "FILE") shouldAppendRow = renderFile(box, data, sameGroup, roomState);
    else if (data.msg_type === "IMAGE") shouldAppendRow = renderImage(box, data, sameGroup, roomState);

    // 메시지를 새 row로 붙일지 결정
    let row = null;
    if (shouldAppendRow) {

        const prevSender = roomState.lastSenderId;
        const prevTimeStr = roomState.lastTimeStr;

        if (prevSender === data.sender_id && prevTimeStr === timeStr) {
            const lastRow = container.lastElementChild;
            if (lastRow) {
                const prevTimeEl = lastRow.querySelector(".time");
                if (prevTimeEl) {
                    prevTimeEl.remove();
                }
            }
        }

        row = createMessageRow(data);
        row.appendChild(box);

        const timeEl = document.createElement("div");
        timeEl.classList.add("time");
        timeEl.innerText = timeStr;
        row.appendChild(timeEl);

        container.appendChild(row);
    }

    // 메시지 상태 항상 갱신
    roomState.lastUploadGroupId = data.upload_group_id || null;
    roomState.lastSenderId = data.sender_id;
    roomState.lastMessageTime = currentTime;
    roomState.lastTimeStr = timeStr;
    roomState.lastDateKey = dateStr;
    roomState.lastAppendedData = data;
    // appendedMsgSet에 등록
    chatState.message.appendedMsgSet.add(Number(data.msg_id));
    if (!isInitialLoad) {
        handleUnreadCount(data);
    }
}

export async function markAsRead(roomId, msgId = null) {
    const lastMsgId = msgId || chatState.message.lastAppendedData?.msg_id;
    if (!lastMsgId) return;

    console.log("markAsRead 호출", { roomId, lastMsgId });


    await fetch(`/chat/rooms/${roomId}/read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_id: chatState.session.myUserId,
            last_msg_id: lastMsgId
        })
    });

    // 프론트 상태 갱신
    chatState.message.rooms[roomId][chatState.session.myUserId].lastReadMsgId = lastMsgId;

    const badge = document.querySelector(`#room-${roomId} .unread-count`);
    if (badge) {
        badge.style.display = "none";
        badge.innerText = "";
    }
}

export function sendMessage() {

    document.querySelector(".btn-send").addEventListener("click", async () => {

        const textarea = document.getElementById("chat-textarea");
        const content = textarea.value.trim();

        if (!content || !chatState.session.receiverId) return;

        const params = new URLSearchParams({
            receiver_id: chatState.session.receiverId,
            testUser_id: chatState.session.myUserId,
            content: content
        });

        const res = await fetch("/chat/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: params
        });

        textarea.value = "";
        const roomId = chatState.session.currentRoomId;
        markAsRead(roomId);
    });
}

function prepareMessageMeta(data) {

    const date = new Date(data.created_at);

    const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    const dayOfWeek = days[date.getDay()];

    const dateStr =
        `${date.getFullYear()}년 ${(date.getMonth() + 1).toString().padStart(2, '0')}월 ${date.getDate().toString().padStart(2, '0')}일 ${dayOfWeek}`;

    const timeStr =
        `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

    const currentTime = date.getTime();

    let sameGroup = false;

    return { dateStr, timeStr, currentTime };
}

function renderText(box, data, roomState) {
    const textContainer = document.createElement("div");
    textContainer.classList.add("text-content");

    // \n을 <br>로 변환해서 줄바꿈 통제
    textContainer.textContent = data.content;

    box.appendChild(textContainer);

    roomState.imageGroupBox = null;
    roomState.fileGroupBox = null;
    roomState.lastImageContainer = null;
    roomState.lastFileContainer = null;
}

function renderFile(box, data, sameGroup, roomState) {
    const link = document.createElement("a");
    link.href = `/chat/files/${data.saved_name}`;
    link.download = data.original_name;
    link.classList.add("file-link");
    link.innerText = `📎 ${data.original_name}`;

    let fileContainer;
    const lastFileContainer = roomState.lastFileContainer;
    if (sameGroup && lastFileContainer) {
        fileContainer = lastFileContainer;
        fileContainer.appendChild(link);
    } else {
        fileContainer = document.createElement("div");
        fileContainer.classList.add("file-container");
        fileContainer.style.width = "100%";
        fileContainer.appendChild(link);
        box.appendChild(fileContainer);
        roomState.lastFileContainer = fileContainer;
    }

    roomState.lastMessageTime = new Date(data.created_at).getTime();

    return !sameGroup;
}

function renderImage(box, data, sameGroup, roomState) {
    const img = document.createElement("img");
    img.src = `/chat/files/${encodeURIComponent(data.saved_name)}`;
    img.classList.add("chat-thumbnail");

    const currentTime = new Date(data.created_at).getTime();

    let imageContainer;
    const lastImageContainer = roomState.lastImageContainer;
    if (sameGroup && lastImageContainer) {
        imageContainer = lastImageContainer;
        imageContainer.appendChild(img);
    } else {
        imageContainer = document.createElement("div");
        imageContainer.classList.add("image-container");
        imageContainer.appendChild(img);
        box.appendChild(imageContainer);
        roomState.lastImageContainer = imageContainer;
    }

    roomState.lastMessageTime = currentTime;

    updateImageLayout(imageContainer);
    return !sameGroup;
}

// 그룹 안 이미지 개수에 따라 레이아웃 적용
function updateImageLayout(container) {
    const images = container.querySelectorAll("img");
    if (images.length === 1) {
        // 한 장이면 폭 좁게
        container.style.display = "block";
        container.style.width = "180px";
        container.style.gap = "0";
        images[0].style.width = "100%";
        images[0].style.height = "auto";
    } else {
        // 2장 이상이면 2열 grid
        container.style.display = "grid";
        container.style.gridTemplateColumns = "repeat(2, 1fr)";
        container.style.gap = "4px";
        container.style.width = "260px";
        images.forEach(img => {
            img.style.width = "100%";
            img.style.height = "auto";
            img.style.objectFit = "cover";
        });
    }
}

// unread 처리
function handleUnreadCount(data) {

    if (!chatState.session.currentRoomId) return;
    const myId = chatState.session.myUserId;
    const currentRoomId = chatState.session.currentRoomId;

    if (data.sender_id === myId) return;
    if (data.room_id === currentRoomId) return;

    const roomState =
        chatState.message.rooms?.[data.room_id]?.[myId];

    if (!roomState) return;

    if (data.msg_id <= roomState.lastReadMsgId) return;

    const badge =
        document.querySelector(`#room-${data.room_id} .unread-count`);

    if (!badge) return;

    const count = Number(badge.innerText || 0) + 1;
    badge.innerText = count;
    badge.style.display = "flex";
}