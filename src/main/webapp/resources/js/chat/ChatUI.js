import { chatState } from "./ChatState.js";
import { appendMessage, loadMessages, markAsRead } from "./ChatMessage.js";
import { subscribeRoom } from "./ChatWebSocket.js";
import { updateSearchCounter } from "./ChatSearch.js";

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

export function updateMyHeaderProfile() {
    const myInfo = chatState.session.loginUser;
    if (!myInfo) return;

    const myDisplayName = myInfo.nickname || myInfo.username || "내 계정";
    document.getElementById("my-profile-name").innerText = myDisplayName;

    const imgEl = document.getElementById("my-profile-img");
    if (imgEl) {
        const fileName = myInfo.profile_filename || myInfo.profile_img || "";
        
        if (fileName) {
            imgEl.src = `/user/getProfile?fileName=${encodeURIComponent(fileName)}`;
        } else {
            imgEl.src = `/user/getProfile?fileName=`; 
        }

        console.log("[DEBUG] 내 프로필 이미지 최종 경로:", imgEl.src);
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
                item.dataset.room_id = room.room_id;
                item.dataset.user_id = room.other_user_id;
                const profileSrc = `/user/getProfile?fileName=${encodeURIComponent(room.other_user_profile || '')}`;
                
                item.innerHTML = `
                    <img src="${profileSrc}" alt="유저">
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
            const urlParams = new URLSearchParams(window.location.search);
            const targetRoomId = urlParams.get('room_id');
            const targetUserId = urlParams.get('target_id');
            const targetUserName = urlParams.get('target_name');

            if (targetRoomId && targetRoomId !== "0") {
                const targetItem = chatListContainer.querySelector(`[data-room_id="${targetRoomId}"]`);
                if (targetItem) {
                    targetItem.click();
                }
            }
            else if (targetUserId) {
                const existingRoom = rooms.find(r => String(r.other_user_id) === String(targetUserId));

                if (existingRoom) {
                    const targetItem = chatListContainer.querySelector(`[data-room_id="${existingRoom.room_id}"]`);
                    if (targetItem) targetItem.click();
                } else {
                    initVirtualRoom(targetUserId);
                }

                const messagesContainer = document.getElementById("messages");
                if (messagesContainer) {
                    messagesContainer.innerHTML = `
                            <div style="text-align:center; padding:40px; color:#888;">
                                <p>신규 대화입니다.</p>
                                <small>메시지를 보내면 대화방이 생성됩니다.</small>
                            </div>`;
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
            currentRoomId = String(msg.room_id); // 즉시 반영

            // "신규 대화입니다" 안내 문구 삭제
            if (messagesContainer) {
                messagesContainer.innerHTML = "";
            }

            // 실제 방으로 구독 전환
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
    formData.append("msg_type", type);

    // 현재 세션 상태 확인
    const currentRoomId = String(chatState.session.currentRoomId);
    formData.append("room_id", currentRoomId);

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

                // 1. 헤더의 상대방 이름 업데이트
                const headerName = document.querySelector(".chat-header .name");
                if (headerName) headerName.innerText = user.username;

                // 2. 전역 상태(chatState)에 상대방 정보 저장
                chatState.session.receiverId = targetId;
                chatState.session.targetName = user.username;

                console.log("[DEBUG] 상대방 정보 로드 완료:", user.username);
            }
        } catch (err) {
            console.error("상대방 정보를 불러오지 못했습니다.", err);
        }
    }
}

export async function initVirtualRoom(targetUserId) {
    if (!targetUserId) return;

    console.log("[DEBUG] 가상 채팅방 활성화 프로세스 시작. ID:", targetUserId);

    chatState.session.currentRoomId = 0;
    chatState.session.receiverId = targetUserId;

    try {
        const response = await fetch(`/chat/user/info/${targetUserId}`);
        if (!response.ok) throw new Error("유저 정보를 가져올 수 없습니다.");

        const userData = await response.json();
        const userName = userData.nickname || userData.username || `사용자 ${targetUserId}`;

        console.log(`[DEBUG] 표시될 이름 결정: ${userName} (원본: nick=${userData.nickname}, id=${userData.username})`);

        chatState.session.tempTargetName = userName;

        const headerName = document.querySelector('.chat-header .name');
        if (headerName) {
            headerName.innerText = userName;
        }

        const headerImg = document.querySelector('.chat-header img');
        if (headerImg) {
            if (userData.profile_filename) {
                // 담당자가 알려준 경로 형식 사용
                headerImg.src = `/user/getProfile?fileName=${encodeURIComponent(userData.profile_filename)}`;
            } else {
                // 프로필 이미지가 없을 경우 보여줄 기본 이미지 경로
                headerImg.src = "/resources/images/default-profile.png";
            }
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

