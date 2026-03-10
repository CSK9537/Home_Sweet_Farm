import { chatState } from "./ChatState.js";
import { connectWS } from "./ChatWebSocket.js";
import { initMyUserInfo, loadChatRooms, initTabs, initUnreadFilter, initDropdownMenu, initCharCount, initTargetInfo } from "./ChatUI.js";
import { initPendingFilesModal, initImagePreviewModal } from "./ChatModal.js";
import { initSearchInput, initSearchKeydown, initNextSearchButton } from "./ChatSearch.js";
import { handleNewMessageButton } from "./ChatScroll.js";
import { initSendMessageEvents } from "./ChatMessage.js";

async function initApp() {
    console.log("[DEBUG] 채팅 초기화 시작");

    try {
        const response = await fetch('user/me'); 
        if (!response.ok) {
            window.location.href = "/user/login"; 
            return;
        }

        const rawData = await response.text();

        const myUserId = initMyUserInfo(rawData);

        if (myUserId) {
            chatState.session.myUserId = myUserId;
            console.log("[SUCCESS] 세션 연결 성공! ID:", chatState.session.myUserId);

            connectWS();
            loadChatRooms();

            initTabs();
            initUnreadFilter();
            initDropdownMenu();
            initPendingFilesModal();
            initImagePreviewModal();
            initCharCount();
            initSearchInput();
            initSearchKeydown();
            initNextSearchButton();
            initTargetInfo();
            initSendMessageEvents();
            handleNewMessageButton();
        } else {
            throw new Error("유저 ID를 찾을 수 없음");
        }

    } catch (error) {
        console.error("[INIT ERROR] 데이터 처리 중 오류:", error);
    }
}

document.addEventListener("DOMContentLoaded", initApp);
