import { chatState } from "./ChatState.js";
import { appendMessage, loadMessages, markAsRead } from "./ChatMessage.js";
import { subscribeRoom } from "./ChatWebSocket.js";
import { updateSearchCounter, resetSearchUI } from "./ChatSearch.js";

// 내 정보
export function initMyUserInfo(textData) {
    let loginUser = null;

    try {
        if (textData.trim().startsWith('<')) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(textData, "text/xml");
            loginUser = {
                user_id: Number(xmlDoc.getElementsByTagName("user_id")[0]?.textContent),
                nickname: xmlDoc.getElementsByTagName("nickname")[0]?.textContent || "",
                username: xmlDoc.getElementsByTagName("username")[0]?.textContent || "",
                profile_filename: xmlDoc.getElementsByTagName("profile_filename")[0]?.textContent || ""
            };
        } else {
            loginUser = JSON.parse(textData);
        }

        if (loginUser && loginUser.user_id) {
            chatState.session.loginUser = loginUser;
            chatState.session.myUserId = loginUser.user_id;

            updateMyHeaderProfile();
            return loginUser.user_id;
        }
    } catch (e) {
        console.error("[ChatUI] 내 정보 파싱 실패:", e);
    }
    return null;
}

// 프로필 공통 헬퍼
function getProfileUrl(fileName) {
    const safeName = (fileName && fileName.trim() !== "" && fileName !== "null")
        ? fileName
        : "none";
    return `/user/getProfile?fileName=${encodeURIComponent(safeName)}`;
}

// 유저 등급 뱃지
function getRoleBadge(gradeId) {
    const grade = Number(gradeId);

    if (grade === 1 || !grade) return "";

    if (grade === 2) {
        return `<span class="badge-role badge-gosu">고수</span>`;
    }

    if (grade === 3) {
        return `<span class="badge-role badge-pro">전문가</span>`;
    }

    return "";
}

export function updateMyHeaderProfile() {
    const myInfo = chatState.session.loginUser;
    if (!myInfo) return;

    const myDisplayName = myInfo.nickname || myInfo.username || "내 계정";
    document.getElementById("my-profile-name").innerText = myDisplayName;

    const imgEl = document.getElementById("my-profile-img");
    if (imgEl) {
        imgEl.src = getProfileUrl(myInfo.profile_filename);
    }
}

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

                const listBadge = getRoleBadge(room.other_user_grade_id);
                item.dataset.room_id = room.room_id;
                item.dataset.user_id = room.other_user_id;
                const profileSrc = getProfileUrl(room.other_user_profile);

                const userName = (room.other_user_nickname && room.other_user_nickname !== "null")
                    ? room.other_user_nickname
                    : (room.other_user_username || "이름 없음");

                item.innerHTML = `
                    <img src="${profileSrc}" alt="유저">
                    <div class="info">
                        <div class="name">
                            ${userName} 
                            ${listBadge}  
                        </div>
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
                    resetChatInput();
                    chatState.session.currentRoomId = room.room_id;
                    chatState.session.receiverId = room.other_user_id;

                    if (chatState.socket.roomSubscription) chatState.socket.roomSubscription.unsubscribe();
                    subscribeRoom(chatState.session.currentRoomId);

                    if (chatState.search.isSearchMode) {
                        const searchIdsJson = item.dataset.search_msg_ids;
                        chatState.search.searchMsgIds = searchIdsJson ? JSON.parse(searchIdsJson) : [];
                        chatState.search.currentSearchIndex = -1;
                        updateSearchCounter();
                    }

                    document.getElementById("empty-view").style.display = "none";
                    document.getElementById("chat-view").style.display = "flex";

                    const headerName = document.querySelector('.chat-header .name');
                    if (headerName) headerName.innerText = userName;

                    const roleEl = document.querySelector('.chat-header .role');
                    if (roleEl) roleEl.innerHTML = getRoleBadge(room.other_user_grade_id);

                    const headerImg = document.querySelector('.chat-header img');
                    if (headerImg) headerImg.src = profileSrc;

                    loadMessages(chatState.session.currentRoomId, 0, 40, false, true)
                        .then(() => {
                            markAsRead(room.room_id);
                            const badge = item.querySelector(".badge");
                            if (badge) badge.remove();
                        });
                });
            });
            const urlParams = new URLSearchParams(window.location.search);
            const targetRoomId = urlParams.get('room_id');
            const targetUserId = urlParams.get('target_id');

            if (targetRoomId && targetRoomId !== "0") {
                const targetItem = chatListContainer.querySelector(`[data-room_id="${targetRoomId}"]`);
                if (targetItem) {
                    resetChatInput();
                    targetItem.click();
                }
            }
            else if (targetUserId) {
                const existingRoom = rooms.find(r => String(r.other_user_id) === String(targetUserId));

                if (existingRoom) {
                    const targetItem = chatListContainer.querySelector(`[data-room_id="${existingRoom.room_id}"]`);
                    if (targetItem) {
                        targetItem.click();
                    }
                } else {
                    resetChatInput();
                    initVirtualRoom(targetUserId);

                    const messagesContainer = document.getElementById("messages");
                    if (messagesContainer) {
                        messagesContainer.innerHTML = `
                            <div style="text-align:center; padding:40px; color:#888;">
                                <p>신규 대화입니다.</p>
                                <small>메시지를 보내면 대화방이 생성됩니다.</small>
                            </div>`;
                    }
                }
            }

            window.history.replaceState({}, '', window.location.pathname);
        })
        .catch(err => console.error("채팅방 목록 로드 실패", err));
}

//채팅방 목록 실시간 업데이트
export function updateRoomListRealtime(msg) {
    console.log("[DEBUG] 실시간 메시지 수신 데이터:", msg);

    const chatListContainer = document.querySelector('.chat-items');
    const messagesContainer = document.getElementById("messages");

    // [중요] 모든 ID를 String으로 강제 형변환하여 비교 오류 방지
    const msgRoomId = String(msg.room_id);
    const myId = String(chatState.session.myUserId);
    const receiverId = String(chatState.session.receiverId);
    let currentRoomId = String(chatState.session.currentRoomId);

    console.log(`[DEBUG] 비교 상태 - 수신Room:${msgRoomId}, 현재Room:${currentRoomId}, 상대ID:${receiverId}`);

    // 1. 가상방(0)에서 실제 방으로 전환되는 찰나의 순간 처리
    if (currentRoomId === "0" || currentRoomId === "null" || !currentRoomId) {
        // 내가 보냈거나, 내가 지정한 상대방이 보낸 메시지라면 이 방은 내 방임
        const isFromMe = String(msg.sender_id) === myId;
        const isFromTarget = String(msg.sender_id) === receiverId;

        if (isFromMe || isFromTarget) {
            console.log("[DEBUG] 가상방 상태에서 첫 메시지 감지. 현재 세션을 실제 ID로 업데이트합니다.");
            chatState.session.currentRoomId = msg.room_id;
            currentRoomId = String(msg.room_id);

            if (messagesContainer) {
                messagesContainer.innerHTML = "";
            }

            if (typeof subscribeRoom === "function") {
                subscribeRoom(msg.room_id);
            }
        }
    }

    // 2. 메시지 화면 출력 판정 (이게 return보다 먼저 와야 함)
    const isCurrentRoom = (msgRoomId === currentRoomId);

    if (isCurrentRoom) {
        console.log("[DEBUG] 현재 보고 있는 방이 맞으므로 화면에 메시지를 추가합니다.");
        if (typeof appendMessage === "function") {
            appendMessage(msg);

            // 스크롤 처리
            if (messagesContainer) {
                setTimeout(() => {
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }, 50);
            }
        }
    }

    const displayTime = msg.created_at || new Date().toISOString();
    // 3. 왼쪽 목록 UI 업데이트
    let item = chatListContainer.querySelector(`[data-room_id="${msgRoomId}"]`);

    if (!item) {
        console.log("[DEBUG] 목록에 해당 방이 없어 목록 전체를 새로 불러옵니다.");
        loadChatRooms(); // 비동기 로드
        return; // 새로 불러올 것이므로 여기서 종료
    }

    // 목록에 방이 이미 존재하는 경우 (업데이트 후 맨 위로 올리기)
    const lastMsgEl = item.querySelector(".last-msg");
    if (lastMsgEl) lastMsgEl.innerText = makePreviewMessage(msg.content, msg.msg_type);

    const timeEl = item.querySelector(".time");
    if (timeEl) timeEl.innerText = formatChatTime(displayTime);

    // 알림 배지 처리
    if (!isCurrentRoom && String(msg.sender_id) !== myId) {
        let badge = item.querySelector(".badge");
        if (!badge) {
            badge = document.createElement("div");
            badge.classList.add("badge");
            const rightDiv = item.querySelector(".right");
            if (rightDiv) rightDiv.appendChild(badge);
        }
        badge.innerText = Number(badge.innerText || 0) + 1;
    } else if (isCurrentRoom) {
        const badge = item.querySelector(".badge");
        if (badge) badge.remove();
    }

    // 최신 메시지 방을 목록 최상단으로 이동
    chatListContainer.prepend(item);
}

function resetChatInput() {
    const chatInput = document.getElementById("chat-textarea"); 
    if (chatInput) {
        chatInput.value = "";
        chatInput.style.height = "auto";
        
        const counter = document.getElementById("char-count");
        if (counter) counter.innerText = "0/1000";
    }
}


//---------------------- init ----------------------------

export function initTabs() {
    const tabAll = document.getElementById('tab-all');
    const tabSearch = document.getElementById('tab-search');
    const searchBox = document.querySelector('.chat-search-box');

    tabAll.addEventListener('click', () => {
        tabAll.classList.add('active');
        tabSearch.classList.remove('active');
        searchBox.style.display = 'none';

        if (typeof resetSearchUI === "function") {
            resetSearchUI(); 
        }

        loadChatRooms();
    });

    tabSearch.addEventListener('click', () => {
        tabSearch.classList.add('active');
        tabAll.classList.remove('active');
        searchBox.style.display = 'flex';
        
        const searchInput = searchBox.querySelector("input");
        if(searchInput) searchInput.focus();
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

export async function initTargetInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const targetId = urlParams.get('target_id');
    const roomId = urlParams.get('room_id'); // 기존 방 번호가 있을 수도 있음

    // 신규 채팅(가상방 0)이거나, 방 번호만 있고 이름이 없는 경우 처리
    if (targetId) {
        try {
            const res = await fetch(`/chat/user/info/${targetId}`);
            if (res.ok) {
                const user = await res.json();

                const userName = (user.nickname && user.nickname !== "null")
                    ? user.nickname
                    : user.username;

                const headerName = document.querySelector(".chat-header .name");
                if (headerName) headerName.innerText = userName;

                chatState.session.receiverId = targetId;
                chatState.session.targetName = userName;
            }
        } catch (err) {
            console.error("상대방 정보를 불러오지 못했습니다.", err);
        }
    }
}

export async function initVirtualRoom(targetUserId) {
    if (!targetUserId) return;
    resetChatInput();
    
    console.log("[DEBUG] 가상 채팅방 활성화 프로세스 시작. ID:", targetUserId);

    chatState.session.currentRoomId = 0;
    chatState.session.receiverId = targetUserId;

    try {
        const response = await fetch(`/chat/user/info/${targetUserId}`);
        if (!response.ok) throw new Error("유저 정보를 가져올 수 없습니다.");

        const userData = await response.json();
        const userName = (userData.nickname && userData.nickname !== "null")
            ? userData.nickname
            : (userData.username || `사용자 ${targetUserId}`);

        console.log(`[DEBUG] 표시될 이름 결정: ${userName} (원본: nick=${userData.nickname}, id=${userData.username})`);

        chatState.session.tempTargetName = userName;

        const headerName = document.querySelector('.chat-header .name');
        if (headerName) {
            headerName.innerText = userName;
        }

        const roleEl = document.querySelector('.chat-header .role');
        if (roleEl) {
            roleEl.innerHTML = getRoleBadge(userData.grade_id);
        }

        const headerImg = document.querySelector('.chat-header img');
        if (headerImg) {
            const fName = userData.profile_filename || "empty";
            headerImg.src = getProfileUrl(userData.profile_filename);
        }

        document.getElementById("empty-view").style.display = "none";
        document.getElementById("chat-view").style.display = "flex";

        const messagesContainer = document.getElementById("messages");
        if (messagesContainer) {
            messagesContainer.innerHTML = `
                <div class="first-message-guide" style="text-align:center; padding:40px; color:#888;">
                    <p><strong>${userName}</strong> 님과 대화를 시작해보세요.</p>
                    <small>메시지를 보내면 대화방이 생성됩니다.</small>
                </div>`;
        }

        initSendMessageEvents();

    } catch (error) {
        console.error("[ERROR] 상대방 정보를 불러오는데 실패했습니다:", error);
    }
}

