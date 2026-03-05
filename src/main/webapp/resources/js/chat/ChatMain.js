import { chatState } from "./ChatState.js";
import { connectWS } from "./ChatWebSocket.js";
import { loadChatRooms, initTabs, initUnreadFilter, initDropdownMenu, initPendingFilesModal, initImagePreviewModal, initCharCount } from "./ChatUI.js";
import { initSearchInput, initSearchKeydown, initNextSearchButton } from "./ChatSearch.js";
import { handleNewMessageButton } from "./ChatScroll.js";
import { sendMessage } from "./ChatMessage.js";

async function initApp() {
    console.log("[DEBUG] 채팅 초기화 시작");

    try {
        const response = await fetch('user/me'); 
        if (!response.ok) {
            window.location.href = "/user/login"; 
            return;
        }

        const textData = await response.text();

        let myUserId = null;

        if (textData.trim().startsWith('<')) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(textData, "text/xml");
            
            const userIdNode = xmlDoc.getElementsByTagName("user_id")[0];
            if (userIdNode) {
                myUserId = Number(userIdNode.textContent);
            }
        } else {
            const loginUser = JSON.parse(textData);
            myUserId = loginUser.user_id;
        }

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
            sendMessage();
            handleNewMessageButton();
        } else {
            throw new Error("유저 ID를 찾을 수 없음");
        }

    } catch (error) {
        console.error("[INIT ERROR] 데이터 처리 중 오류:", error);
    }
}

document.addEventListener("DOMContentLoaded", initApp);
