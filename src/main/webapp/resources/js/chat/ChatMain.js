import { chatState } from "./ChatState.js";
import { connectWS } from "./ChatWebSocket.js";
import { loadChatRooms, initTabs, initUnreadFilter, initDropdownMenu, initUploadFile } from "./ChatUI.js";
import { initSearchInput, initSearchKeydown, initNextSearchButton } from "./ChatSearch.js";
import { handleNewMessageButton } from "./ChatScroll.js";
import { sendMessage } from "./ChatMessage.js"
// import { handleFileUpload } from "./ChatFile.js";

document.addEventListener("DOMContentLoaded", () => {

  const params = new URLSearchParams(location.search);
  chatState.session.myUserId = Number(params.get("testUser_id"));

    connectWS();
    loadChatRooms();

    initTabs();
    initUnreadFilter();
    initDropdownMenu();
    initUploadFile();

    initSearchInput();
    initSearchKeydown();
    initNextSearchButton();

    sendMessage();

    handleNewMessageButton();

});
