import { chatState } from "./ChatState.js";
import { loadMessages } from "./ChatMessage.js";

export function isScrollBottom() {
    const container = document.getElementById("messages");
    if (!container) return false;
    return container.scrollHeight - container.scrollTop - container.clientHeight < 50;
}

//새 메시지가 왔을 때 스크롤을 내릴지, 버튼을 보여줄지 결정하는 함수
export function shouldScrollOrShowButton(data) {
    const container = document.getElementById("messages");
    const newMsgBtn = document.getElementById("new-msg-btn");
    if (!container || !newMsgBtn) return;

    const myId = chatState.session.myUserId;
    const isMyMsg = data.sender_id === myId;
    const isBottom = isScrollBottom();

    if (isMyMsg || isBottom) {
        // 내가 보낸 메시지거나, 이미 바닥 근처라면 강제 스크롤
        container.scrollTop = container.scrollHeight;
        newMsgBtn.style.display = "none";
    } else {
        // 스크롤이 한참 위에 있는데 남이 보낸 메시지라면 버튼 표시
        newMsgBtn.style.display = "block";
    }
}

export function handleNewMessageButton() {
    const newMsgBtn = document.getElementById("new-msg-btn"); // 새로운 메세지 버튼
    const container = document.getElementById("messages");
    let ignoreScroll = true;
    let lastScrollTop = container.scrollTop;


    // 새로운 메세지 버튼 클릭 시 맨 아래로 이동
    newMsgBtn.addEventListener("click", () => {
        container.scrollTop = container.scrollHeight;
        newMsgBtn.style.display = "none";
    });

    //맨 아래로 스크롤 시 새로운 메세지 버튼 사라짐
    container.addEventListener("scroll", async () => {
        if (ignoreScroll) {
            ignoreScroll = false;
            lastScrollTop = container.scrollTop;
            return;
        }
        const currentScrollTop = container.scrollTop;
        const isScrollingUp = currentScrollTop < lastScrollTop;
        lastScrollTop = currentScrollTop;

        const isBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 5;
        if (isBottom) {
            newMsgBtn.style.display = "none";
        }

        const roomId = chatState.session.currentRoomId;
        const roomState = chatState.message.rooms[roomId]?.[chatState.session.myUserId];

        // 최상단 스크롤 시 이전 메시지 로드
        if (
            isScrollingUp &&
            container.scrollTop === 0 &&
            container.scrollHeight > container.clientHeight &&
            !chatState.loading.isLoadingMessages &&
            roomState?.hasMore !== false &&
            roomState?.loadedCount > 0 
        ) {
            const firstMsg = container.querySelector(".message-row");
            const firstMsgId = firstMsg ? Number(firstMsg.dataset.msg_id) : null;

            if (firstMsgId) {
                const roomId = chatState.session.currentRoomId;

                // 이미 로드된 메시지 수를 offset으로 사용
                const currentMessagesCount = roomState.loadedCount;
                const size = 40;

                await loadMessages(roomId, currentMessagesCount, size, true);

            }
        }
    });

}
