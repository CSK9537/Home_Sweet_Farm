import { chatState } from "./ChatState.js";
import { jumpToMessage, updateSearchCounter } from "./ChatSearch.js";
import { loadChatRooms } from "./ChatUI.js";


function createMessageRow(data) {
    const row = document.createElement("div");
    row.dataset.msg_id = data.msg_id;

    const myId = chatState.session.myUserId;
    row.classList.add("message-row", "message", data.sender_id === myId ? "sent" : "received");

    return row;
}

// DB에서 기존 메시지 불러오기
export async function loadMessages(room_id, offset = 0, size = 40, prepend = false, firstLoad = false) {
    chatState.loading.isLoadingMessages = true;
    const container = document.getElementById("messages");

    if (!chatState.message.rooms[room_id]) chatState.message.rooms[room_id] = {};
    if (!chatState.message.rooms[room_id][chatState.session.myUserId]) {
        chatState.message.rooms[room_id][chatState.session.myUserId] = {
            lastReadMsgId: 0,
            lastGroupId: null,
            lastAppendedData: null,
            lastImageContainer: null,
            lastFileContainer: null,
            appendedMsgSet: new Set(),
            hasMore: true,
            loadedCount: 0
        };
    }
    const roomState = chatState.message.rooms[room_id][chatState.session.myUserId];

    if (firstLoad) {
        container.innerHTML = "";
        roomState.appendedMsgSet.clear();
        roomState.loadedCount = 0;
        roomState.hasMore = true;
        roomState.lastAppendedData = null;
        offset = 0;
    }

    try {
        const res = await fetch(`/chat/rooms/${room_id}/messages?offset=${offset}&size=${size}`);
        const list = await res.json();

        if (!list || list.length === 0) {
            roomState.hasMore = false;
            return;
        }
        roomState.loadedCount += list.length;

        const fragment = document.createDocumentFragment();
        const prevScrollTop = container.scrollTop;
        const prevScrollHeight = container.scrollHeight;

        list.forEach(msg => appendMessage(msg, prepend, fragment));

        if (prepend) {
            container.prepend(fragment);
            container.scrollTop = prevScrollTop + (container.scrollHeight - prevScrollHeight);
        } else {
            container.appendChild(fragment);
            if (firstLoad || isScrollBottom()) {
                container.scrollTop = container.scrollHeight;
            }
        }
    } catch (err) {
        console.error("메시지 로드 실패", err);
    } finally {
        chatState.loading.isLoadingMessages = false;
    }
}

export function appendMessage(data, prepend = false, fragment = null) {
    if (!data.msg_id) return;

    const roomId = data.room_id;
    const myId = chatState.session.myUserId;

    if (!chatState.message.rooms[roomId]) chatState.message.rooms[roomId] = {};
    if (!chatState.message.rooms[roomId][myId]) {
        chatState.message.rooms[roomId][myId] = {
            lastSenderId: null,
            lastGroupId: null,
            lastMessageTime: null,
            lastTimeStr: null,
            lastDateKey: null,
            lastImageContainer: null,
            lastFileContainer: null,
            lastAppendedData: null,
            appendedMsgSet: new Set()
        };
    }

    const roomState = chatState.message.rooms[roomId][myId];
    const msgId = Number(data.msg_id);
    const container = document.getElementById("messages");

    if (prepend && !roomState.lastAppendedData) {
        const firstRow = container.querySelector(".message-row");
        if (firstRow) {
            const firstMsgId = Number(firstRow.dataset.msg_id);
            const existingData = {
                msg_id: firstMsgId,
                group_id: firstRow.querySelector(".time")?.innerText.match(/\(#(\d+)\)/)?.[1],
                sender_id: firstRow.classList.contains("sent")
                    ? chatState.session.myUserId
                    : null
            };
            roomState.lastAppendedData = existingData;
        }
    }

    if (prepend) {
        if (roomState.appendedMsgSet.has(msgId) || container.querySelector(`[data-msg_id='${msgId}']`)) {
            console.log("중복 메시지 차단 (DOM + Set 기준, prepend)", msgId);
            return;
        }
    } else {
        // 새 메시지 append 시
        if (roomState.appendedMsgSet.has(msgId) || container.querySelector(`[data-msg_id='${msgId}']`)) {
            console.log("중복 메시지 차단 (DOM + Set 기준, append)", msgId);
            return;
        }
    }

    const { dateStr, timeStr, currentTime } = prepareMessageMeta(data);
    const box = document.createElement("div");
    box.classList.add("message-box");

    const prevData = roomState.lastAppendedData;
    const sameGroup = prevData &&
        data.msg_type !== "TEXT" &&
        prevData.msg_type !== "TEXT" &&
        data.group_id &&
        data.group_id === prevData.group_id &&
        data.sender_id === prevData.sender_id;

    let shouldAppendRow = true;
    if (data.msg_type === "TEXT") renderText(box, data, roomState);
    else if (data.msg_type === "FILE") shouldAppendRow = renderFile(box, data, sameGroup, roomState);
    else if (data.msg_type === "IMAGE") shouldAppendRow = renderImage(box, data, sameGroup, roomState);

    if (shouldAppendRow) {
        const row = createMessageRow(data);
        row.appendChild(box);

        const timeEl = document.createElement("div");
        timeEl.classList.add("time");
        timeEl.innerText = `${timeStr} (#${data.group_id})`;
        row.appendChild(timeEl);

        if (fragment) fragment.appendChild(row);
        else if (prepend) container.prepend(row);
        else container.appendChild(row);

        roomState.appendedMsgSet.add(msgId);
    }

    // 상태 갱신
    roomState.lastGroupId = data.group_id || null;
    roomState.lastSenderId = data.sender_id;
    roomState.lastMessageTime = currentTime;
    roomState.lastTimeStr = timeStr;
    roomState.lastDateKey = dateStr;
    roomState.lastAppendedData = data;
}

export async function markAsRead(roomId, msgId = null) {
    const lastMsgId = msgId || chatState.message.rooms[roomId]?.[chatState.session.myUserId]?.lastAppendedData?.msg_id;
    
    console.log("[DEBUG] markAsRead 호출:", { roomId, lastMsgId });

    try {
        await fetch(`/chat/rooms/${roomId}/read`, {
            method: "POST"
        });

        if (chatState.message.rooms[roomId]?.[chatState.session.myUserId]) {
            chatState.message.rooms[roomId][chatState.session.myUserId].lastReadMsgId = lastMsgId;
        }

        const roomItem = document.querySelector(`.chat-item[data-room_id="${roomId}"]`);
        if (roomItem) {
            const badge = roomItem.querySelector(".badge");
            if (badge) {
                badge.remove();
            }
        }
    } catch (err) {
        console.error("읽음 처리 실패:", err);
    }
}

export function sendMessage() {
    const sendBtn = document.querySelector(".btn-send");
    if (!sendBtn) return;

    sendBtn.addEventListener("click", async () => {
        const textarea = document.getElementById("chat-textarea");
        const content = textarea.value.trim();

        if (!content || !chatState.session.receiverId) return;

        const params = new URLSearchParams({
            receiver_id: chatState.session.receiverId,
            content: content
        });

        const res = await fetch("/chat/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: params
        });

        if (res.ok) {
            textarea.value = "";
            const roomId = chatState.session.currentRoomId;
            markAsRead(roomId);
        }
    });
}

function prepareMessageMeta(data) {

    const date = new Date(data.created_at);
    const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    const dayOfWeek = days[date.getDay()];

    const dateStr = `${date.getFullYear()}년 ${(date.getMonth() + 1).toString().padStart(2, '0')}월 ${date.getDate().toString().padStart(2, '0')}일 ${dayOfWeek}`;
    const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    const currentTime = date.getTime();

    return { dateStr, timeStr, currentTime };
}

function renderText(box, data, roomState) {
    const textContainer = document.createElement("div");
    textContainer.classList.add("text-content");
    textContainer.textContent = data.content;
    box.appendChild(textContainer);

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

    let imageContainer;

    if (sameGroup && roomState.lastImageContainer) {
        imageContainer = roomState.lastImageContainer;
        imageContainer.appendChild(img);
        imageContainer.classList.remove("single-image");
        imageContainer.classList.add("multi-image");
    } else {
        imageContainer = document.createElement("div");
        imageContainer.classList.add("image-grid", "single-image");
        box.appendChild(imageContainer);
        imageContainer.appendChild(img);
        roomState.lastImageContainer = imageContainer;
    }

    return !sameGroup;
}

// 그룹 안 이미지 개수에 따라 레이아웃 적용
function updateImageLayout(container) {
    const images = container.querySelectorAll("img");

    // 레이아웃 적용
    if (images.length === 1) {
        container.style.display = "block";
        container.style.width = "180px";
        container.style.gap = "0";
        images[0].style.width = "100%";
        images[0].style.height = "auto";
    } else if (images.length > 1) {
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
    container.classList.remove("loading");
}
