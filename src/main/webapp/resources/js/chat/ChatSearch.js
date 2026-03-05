import { chatState } from "./ChatState.js";
import { loadMessages } from "./ChatMessage.js";

export function jumpToMessage(msgId, keyword) {
    document.querySelectorAll(".message-box .text-content").forEach(el => {
        if (el.dataset.original) {
            el.textContent = el.dataset.original;
            delete el.dataset.original;
        }
    });

    const container = document.getElementById("messages");
    const target = container.querySelector(`[data-msg_id="${msgId}"]`);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "center" });

    const box = target.querySelector(".message-box .text-content");
    if (!box) return;

    if (keyword) {
        if (!box.dataset.original) {
            box.dataset.original = box.innerText;
        }

        const original = box.dataset.original;
        const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escaped})`, "gi");

        // 기존 textNode 기반 하이라이트
        box.textContent = original; // 원본 텍스트 복원
        const frag = document.createDocumentFragment();

        let lastIndex = 0;
        let match;
        while ((match = regex.exec(original)) !== null) {
            frag.appendChild(document.createTextNode(original.slice(lastIndex, match.index)));

            const span = document.createElement('span');
            span.classList.add('highlight-search');
            span.textContent = match[0];
            frag.appendChild(span);

            lastIndex = regex.lastIndex;
        }
        frag.appendChild(document.createTextNode(original.slice(lastIndex)));

        box.innerHTML = ""; // 기존 내용 제거
        box.appendChild(frag);
    }
}

// 검색 데이터 수 업데이트
export function updateSearchCounter() {

    const searchCounter = document.querySelector(".search-counter");

    if (!chatState.search.searchMsgIds || chatState.search.searchMsgIds.length === 0) {
        searchCounter.textContent = "0 / 0";
        return;
    }

    searchCounter.textContent =
        `${chatState.search.currentSearchIndex + 1} / ${chatState.search.searchMsgIds.length}`;
}

export function initSearchInput() {
    const searchInput = document.querySelector(".chat-search-box input");
    const searchTypeSelect = document.getElementById("searchType");

    searchInput.addEventListener("input", () => {
        const keyword = searchInput.value.trim();
        const searchType = searchTypeSelect.value;

        if (!keyword) {
            chatState.search.searchMsgIds = [];
            chatState.search.currentSearchIndex = -1;
            chatState.search.isSearchMode = false;
            document.querySelectorAll(".chat-item").forEach(item => item.style.display = "flex");
            updateSearchCounter();
            return;
        }

        chatState.search.currentSearchKeyword = keyword.toLowerCase();
        chatState.search.isSearchMode = true;

        fetch(`/chat/rooms/search?keyword=${encodeURIComponent(keyword)}&type=${searchType}`)
            .then(res => {
                const contentType = res.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new TypeError("서버에서 JSON이 아닌 응답이 왔습니다.");
                }
                return res.json();
            })
            .then(results => {
                console.log("[SEARCH RESULTS]", results);
                const resultMap = new Map();

                results.forEach(r => {
                    const roomId = r.room_id;
                    const msgId = r.search_msg_id;
                    if (!resultMap.has(roomId)) resultMap.set(roomId, []);
                    if (msgId) resultMap.get(roomId).push(msgId);
                });

                document.querySelectorAll(".chat-item").forEach(item => {
                    const roomId = Number(item.dataset.room_id);

                    if (resultMap.has(roomId)) {
                        item.style.display = "flex";
                        const msgIds = resultMap.get(roomId);
                        item.dataset.jump_msg_id = msgIds[0] || "";
                        item.dataset.search_msg_ids = JSON.stringify(msgIds);
                    } else {
                        item.style.display = "none";
                        item.dataset.jump_msg_id = "";
                        item.dataset.search_msg_ids = "[]";
                    }
                });

                if (chatState.session.currentRoomId && resultMap.has(chatState.session.currentRoomId)) {
                    chatState.search.searchMsgIds = resultMap.get(chatState.session.currentRoomId);
                    chatState.search.currentSearchIndex = -1;
                }
                updateSearchCounter();
            })
            .catch(err => console.error("검색 중 오류 발생:", err));
    });
}

export function initSearchKeydown() {

    const searchInput = document.querySelector(".chat-search-box input");

    searchInput.addEventListener("keydown", (e) => {

        if (!chatState.search.isSearchMode || chatState.search.searchMsgIds.length === 0) return;

        if (e.key === "Enter" || e.key === "ArrowDown") {

            e.preventDefault();

            chatState.search.currentSearchIndex = (chatState.search.currentSearchIndex + 1) % chatState.search.searchMsgIds.length;

            const nextId = chatState.search.searchMsgIds[chatState.search.currentSearchIndex];
            if (!nextId) return;

            chatState.scroll.jumpMsgId = nextId;
            chatState.search.isSearchJump = true;

            const container = document.getElementById("messages");
            const target = container.querySelector(
                `[data-msg_id="${chatState.scroll.jumpMsgId}"]`
            );

            const doJump = () => {
                jumpToMessage(chatState.scroll.jumpMsgId, chatState.search.currentSearchKeyword);
            };

            if (target) {
                doJump();
            } else {
                loadMessages(chatState.session.currentRoomId);
                setTimeout(doJump, 80);
            }
            updateSearchCounter();
        }
    });

}
export function initNextSearchButton() {

    document.getElementById("nextSearchBtn").addEventListener("click", () => {
        if (!chatState.search.isSearchMode || chatState.search.searchMsgIds.length === 0) return;

        chatState.search.currentSearchIndex = (chatState.search.currentSearchIndex + 1) % chatState.search.searchMsgIds.length;
        const nextId = chatState.search.searchMsgIds[chatState.search.currentSearchIndex];

        if (!nextId) return; // 유저 검색은 점프 없음

        chatState.scroll.jumpMsgId = nextId;
        chatState.search.isSearchJump = true;

        const container = document.getElementById("messages");
        const target = container.querySelector(`[data-msg_id="${chatState.scroll.jumpMsgId}"]`);

        const doJump = () => {
            jumpToMessage(chatState.scroll.jumpMsgId, chatState.search.currentSearchKeyword);
        };

        if (target) {
            doJump();
        } else {
            loadMessages(chatState.session.currentRoomId);
            setTimeout(doJump, 80);
        }
        updateSearchCounter();
    });
}