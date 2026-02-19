// ChatState.js

export const chatState = {

    // 유저 & 현재 채팅방
    session: {
        myUserId: null,
        receiverId: null,
        currentRoomId: null
    },

    // 웹소켓
    socket: {
        stompClient: null,
        reconnectTimer: null,
        roomSubscription: null
    },

    // 메시지 흐름 & 렌더링
    message: {
        lastSenderId: null,
        lastTimeStr: null,
		    lastTimeElement: null,
        lastDateKey: null,
        appendedMsgSet: new Set()
    },

    // 검색
    search: {
        searchMsgIds: [],
        currentSearchIndex: -1,
        isSearchMode: false,
        currentSearchKeyword: "",
        isSearchJump: false
    },

    // 점프 & 스크롤
    scroll: {
        jumpMsgId: null
    },

    // 읽음 처리
    read: {
        readTimer: null
    },

    // 로딩 상태
    loading: {
        isLoadingMessages: false
    }
};