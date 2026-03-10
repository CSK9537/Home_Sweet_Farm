import { chatState } from "./ChatState.js";
import { isScrollBottom } from "./ChatScroll.js";
import { updateRoomListRealtime } from "./ChatUI.js";


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
    if (prepend && !roomState.hasMore) {
        chatState.loading.isLoadingMessages = false;
        return;
    }

    if (firstLoad) {
        roomState.appendedMsgSet.clear();
        roomState.loadedCount = 0;
        roomState.hasMore = true;
        roomState.lastAppendedData = null;
        offset = 0;
    }

    try {
        const res = await fetch(`/chat/rooms/${room_id}/messages?offset=${offset}&size=${size}`);
        const list = await res.json();

        if (!list || list.length < size) {
            roomState.hasMore = false;
        }

        if (!list || list.length === 0) { return; }

        list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        roomState.loadedCount += list.length;

        const fragment = document.createDocumentFragment();
        if (prepend) {
            const firstDateBox = container.querySelector(".chat-date-box");
            const newestMsgInListMeta = prepareMessageMeta(list[list.length - 1]);

            if (firstDateBox && firstDateBox.textContent === newestMsgInListMeta.dateStr) {
                firstDateBox.remove();
            }
        }

        let lastInBatchDate = null;
        list.forEach(msg => {
            const { dateStr } = prepareMessageMeta(msg);

            if (lastInBatchDate !== dateStr) {
                const dateBox = document.createElement("div");
                dateBox.className = "chat-date-box";
                dateBox.textContent = dateStr;
                fragment.appendChild(dateBox);
                lastInBatchDate = dateStr;
            }

            appendMessage(msg, prepend, fragment);
        });

        if (list.length > 0) {
            const finalMsg = list[list.length - 1];
            const { dateStr } = prepareMessageMeta(finalMsg);
            roomState.lastDateKey = dateStr;
        }

        const isAtTop = container.scrollTop === 0;
        const oldScrollHeight = container.scrollHeight;
        const oldScrollTop = container.scrollTop;

        if (prepend) {
            container.prepend(fragment);

            const newScrollHeight = container.scrollHeight;
            container.scrollTop = (newScrollHeight - oldScrollHeight) + oldScrollTop;

            requestAnimationFrame(() => {
                container.scrollTop = (container.scrollHeight - oldScrollHeight) + oldScrollTop;
            });
        } else {
            if (firstLoad) {
                // 1. 기존 내용을 새 데이터(fragment)로 교체
                container.replaceChildren(fragment);
                
                // 2. [추가] 즉시 스크롤을 맨 아래로 이동 (검색 점프 중이 아닐 때만)
                if (!chatState.search.isSearchJump) {
                    container.scrollTop = container.scrollHeight;
                }
            } else {
                container.appendChild(fragment);
            }

            // 3. 공통 하단 스크롤 로직 (첫 로딩이거나 이미 바닥 근처일 때)
            if ((firstLoad || isScrollBottom()) && !chatState.search.isSearchJump) {
                // DOM 렌더링을 위해 약간의 여유를 줌
                requestAnimationFrame(() => {
                    container.scrollTop = container.scrollHeight;
                });

                // 이미지 로딩 대응
                const images = container.querySelectorAll('.chat-thumbnail');
                let loadedImages = 0;
                if (images.length > 0) {
                    images.forEach(img => {
                        if (img.complete) { // 이미 캐시된 이미지 대응
                            loadedImages++;
                        } else {
                            img.onload = () => {
                                loadedImages++;
                                if (loadedImages === images.length) {
                                    container.scrollTop = container.scrollHeight;
                                }
                            };
                        }
                    });
                }
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
    const container = document.getElementById("messages");
    const msgId = Number(data.msg_id);
    const { dateStr, timeStr, currentTime } = prepareMessageMeta(data);
    const currentRoomId = String(chatState.session.currentRoomId);

    if (!chatState.message.rooms[roomId]) chatState.message.rooms[roomId] = {};
    if (!chatState.message.rooms[roomId][myId]) {
        chatState.message.rooms[roomId][myId] = {
            lastSenderId: null,
            lastGroupId: null,
            lastMessageTime: null,
            lastTimeStr: null,
            lastDateKey: null,
            appendedMsgSet: new Set(),
            lastAppendedData: null
        };
    }
    const roomState = chatState.message.rooms[roomId][myId];

    if (currentRoomId === "0") {
        const senderId = String(data.sender_id);
        const receiverId = String(data.receiver_id);
        const sessionReceiverId = String(chatState.session.receiverId);

        const isTargetMatch = (senderId === sessionReceiverId || receiverId === sessionReceiverId);
        if (isTargetMatch) {
            console.log("[DEBUG] 가상방(0) -> 실제 방 전환:", roomId);
            chatState.session.currentRoomId = data.room_id;
        } else {
            return;
        }
    } else if (String(currentRoomId) !== String(roomId)) {
        return;
    }

    if (roomState.appendedMsgSet.has(msgId)) return;

    if (!fragment && roomState.lastDateKey !== dateStr) {
        const dateBox = document.createElement("div");
        dateBox.className = "chat-date-box";
        dateBox.textContent = dateStr;

        if (prepend) container.prepend(dateBox);
        else container.appendChild(dateBox);

        roomState.lastDateKey = dateStr;
    } else if (fragment) {
        roomState.lastDateKey = dateStr;
    }

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
        timeEl.innerText = data.group_id ? `${timeStr} (#${data.group_id})` : timeStr;
        row.appendChild(timeEl);

        if (fragment) {
            fragment.appendChild(row);
        } else {
            if (prepend) container.prepend(row);
            else container.appendChild(row);
        }
    }

    // 5. 상태 최종 갱신
    roomState.lastGroupId = data.group_id || null;
    roomState.lastSenderId = data.sender_id;
    roomState.lastMessageTime = currentTime;
    roomState.lastTimeStr = timeStr;
    roomState.lastAppendedData = data;
    roomState.appendedMsgSet.add(msgId);
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

export async function sendMessage(content) {
    if (!content || !chatState.session.receiverId) return;

    const params = new URLSearchParams({
        receiver_id: chatState.session.receiverId,
        content: content
    });

    try {
        const res = await fetch("/chat/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json" // 서버에 JSON을 원한다고 명시
            },
            body: params
        });

        if (res.ok) {
            const text = await res.text(); // json() 대신 text()로 먼저 받음
            console.log("[DEBUG] 서버 원본 응답:", text);

            let savedMsg;

            // 1. 응답이 XML인 경우 (방어 로직)
            if (text.trim().startsWith("<")) {
                console.warn("[WARN] 서버가 XML을 반환했습니다. 수동 파싱을 시도합니다.");

                // 간단한 정규식으로 XML 내부 데이터 추출 (필요한 것만)
                const roomIdMatch = text.match(/<room_id>(.*?)<\/room_id>/);
                const senderIdMatch = text.match(/<sender_id>(.*?)<\/sender_id>/);
                const contentMatch = text.match(/<content>(.*?)<\/content>/);
                const createdAtMatch = text.match(/<created_at>(.*?)<\/created_at>/);

                savedMsg = {
                    room_id: roomIdMatch ? roomIdMatch[1] : chatState.session.currentRoomId,
                    sender_id: senderIdMatch ? senderIdMatch[1] : chatState.session.myUserId,
                    content: contentMatch ? contentMatch[1] : content,
                    created_at: createdAtMatch ? createdAtMatch[1] : new Date().toISOString(),
                    msg_type: "TEXT"
                };
            }
            // 2. 정상적인 JSON인 경우
            else {
                savedMsg = JSON.parse(text);
            }

            // --- 데이터 처리 로직 ---
            if (String(chatState.session.currentRoomId) === "0") {
                console.log("[DEBUG] 가상방 세션 갱신:", savedMsg.room_id);
                chatState.session.currentRoomId = savedMsg.room_id;

                const messagesContainer = document.getElementById("messages");
                if (messagesContainer) messagesContainer.innerHTML = "";

                // 새 방 번호로 웹소켓 구독 갱신
                if (typeof subscribeRoom === "function") {
                    subscribeRoom(savedMsg.room_id);
                }
            }

            // 화면에 메시지 추가 및 목록 업데이트
            appendMessage(savedMsg);
            updateRoomListRealtime(savedMsg);
            markAsRead(savedMsg.room_id);

        } else {
            console.error("[ERROR] 서버 응답 상태가 좋지 않음:", res.status);
        }
    } catch (err) {
        console.error("메시지 전송 로직 실행 중 에러:", err);
    }
}

function prepareMessageMeta(data) {
    const rawDate = data.created_at ? data.created_at : new Date();

    let date;
    if (typeof rawDate === 'string') {
        date = new Date(rawDate.replace(/\.0$/, "").replace(" ", "T"));
    } else {
        date = new Date(rawDate);
    }

    if (isNaN(date.getTime())) {
        date = new Date();
    }

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
    const fileName = data.saved_name || data.content;
    if (fileName) {
        img.src = `/chat/files/${encodeURIComponent(fileName)}`;
    } else {
        img.src = "https://via.placeholder.com/150?text=No+Image";
    }

    img.classList.add("chat-thumbnail");

    // 로딩 실패 시 대신 표시할 아이콘
    img.onerror = () => {
        img.src = "https://via.placeholder.com/150?text=Load+Error";
    };

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

export function initSendMessageEvents() {
    document.addEventListener("click", (e) => {
        const sendBtn = e.target.closest(".btn-send");
        if (sendBtn) {
            const textarea = document.getElementById("chat-textarea");
            const content = textarea?.value.trim();
            if (content) {
                sendMessage(content);
                textarea.value = "";
            }
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.target.id === "chat-textarea" && e.key === "Enter" && !e.shiftKey && !e.isComposing) {
            e.preventDefault();
            const message = e.target.value.trim();
            if (message.length > 0) {
                sendMessage(message);
                e.target.value = "";
            }
        }
    });
}


