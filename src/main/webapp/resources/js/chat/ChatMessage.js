import { chatState } from "./ChatState.js";
import { jumpToMessage, updateSearchCounter } from "./ChatSearch.js";

// DB에서 기존 메시지 불러오기
export function loadMessages(room_id) {
    chatState.loading.isLoadingMessages = true;
    chatState.message.appendedMsgSet.clear();
    chatState.message.lastSenderId = null;
    chatState.message.lastTimeStr = null;
    chatState.message.lastTimeElement = null;

    fetch(`/chat/rooms/${room_id}/messages?testUser_id=${chatState.session.myUserId}`)
        .then(res => res.json())
        .then(list => {
            console.log("🔥 서버에서 받은 메시지 목록", list);
            const container = document.getElementById("messages");
            container.innerHTML = ""; // 기존 내용 초기화
            chatState.message.lastDateKey = null;

            let prevSenderId = null;
            let prevTimeStr = null;
            let prevDateStr = null;


            for (let i = 0; i < list.length; i++) {

                const msg = list[i];

                const date = new Date(msg.created_at);
                const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
                const dayOfWeek = days[date.getDay()];

                const dateStr =
                    `${date.getFullYear()}년 ${(date.getMonth() + 1).toString().padStart(2, '0')}월 ${date.getDate().toString().padStart(2, '0')}일 ${dayOfWeek}`;

                const timeStr =
                    `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

                const next = list[i + 1];

                let nextTimeStr = null;

                if (next) {
                    const nd = new Date(next.created_at);

                    nextTimeStr =
                        `${nd.getHours().toString().padStart(2, '0')}:${nd.getMinutes().toString().padStart(2, '0')}`;
                }


                msg.showTime = !next ||
                    !(msg.sender_id === next.sender_id && timeStr === nextTimeStr);

                msg.showDate = (i === 0 || dateStr !== prevDateStr);
                msg.dateStr = dateStr;
                prevDateStr = dateStr;
                chatState.message.lastDateKey = dateStr;
            }


            // appendMessage 호출
            list.forEach(msg => {
                if (!chatState.message.appendedMsgSet.has(msg.msg_id)) {
                    appendMessage(msg);
                }
            });
            if (list.length > 0) {
                chatState.message.lastDateKey = list[list.length - 1].dateStr;
            }

            // 검색 시 해당 메세지로 점프
            // 메시지 append 완료 후
            requestAnimationFrame(() => {
                const container = document.getElementById("messages");

                if (chatState.scroll.jumpMsgId && chatState.search.isSearchJump) {
                    jumpToMessage(chatState.scroll.jumpMsgId, chatState.search.currentSearchKeyword);
                    chatState.search.currentSearchIndex = 0;
                    updateSearchCounter();
                    chatState.scroll.jumpMsgId = null;
                    chatState.search.isSearchJump = false;
                } else {
                    // 일반 메시지 로드 후 맨 아래로
                    container.scrollTop = container.scrollHeight;
                }

                chatState.loading.isLoadingMessages = false;
            });


        })
        .catch(err => {
            console.error("메시지 로드 실패", err);
            chatState.loading.isLoadingMessages = false;
        });
}

export function appendMessage(data) {
    if (!data.msg_id) return;

    const container = document.getElementById("messages");
    const { dateStr, timeStr, currentTime, sameGroup } = prepareMessageMeta(data);

    const box = document.createElement("div");
    box.classList.add("message-box");

    let shouldAppendRow = true;

    // 메시지 타입별 렌더링
    if (data.msg_type === "TEXT") renderText(box, data);
    else if (data.msg_type === "FILE") renderFile(box, data);
    else if (data.msg_type === "IMAGE") shouldAppendRow = renderImage(box, data, sameGroup);

    // 메시지를 새 row로 붙일지 결정
    let row = null;
    if (shouldAppendRow) {
        row = createMessageRow(data);
        row.appendChild(box);

        const timeEl = document.createElement("div");
        timeEl.classList.add("time");
        timeEl.innerText = timeStr;
        row.appendChild(timeEl);

        container.appendChild(row);
    } else {
        // 같은 그룹 이미지라면 기존 imageGroupBox에 append만
        chatState.message.lastMessageTime = currentTime;
    }

    // 메시지 상태 항상 갱신
    chatState.message.lastSenderId = data.sender_id;
    chatState.message.lastTimeStr = timeStr;
    chatState.message.lastDateKey = dateStr;
    chatState.message.lastMessageTime = currentTime;

    // appendedMsgSet에 등록
    chatState.message.appendedMsgSet.add(Number(data.msg_id));
}

// function markAsReadSafe() {

// if (!chatState.session.currentRoomId) return;

// // 이미 예약된 read 있으면 무시
// if (chatState.read.readTimer) return;

// chatState.read.readTimer = setTimeout(() => {

// fetch(`/chat/rooms/${chatState.session.currentRoomId}/read?user_id=${chatState.session.myUserId}`,
// {
// method: "POST"
// });

// chatState.read.readTimer = null;

// }, 500); // 0.5초동안 메시지 모아서 한번만 호출
// }

export function sendMessage() {

    document.querySelector(".btn-send").addEventListener("click", async () => {

        const textarea = document.getElementById("chat-textarea");
        const content = textarea.value.trim();

        if (!content) return;
        if (!chatState.session.receiverId) return;

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

    if (
        chatState.message.lastSenderId === data.sender_id &&
        chatState.message.lastMessageTime
    ) {
        const diff = currentTime - chatState.message.lastMessageTime;

        sameGroup =
            diff < 10000 &&
            timeStr === chatState.message.lastTimeStr;
    }

    return { dateStr, timeStr, currentTime, sameGroup };
}

function createMessageRow(data) {

    const row = document.createElement("div");
    row.dataset.msg_id = data.msg_id;

    row.classList.add(
        "message-row",
        data.sender_id === chatState.session.myUserId
            ? "sent"
            : "received"
    );

    return row;
}

function renderText(box, data) {
    box.innerText = data.content;
    chatState.message.imageGroupBox = null;
}

function renderFile(box, data) {

    const fileUrl = `/chat/files/${data.saved_name}`;

    box.innerHTML = `
        <a href="${fileUrl}" download="${data.original_name}" class="file-link">
            📎 ${data.original_name}
        </a>
    `;

    chatState.message.imageGroupBox = null;
}

function renderImage(box, data, sameGroup) {
    const img = document.createElement("img");
    img.src = `/chat/files/${encodeURIComponent(data.saved_name)}`;
    img.classList.add("chat-thumbnail");

    img.onclick = () => openImageModal(img.src);

    const currentTime = new Date(data.created_at).getTime();

    if (sameGroup && chatState.message.imageGroupBox) {
        chatState.message.imageGroupBox.appendChild(img);
        chatState.message.lastMessageTime = currentTime;
        return false;
    }

    let imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container");
    imageContainer.appendChild(img);
    box.appendChild(imageContainer);

    // ✅ 이미지 하나일 때 말풍선 너비 줄이기
    if (box.querySelectorAll(".chat-thumbnail").length === 1) {
        box.style.maxWidth = "180px"; // 원하는 너비
    } else {
        box.style.maxWidth = "280px"; // 기본 최대 너비
    }

    chatState.message.imageGroupBox = imageContainer;
    chatState.message.lastMessageTime = currentTime;

    return true;
}