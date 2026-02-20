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

    const msgIdNum = Number(data.msg_id); // 🔹 숫자로 통일
    if (chatState.message.appendedMsgSet.has(msgIdNum)) return;
    chatState.message.appendedMsgSet.add(msgIdNum);


    const container = document.getElementById("messages");
    const date = new Date(data.created_at);


    if (isNaN(date.getTime())) {
        return;
    }


    const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    const dayOfWeek = days[date.getDay()];

    const dateStr =
        `${date.getFullYear()}년 ${(date.getMonth() + 1).toString().padStart(2, '0')}월 ${date.getDate().toString().padStart(2, '0')}일 ${dayOfWeek}`;

    const timeStr =
        `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

    if (data.showDate === undefined) {
        data.showDate = (dateStr !== chatState.message.lastDateKey);
        data.dateStr = dateStr;
    }

    // 시간이 같은 메세지들끼리 그룹으로 묶기
    const sameGroup =
        (data.sender_id === chatState.message.lastSenderId && timeStr === chatState.message.lastTimeStr);

    // 같은 그룹이면 이전 메시지 시간 제거
    if (sameGroup && chatState.message.lastTimeElement) {
        chatState.message.lastTimeElement.innerText = "";
    }

    if (data.showTime === undefined) {
        data.showTime = !(data.sender_id === chatState.message.lastSenderId && timeStr === chatState.message.lastTimeStr);
    }

    // 날짜 표시
    if (data.showDate) {
        const dateDiv = document.createElement("div");
        dateDiv.classList.add("chat-date");
        dateDiv.innerText = data.dateStr;
        container.appendChild(dateDiv);
    }

    const row = document.createElement("div");
    row.dataset.msg_id = data.msg_id;
    row.classList.add("message-row");
    row.classList.add(data.sender_id === chatState.session.myUserId ? "sent" : "received");

    // 상대 프로필
    if (data.sender_id !== chatState.session.myUserId && data.sender_id !== chatState.message.lastSenderId) {
        const profile = document.createElement("div");
        profile.classList.add("profile");
        const img = document.createElement("img");
        img.src = "https://via.placeholder.com/40";
        profile.appendChild(img);
        row.appendChild(profile);
    }

    // 메시지 박스
    const box = document.createElement("div");
    box.classList.add("message-box");

    if (data.msg_type === "TEXT") {
        box.innerText = data.content;
    } else if (data.msg_type === "FILE") {
        box.innerHTML = `<a href="${data.file_path}" target="_blank">${data.original_name}</a>`;
    } else if (data.msg_type === "IMAGE") {
        box.innerHTML = `<img src="/chat/files/${encodeURIComponent(data.saved_name)}" class="chat-img" />`;
    }
    row.appendChild(box);

    // 시간 표시
    const time = document.createElement("div");
    time.classList.add("time");
    time.innerText = timeStr;
    row.appendChild(time);

    container.appendChild(row);

    chatState.message.lastSenderId = data.sender_id;
    chatState.message.lastTimeStr = timeStr;
    chatState.message.lastTimeElement = time;
    chatState.message.lastDateKey = dateStr;
}

// function markAsReadSafe() {

//     if (!chatState.session.currentRoomId) return;

//     // 이미 예약된 read 있으면 무시
//     if (chatState.read.readTimer) return;

//     chatState.read.readTimer = setTimeout(() => {

//         fetch(`/chat/rooms/${chatState.session.currentRoomId}/read?user_id=${chatState.session.myUserId}`, {
//             method: "POST"
//         });

//         chatState.read.readTimer = null;

//     }, 500); // 0.5초동안 메시지 모아서 한번만 호출
// }

export function sendMessage() {
    document.querySelector(".btn-send").addEventListener("click", () => {

        const textarea = document.getElementById("chat-textarea");
        const content = textarea.value;

        if (!content.trim()) return;
        if (!chatState.session.currentRoomId) return;
        if (!chatState.socket.stompClient || !chatState.socket.stompClient.connected) return;

        const payload = {
            roomId: chatState.session.currentRoomId,
            senderId: chatState.session.myUserId,
            receiverId: chatState.session.receiverId,
            content: content
        };

        console.log("SENDING PAYLOAD:", payload);
        chatState.socket.stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(payload));

        textarea.value = "";
    });
}

/*export function uploadImage() {
    // 기존 sendMessage() 끝나고 아래쪽
    // ----------------------
    // 이미지 첨부 버튼 클릭 → 파일 선택 창 열기
    document.querySelector(".btn-image").addEventListener("click", () => {
        document.getElementById("imageInput").click();
    });

    // 파일 선택 후 업로드
    document.getElementById("imageInput").addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("room_id", chatState.session.currentRoomId);
        formData.append("msg_type", "IMAGE");

        try {
            const res = await fetch("/chat/rooms/upload", {
                method: "POST",
                body: formData
            });
            console.log(res.status, res.headers.get("content-type"));
            if (!res.ok) {
                // HTTP 에러 또는 HTML 페이지 반환 시
                const text = await res.text();
                console.error("서버 에러:", text); // HTML 내용 확인 가능
                return;
            }
            const msg = await res.json();
            console.log("msg" + msg);

            appendMessage(msg); // 메시지 DOM에 바로 추가
            // WebSocket으로 전송도 필요하면 stompClient.send(...)
        } catch (err) {
            console.error("이미지 업로드 실패", err);
        }

        event.target.value = "";
    });

}*/