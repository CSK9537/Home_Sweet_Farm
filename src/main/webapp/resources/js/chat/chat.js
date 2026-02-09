
//------------- Data---------------------
let stompClient = null;
let myUserId = 2;      //  로그인 유저 id(테스트 데이터)
let receiverId = null;    // 현재 선택 채팅 상대
let currentRoomId = 10; // 테스트용 방번호
let lastSenderId = null; // 마지막으로 append한 메시지의 sender_id(연속 채팅 시 프로필 이미지 제한)
let lastDateKey = null; // 가장 최근 날짜

// 웹소켓 연결
function connectWS() {
    const socket = new SockJS("/ws-chat");
    stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {

        console.log("WS CONNECTED");

        // 1. DB 메시지 먼저 불러오기
        loadMessages(currentRoomId);

        // 2. 이후 실시간 메시지 받기
        stompClient.subscribe("/topic/room.*", (msg) => {
            const data = JSON.parse(msg.body);
            appendMessage(data);
        });

    });
}

// DB에서 기존 메시지 불러오기
function loadMessages(room_id){
    fetch(`/chat/rooms/${room_id}/messages`)
        .then(res => res.json())
        .then(list => {
            const container = document.getElementById("messages");
            container.innerHTML = ""; // 기존 내용 초기화
            lastDateKey = null;

            let prevSenderId = null;
            let prevTimeStr = null;
            let prevDateStr = null;

            // 뒤에서 앞으로 체크 (같은 시간 처리)
            for(let i=list.length-1; i>=0; i--){
                const msg = list[i];

                const c = msg.created_at;
                const date = new Date(c[0], c[1]-1, c[2], c[3], c[4], c[5]);

                // 날짜 문자열
                let dateStr = "";
                const msgDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                dateStr = 
                	`${date.getFullYear()}년 ${(date.getMonth()+1).toString().padStart(2,'0')}월 ${date.getDate().toString().padStart(2,'0')}일`;


                // 시간 문자열
                const hours = date.getHours().toString().padStart(2,'0');
                const minutes = date.getMinutes().toString().padStart(2,'0');
                const timeStr = `${hours}:${minutes}`;

                // 마지막 메시지 시간 표시
                msg.showTime = !(msg.sender_id === prevSenderId && timeStr === prevTimeStr);

                // 날짜 표시
                msg.showDate = (dateStr !== prevDateStr);
                msg.dateStr = dateStr;

                prevSenderId = msg.sender_id;
                prevTimeStr = timeStr;
                prevDateStr = dateStr;
            }

            // appendMessage 호출
            list.forEach(msg => appendMessage(msg));
        })
        .catch(err => {
            console.error("메시지 로드 실패", err);
        });
}


function appendMessage(data){
    const container = document.getElementById("messages");

    const c = data.created_at;
    let date;

    if(data.created_at){
        const c = data.created_at;
        date = new Date(c[0], c[1]-1, c[2], c[3], c[4], c[5]);
    }else{
        date = new Date(); // 방금 보낸 메시지는 현재시간
    }



    const dateStr =
        `${date.getFullYear()}년 ${(date.getMonth()+1).toString().padStart(2,'0')}월 ${date.getDate().toString().padStart(2,'0')}일`;

    const timeStr =
        `${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`;

    // 날짜 표시
    if(data.showDate){
        const dateDiv = document.createElement("div");
        dateDiv.classList.add("chat-date");
        dateDiv.innerText = data.dateStr;
        container.appendChild(dateDiv);
    }

    const row = document.createElement("div");
    row.classList.add("message-row");
    if(data.sender_id === myUserId){
        row.classList.add("sent");
    }else{
        row.classList.add("received");
    }

    // 상대 프로필
    if(data.sender_id !== myUserId && data.sender_id !== lastSenderId){
        const profile = document.createElement("div");
        profile.classList.add("profile");
        const img = document.createElement("img");
        img.src = "https://via.placeholder.com/40";
        profile.appendChild(img);
        row.appendChild(profile);
    }

    // 메시지 박스
    const box = document.createElement("div");
    box.classList.add("message-box");
    box.innerText = data.content;
    row.appendChild(box);

    // 시간 표시
    const time = document.createElement("div");
    time.classList.add("time");
    time.innerText = data.showTime ? timeStr : "";
    row.appendChild(time);

    container.appendChild(row);
    container.scrollTop = container.scrollHeight;
    
    lastSenderId = data.sender_id;
}


// 전송 버튼
document.querySelector(".btn-send").addEventListener("click", () => {

    const textarea = document.getElementById("chat-textarea");
    const content = textarea.value;

    if(!content.trim()) return;

    stompClient.send(
        "/app/chat.sendMessage",
        {},
        JSON.stringify({
            sender_id: myUserId,
            receiver_id: receiverId,
            content: content
        })
    );

    textarea.value = "";
});

connectWS();


//좌측 채팅 목록 불러오기
function loadChatRooms() {
    const chatListContainer = document.querySelector('.chat-items');

    fetch("/chat/rooms")
        .then(res => res.json())
        .then(rooms => {
            chatListContainer.innerHTML = ""; // 기존 내용 초기화

            rooms.forEach(room => {
                const item = document.createElement("div");
                item.classList.add("chat-item");
                item.dataset.roomId = room.room_id;
                item.dataset.userId = room.other_user_id;

                item.innerHTML = `
                    <img src="https://via.placeholder.com/40" alt="유저">
                    <div class="info">
                        <div class="name">${room.other_user_name}</div>
                        <div class="last-msg">${room.last_msg || ''}</div>
                    </div>
                    <div class="badge">${room.unread_count}</div>
                `;

                chatListContainer.appendChild(item);

                // 클릭 이벤트
                item.addEventListener('click', () => {
                    currentRoomId = room.room_id;
                    receiverId = room.other_user_id;

                    // 화면 전환
                    document.getElementById("empty-view").style.display = "none";
                    const chatView = document.getElementById("chat-view");
                    chatView.style.display = "flex";
                    chatView.style.flexDirection = "column";

                    // 헤더 업데이트
                    const headerName = document.querySelector('.chat-header .name');
                    const headerImg = document.querySelector('.chat-header img');
                    const headerRole = document.querySelector('.chat-header .role');

                    if(headerName) headerName.innerText = room.other_user_name;
                    if(headerImg) headerImg.src = "https://via.placeholder.com/40"; // 나중에 실제 이미지 적용
                    if(headerRole) headerRole.innerText = "전문가"; // 나중에 role 정보 적용

                    // 메시지 로드
                    loadMessages(currentRoomId);
                });
            });

        })
        .catch(err => console.error("채팅방 목록 로드 실패", err));
}






//------------------------- 부가 기능 --------------------------------------------
//좌측 채팅 목록 상단 탭
document.addEventListener('DOMContentLoaded', () => {
    const tabAll = document.getElementById('tab-all');
    const tabSearch = document.getElementById('tab-search');
    const searchBox = document.querySelector('.chat-search-box');

    tabAll.addEventListener('click', () => {
        tabAll.classList.add('active');
        tabSearch.classList.remove('active');
        searchBox.style.display = 'none';
    });

    tabSearch.addEventListener('click', () => {
        tabSearch.classList.add('active');
        tabAll.classList.remove('active');
        searchBox.style.display = 'flex';
    });


    // 우측 채팅방 헤더 버튼 드롭다운 토글
    const menuBtn = document.getElementById('menuBtn');
    const menuDropdown = document.getElementById('menuDropdown');

    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        menuDropdown.style.display = menuDropdown.style.display === 'flex' ? 'none' : 'flex';
    });

    // 다른 곳 클릭 시 닫기
    document.addEventListener('click', () => {
        menuDropdown.style.display = 'none';
    });

    loadChatRooms();
    


});