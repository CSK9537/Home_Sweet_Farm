import { chatState } from "./ChatState.js";
import { loadMessages } from "./ChatMessage.js";

let searchTimer;

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
    const scrollBehavior = chatState.search.isSearchJump ? "auto" : "smooth";

    target.scrollIntoView({
        behavior: scrollBehavior,
        block: "center"
    });

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

// 실제 검색 실행 로직
function executeSearch() {
    const searchInput = document.querySelector(".chat-search-box input");
    const searchTypeSelect = document.getElementById("searchType");
    
    if (!searchInput) return;

    const keyword = searchInput.value.trim();
    const searchType = searchTypeSelect.value;

    if (!keyword) {
        resetSearchUI();
        return;
    }

    chatState.search.currentSearchKeyword = keyword.toLowerCase();
    chatState.search.isSearchMode = true;

    fetch(`/chat/rooms/search?keyword=${encodeURIComponent(keyword)}&type=${searchType}`)
        .then(res => res.json())
        .then(results => {
            // [검증] 응답 시점의 키워드 확인 (레이스 컨디션 방지)
            if (searchInput.value.trim().toLowerCase() !== chatState.search.currentSearchKeyword) return;

            const resultMap = new Map();
            results.forEach(r => {
                const roomId = Number(r.room_id);
                if (!resultMap.has(roomId)) resultMap.set(roomId, []);
                if (r.search_msg_id) resultMap.get(roomId).push(r.search_msg_id);
            });

            const currentId = Number(chatState.session.currentRoomId);
            chatState.search.searchMsgIds = resultMap.get(currentId) || [];
            chatState.search.currentSearchIndex = -1;

            // 목록 필터링
            document.querySelectorAll(".chat-item").forEach(item => {
                const roomId = Number(item.dataset.room_id);
                if (resultMap.has(roomId)) {
                    item.style.display = "flex";
                    const msgIds = resultMap.get(roomId);
                    item.dataset.jump_msg_id = msgIds[0] || "";
                    item.dataset.search_msg_ids = JSON.stringify(msgIds);
                } else {
                    item.style.display = "none";
                }
            });
            updateSearchCounter();
        })
        .catch(err => console.error("검색 중 오류:", err));
}

// 검색 UI 및 상태 초기화
export function resetSearchUI() {
    const searchInput = document.querySelector(".chat-search-box input");
    if (searchInput) searchInput.value = "";
    
    chatState.search.searchMsgIds = [];
    chatState.search.currentSearchIndex = -1;
    chatState.search.isSearchMode = false;
    chatState.search.currentSearchKeyword = "";
    
    document.querySelectorAll(".chat-item").forEach(item => {
        item.style.display = "flex";
    });
    updateSearchCounter();
}

export function initSearchInput() {
    const searchInput = document.querySelector(".chat-search-box input");
    const searchTypeSelect = document.getElementById("searchType");
    const tabAll = document.getElementById("tab-all"); // "전체보기" 탭

    searchInput.addEventListener("input", () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(executeSearch, 300);
    });

    searchTypeSelect.addEventListener("change", () => {
        clearTimeout(searchTimer);
        executeSearch(); 
    });

    if (tabAll) {
        tabAll.addEventListener("click", () => {
            resetSearchUI();
        });
    }
}

export function initSearchKeydown() {

    const searchInput = document.querySelector(".chat-search-box input");

    searchInput.addEventListener("keydown", async (e) => {

        if (!chatState.search.isSearchMode || chatState.search.searchMsgIds.length === 0) return;

        if (e.key === "Enter" || e.key === "ArrowDown") {

            e.preventDefault();
            chatState.search.currentSearchIndex = (chatState.search.currentSearchIndex + 1) % chatState.search.searchMsgIds.length;
            const nextId = chatState.search.searchMsgIds[chatState.search.currentSearchIndex];
            if (!nextId) return;
            chatState.scroll.jumpMsgId = nextId;

            await performSearchJump(nextId, chatState.search.currentSearchKeyword);
            updateSearchCounter();
        }
    });

}
export function initNextSearchButton() {

    document.getElementById("nextSearchBtn").addEventListener("click", async () => {
        if (!chatState.search.isSearchMode || chatState.search.searchMsgIds.length === 0) return;

        chatState.search.currentSearchIndex = (chatState.search.currentSearchIndex + 1) % chatState.search.searchMsgIds.length;
        const nextId = chatState.search.searchMsgIds[chatState.search.currentSearchIndex];

        if (!nextId) return; // 유저 검색은 점프 없음

        chatState.scroll.jumpMsgId = nextId;
        chatState.search.isSearchJump = true;

        await performSearchJump(nextId, chatState.search.currentSearchKeyword);

        updateSearchCounter();
    });
}

export async function performSearchJump(msgId, keyword) {
    const container = document.getElementById("messages");

    container.style.transition = "none";
    container.style.height = `${container.offsetHeight}px`;
    container.style.opacity = "0.7"; 

    chatState.search.isSearchJump = true;
    let target = container.querySelector(`[data-msg_id="${msgId}"]`);

    if (target) {
        container.style.height = "";
        container.style.opacity = "1";
        jumpToMessage(msgId, keyword);
    } else {
        try {
            const res = await fetch(`/chat/rooms/${chatState.session.currentRoomId}/message-offset/${msgId}`);
            const data = await res.json();
            const rowNum = data.offset;

            if (rowNum > 0) {
                const fetchSize = Math.ceil(rowNum / 40) * 40;


                await loadMessages(chatState.session.currentRoomId, 0, fetchSize, false, true);

                // 데이터 렌더링 후 점프
                setTimeout(() => {
                    container.style.height = "";
                    container.style.opacity = "1";
                    jumpToMessage(msgId, keyword);

                    setTimeout(() => { chatState.search.isSearchJump = false; }, 200);
                }, 150);
            }
        } catch (err) {
            container.style.height = "";
            container.style.opacity = "1";
            chatState.search.isSearchJump = false;
        }
    }
}