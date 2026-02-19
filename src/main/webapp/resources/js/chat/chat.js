
// //------------- Data---------------------
// const params = new URLSearchParams(location.search);

// let stompClient = null;
// let reconnectTimer = null;
// let myUserId = Number(params.get("testUser_id"));      //  로그인 유저 id(테스트 데이터)
// let receiverId = null;    // 현재 선택 채팅 상대
// let currentRoomId = null;
// let lastSenderId = null; // 마지막으로 append한 메시지의 sender_id(연속 채팅 시 프로필 이미지 제한)
// let lastTimeStr = null;
// let lastTimeElement = null;
// let lastDateKey = null; // 가장 최근 날짜
// let roomSubscription = null; // 방의 구독 상태
// const newMsgBtn = document.getElementById("new-msg-btn"); // 새로운 메세지 버튼
// const appendedMsgSet = new Set();	// 메세지 append 중복 방지
// let readTimer = null;		// 읽음 처리 debounce
// let jumpMsgId = null;   // 점프용 메세지 id(점프의 기준이 되는 메세지의 id)
// let isSearchJump = false;   // 검색인지 아닌지 구분해주기(현재 채팅방에서 검색 가능하게 하기)
// // ---- 검색 메세지 관련 ----
// const searchInput = document.querySelector(".chat-search-box input"); //검색
// const searchTypeSelect = document.getElementById("searchType"); // 검색 타입(유저/메세지)
// let searchMsgIds = [];  // 검색한 메세지 배열에 담기
// let currentSearchIndex = -1;    // 검색한 메세지의 배열 인덱스
// let isSearchMode = false;   // 검색중일 때만 작동하도록 구분해주기
// let currentSearchKeyword = "";
// const searchCounter = document.querySelector(".search-counter"); // 검색 데이터 수

// let isLoadingMessages = false; // 메시지 로딩 중 플래그
// const fileInput = document.getElementById("fileInput");

// // 웹소켓 연결
// function connectWS() {
//     const socket = new SockJS("/ws-chat");
//     stompClient = Stomp.over(socket);

//     stompClient.connect({}, () => {
//         console.log("WS CONNECTED");

//         // 개인 채널 구독
//         subscribeUserChannel();
//         if (currentRoomId) {
//             subscribeRoom(currentRoomId);
//         }
//     },
//         (error) => {
//             console.log("WS ERROR", error);
//             reconnectWS();
//         });

//     // 진짜 연결 끊김 감지
//     socket.onclose = function () {
//         console.log("WS CLOSED");
//         reconnectWS();
//     };
// }

// // 웹소켓 재연결 함수
// function reconnectWS() {

//     if (reconnectTimer) return; // 중복 방지

//     console.log("3초 후 재연결 시도");

//     reconnectTimer = setTimeout(() => {
//         reconnectTimer = null;
//         connectWS();
//     }, 3000);
// }

// // 방 구독 함수
// function subscribeRoom(room_id) {

//     if (roomSubscription) {
//         roomSubscription.unsubscribe();
//     }
//     console.log("Subscribing to room:", "/topic/room." + room_id);
//     roomSubscription = stompClient.subscribe(
//         "/topic/room." + room_id,
//         (msg) => {
//             console.log("WS received:", msg.body);
//             const data = JSON.parse(msg.body);

//             if (isLoadingMessages || appendedMsgSet.has(Number(data.msg_id))) {
//                 return;
//             }

//             appendMessage(data);
//             if (data.sender_id === myUserId) {
//                 const container = document.getElementById("messages");
//                 requestAnimationFrame(() => {
//                     container.scrollTop = container.scrollHeight;
//                 });
//             }
//         }
//     );
//     console.log("SUBSCRIBED TO ROOM", room_id);
// }

// // 유저 구독 함수
// function subscribeUserChannel() {

//     stompClient.subscribe("/topic/user." + myUserId, (msg) => {
//         console.log("WS received:", msg.body);
//         const data = JSON.parse(msg.body);
//         updateRoomListRealtime(data);
//     });
// }

// function markAsReadSafe() {

//     if (!currentRoomId) return;

//     // 이미 예약된 read 있으면 무시
//     if (readTimer) return;

//     readTimer = setTimeout(() => {

//         fetch(`/chat/rooms/${currentRoomId}/read?user_id=${myUserId}`, {
//             method: "POST"
//         });

//         readTimer = null;

//     }, 500); // 0.5초동안 메시지 모아서 한번만 호출
// }

// // DB에서 기존 메시지 불러오기
// function loadMessages(room_id) {
//     isLoadingMessages = true;
//     appendedMsgSet.clear();
//     lastSenderId = null;
//     lastTimeStr = null;
//     lastTimeElement = null;

//     fetch(`/chat/rooms/${room_id}/messages?testUser_id=${myUserId}`)
//         .then(res => res.json())
//         .then(list => {

//             const container = document.getElementById("messages");
//             container.innerHTML = ""; // 기존 내용 초기화
//             lastDateKey = null;

//             let prevSenderId = null;
//             let prevTimeStr = null;
//             let prevDateStr = null;


//             for (let i = 0; i < list.length; i++) {

//                 const msg = list[i];

//                 const date = new Date(msg.created_at);
//                 const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
//                 const dayOfWeek = days[date.getDay()];

//                 const dateStr =
//                     `${date.getFullYear()}년 ${(date.getMonth() + 1).toString().padStart(2, '0')}월 ${date.getDate().toString().padStart(2, '0')}일 ${dayOfWeek}`;

//                 const timeStr =
//                     `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

//                 const next = list[i + 1];

//                 let nextTimeStr = null;

//                 if (next) {
//                     const nd = new Date(next.created_at);

//                     nextTimeStr =
//                         `${nd.getHours().toString().padStart(2, '0')}:${nd.getMinutes().toString().padStart(2, '0')}`;
//                 }


//                 msg.showTime = !next ||
//                     !(msg.sender_id === next.sender_id && timeStr === nextTimeStr);

//                 msg.showDate = (i === 0 || dateStr !== prevDateStr);
//                 msg.dateStr = dateStr;
//                 prevDateStr = dateStr;
//                 lastDateKey = dateStr;
//             }


//             // appendMessage 호출
//             list.forEach(msg => {
//                 if (!appendedMsgSet.has(msg.msg_id)) {
//                     appendMessage(msg);
//                 }
//             });
//             if (list.length > 0) {
//                 lastDateKey = list[list.length - 1].dateStr;
//             }

//             // 검색 시 해당 메세지로 점프
//             // 메시지 append 완료 후
//             requestAnimationFrame(() => {
//                 const container = document.getElementById("messages");

//                 if (jumpMsgId && isSearchJump) {
//                     jumpToMessage(jumpMsgId, currentSearchKeyword);
//                     currentSearchIndex = 0;
//                     updateSearchCounter();
//                     jumpMsgId = null;
//                     isSearchJump = false;
//                 } else {
//                     // 일반 메시지 로드 후 맨 아래로
//                     container.scrollTop = container.scrollHeight;
//                 }

//                 isLoadingMessages = false;
//             });


//         })
//         .catch(err => {
//             console.error("메시지 로드 실패", err);
//             isLoadingMessages = false;
//         });
// }


// function appendMessage(data) {

//     if (!data.msg_id) return;

//     const msgIdNum = Number(data.msg_id); // 🔹 숫자로 통일
//     if (appendedMsgSet.has(msgIdNum)) return;
//     appendedMsgSet.add(msgIdNum);


//     const container = document.getElementById("messages");
//     const date = new Date(data.created_at);


//     if (isNaN(date.getTime())) {
//         return;
//     }


//     const dateStr =
//         `${date.getFullYear()}년 ${(date.getMonth() + 1).toString().padStart(2, '0')}월 ${date.getDate().toString().padStart(2, '0')}일`;

//     const timeStr =
//         `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

//     if (data.showDate === undefined) {
//         data.showDate = (dateStr !== lastDateKey);
//         data.dateStr = dateStr;
//     }

//     // 시간이 같은 메세지들끼리 그룹으로 묶기
//     const sameGroup =
//         (data.sender_id === lastSenderId && timeStr === lastTimeStr);

//     // 같은 그룹이면 이전 메시지 시간 제거
//     if (sameGroup && lastTimeElement) {
//         lastTimeElement.innerText = "";
//     }

//     if (data.showTime === undefined) {
//         data.showTime = !(data.sender_id === lastSenderId && timeStr === lastTimeStr);
//     }

//     // 날짜 표시
//     if (data.showDate) {
//         const dateDiv = document.createElement("div");
//         dateDiv.classList.add("chat-date");
//         dateDiv.innerText = data.dateStr;
//         container.appendChild(dateDiv);
//     }

//     const row = document.createElement("div");
//     row.dataset.msg_id = data.msg_id;
//     row.classList.add("message-row");
//     row.classList.add(data.sender_id === myUserId ? "sent" : "received");

//     // 상대 프로필
//     if (data.sender_id !== myUserId && data.sender_id !== lastSenderId) {
//         const profile = document.createElement("div");
//         profile.classList.add("profile");
//         const img = document.createElement("img");
//         img.src = "https://via.placeholder.com/40";
//         profile.appendChild(img);
//         row.appendChild(profile);
//     }

//     // 메시지 박스
//     const box = document.createElement("div");
//     box.classList.add("message-box");

//     if (data.msg_type === "TEXT") {
//         box.innerText = data.content;
//     } else if (data.msg_type === "FILE") {
//         box.innerHTML = `<a href="${data.file_path}" target="_blank">${data.original_name}</a>`;
//     } else if (data.msg_type === "IMAGE") {
//         box.innerHTML = `<img src="${data.file_path}" class="chat-img" />`;
//     }
//     row.appendChild(box);

//     // 시간 표시
//     const time = document.createElement("div");
//     time.classList.add("time");
//     time.innerText = timeStr;
//     row.appendChild(time);

//     container.appendChild(row);

//     lastSenderId = data.sender_id;
//     lastTimeStr = timeStr;
//     lastTimeElement = time;
//     lastDateKey = dateStr;
// }


// //좌측 채팅 목록 불러오기
// function loadChatRooms() {
//     const chatListContainer = document.querySelector('.chat-items');

//     fetch(`/chat/rooms?testUser_id=${myUserId}`)
//         .then(res => res.json())
//         .then(rooms => {
//             console.log("채팅방 데이터:", rooms);
//             chatListContainer.innerHTML = ""; // 기존 내용 초기화

//             rooms.forEach(room => {
//                 const item = document.createElement("div");
//                 item.classList.add("chat-item");
//                 item.dataset.room_id = room.room_id;
//                 item.dataset.user_id = room.other_user_id;

//                 item.innerHTML = `
//                     <img src="https://via.placeholder.com/40" alt="유저">
//                     <div class="info">
//                         <div class="name">${room.other_user_name}</div>
//                         <div class="last-msg">${room.last_msg || ''}</div>
//                     </div>
//                     ${room.unread_count > 0 ? `<div class="badge">${room.unread_count}</div>` : ``}
//                 `;

//                 chatListContainer.appendChild(item);

//                 // 클릭 이벤트
//                 item.addEventListener('click', () => {
//                     jumpMsgId = item.dataset.jump_msg_id && item.dataset.jump_msg_id.trim() !== ""
//                         ? Number(item.dataset.jump_msg_id)
//                         : null;
//                     isSearchJump = jumpMsgId !== null;

//                     // 검색어 배열 적용
//                     if (item.dataset.search_msg_ids) {
//                         searchMsgIds = JSON.parse(item.dataset.search_msg_ids);
//                     } else {
//                         searchMsgIds = [];
//                     }
//                     currentSearchIndex = -1;
//                     updateSearchCounter();

//                     console.log("jumpMsgId =", jumpMsgId); // test

//                     if (currentRoomId === room.room_id && !isSearchJump) return;
//                     if (!stompClient || !stompClient.connected) return;

//                     currentRoomId = room.room_id;
//                     receiverId = room.other_user_id;

//                     // 기존 구독 끊기
//                     if (roomSubscription) roomSubscription.unsubscribe();
//                     // 새 방 구독
//                     subscribeRoom(currentRoomId);

//                     // 화면 전환
//                     document.getElementById("empty-view").style.display = "none";
//                     document.getElementById("chat-view").style.display = "flex";

//                     // 헤더 업데이트
//                     const headerName = document.querySelector('.chat-header .name');
//                     const headerImg = document.querySelector('.chat-header img');
//                     const headerRole = document.querySelector('.chat-header .role');

//                     if (headerName) headerName.innerText = room.other_user_name;
//                     if (headerImg) headerImg.src = "https://via.placeholder.com/40"; // 나중에 실제 이미지 적용
//                     if (headerRole) headerRole.innerText = "전문가"; // 나중에 role 정보 적용

//                     // 메시지 로드
//                     loadMessages(currentRoomId);
//                     fetch(`/chat/rooms/${currentRoomId}/read?testUser_id=${myUserId}`, {
//                         method: "POST"
//                     });
//                     const badge = item.querySelector(".badge");
//                     if (badge) badge.remove();
//                     const unreadCheckbox = document.getElementById("unread-only");
//                     if (unreadCheckbox.checked) item.style.display = "none";
//                 });
//             });
//         })
//         .catch(err => console.error("채팅방 목록 로드 실패", err));
// }

// //채팅방 목록 실시간 업데이트
// function updateRoomListRealtime(msg) {

//     const chatListContainer = document.querySelector('.chat-items');
//     const isCurrentRoom = (msg.room_id === currentRoomId);

//     const item = chatListContainer.querySelector(
//         `[data-room_id="${msg.room_id}"]`
//     );


//     if (!item) {
//         // 새 방이면 그냥 목록 다시 로드
//         loadChatRooms();
//         return;
//     }

//     // 마지막 메시지 업데이트
//     const lastMsg = item.querySelector(".last-msg");
//     if (lastMsg) {
//         lastMsg.innerText = msg.content;
//     }

//     // unread 증가
//     if (!isCurrentRoom && msg.sender_id !== myUserId) {
//         let badge = item.querySelector(".badge");

//         if (!badge) {
//             badge = document.createElement("div");
//             badge.classList.add("badge");
//             badge.innerText = "1";
//             item.appendChild(badge);
//         } else {
//             badge.innerText = parseInt(badge.innerText) + 1;
//         }
//     }

//     const unreadCheckbox = document.getElementById("unread-only");
//     if (unreadCheckbox.checked) {
//         item.style.display = "flex";
//     }
//     //  채팅방 맨 위로 이동
//     chatListContainer.prepend(item);
// }

// //// 검색 필터
// //function updateChatList(filterKeyword = "") {
// //    const keyword = filterKeyword.toLowerCase();
// //    document.querySelectorAll(".chat-item").forEach(item => {
// //        const name = item.querySelector(".name")?.innerText.toLowerCase() || "";
// //        const lastMsg = item.querySelector(".last-msg")?.innerText.toLowerCase() || "";
// //
// //        if (!keyword || name.includes(keyword) || lastMsg.includes(keyword)) {
// //            item.style.display = "flex";
// //        } else {
// //            item.style.display = "none";
// //        }
// //    });
// //}

// function jumpToMessage(msgId, keyword) {
//     // 이전 점프 하이라이트 제거
//     document.querySelectorAll(".highlight-jump")
//         .forEach(el => el.classList.remove("highlight-jump"));

//     // 이전 검색 하이라이트 제거
//     document.querySelectorAll(".message-box").forEach(el => {
//         if (el.dataset.original) {
//             el.innerText = el.dataset.original;
//             delete el.dataset.original;
//         }
//     });
//     const container = document.getElementById("messages");
//     const target = container.querySelector(`[data-msg_id="${msgId}"]`);
//     if (!target) return;

//     target.scrollIntoView({ behavior: "smooth", block: "center" });

//     const box = target.querySelector(".message-box");
//     if (box) {

//         // 기존 검색 하이라이트 제거
//         if (box.dataset.original) {
//             box.innerText = box.dataset.original;
//         }
//         if (keyword) {
//             if (!box.dataset.original) {
//                 box.dataset.original = box.innerText;
//             }
//             const original = box.dataset.original;
//             const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//             const regex = new RegExp(`(${escaped})`, "gi");
//             box.innerHTML =
//                 original.replace(regex, `<span class="highlight-search">$1</span>`);
//         }
//     }
// }

// // 검색 데이터 수 업데이트
// function updateSearchCounter() {

//     if (!searchMsgIds || searchMsgIds.length === 0) {
//         searchCounter.textContent = "0 / 0";
//         return;
//     }

//     searchCounter.textContent =
//         `${currentSearchIndex + 1} / ${searchMsgIds.length}`;
// }

// // 스크롤 맨 밑으로
// function isScrollBottom() {
//     const container = document.getElementById("messages");
//     if (!container) return false;
//     return container.scrollHeight - container.scrollTop - container.clientHeight < 5;
// }

// //------------------------- 클릭 이벤트 --------------------------------------------
// //좌측 채팅 목록 상단 탭
// document.addEventListener('DOMContentLoaded', () => {
//     const tabAll = document.getElementById('tab-all');
//     const tabSearch = document.getElementById('tab-search');
//     const searchBox = document.querySelector('.chat-search-box');

//     // 새로운 메세지 버튼 클릭 시 맨 아래로 이동
//     newMsgBtn.addEventListener("click", () => {
//         const container = document.getElementById("messages");
//         container.scrollTop = container.scrollHeight;
//         newMsgBtn.style.display = "none";
//     });

//     //맨 아래로 스크롤 시 새로운 메세지 버튼 사라짐
//     document.getElementById("messages").addEventListener("scroll", () => {
//         const container = document.getElementById("messages");

//         const isBottom =
//             container.scrollHeight - container.scrollTop - container.clientHeight < 5;

//         if (isBottom) {
//             newMsgBtn.style.display = "none";
//         }
//     });


//     tabAll.addEventListener('click', () => {
//         tabAll.classList.add('active');
//         tabSearch.classList.remove('active');
//         searchBox.style.display = 'none';

//         if (searchInput) searchInput.value = "";

//         // 채팅방 전체 다시 표시
//         document.querySelectorAll(".chat-item").forEach(item => {
//             item.dataset.jump_msg_id = "";
//             item.dataset.search_msg_ids = "[]";
//         });

//         // 검색 하이라이트 제거
//         document.querySelectorAll(".highlight-search, .highlight-jump").forEach(el => {
//             const box = el.closest(".message-box");
//             if (box && box.dataset.original) {
//                 box.innerText = box.dataset.original;
//                 delete box.dataset.original;
//             } else {
//                 el.replaceWith(el.innerText); // fallback
//             }
//         });

//         // 검색 상태 초기화
//         isSearchMode = false;
//         searchMsgIds = [];
//         currentSearchIndex = -1;
//         currentSearchKeyword = "";
//         jumpMsgId = null;
//         isSearchJump = false;

//         updateSearchCounter();
//     });

//     tabSearch.addEventListener('click', () => {
//         tabSearch.classList.add('active');
//         tabAll.classList.remove('active');
//         searchBox.style.display = 'flex';
//     });


//     // 우측 채팅방 헤더 버튼 드롭다운 토글
//     const menuBtn = document.getElementById('menuBtn');
//     const menuDropdown = document.getElementById('menuDropdown');

//     menuBtn.addEventListener('click', (e) => {
//         e.stopPropagation();
//         menuDropdown.style.display = menuDropdown.style.display === 'flex' ? 'none' : 'flex';
//     });

//     // 다른 곳 클릭 시 닫기
//     document.addEventListener('click', () => {
//         menuDropdown.style.display = 'none';
//     });



//     connectWS();
//     loadChatRooms();

//     // 안읽은 채팅만 보기
//     const unreadCheckbox = document.getElementById("unread-only");
//     unreadCheckbox.addEventListener("change", () => {

//         const items = document.querySelectorAll(".chat-item");

//         items.forEach(item => {

//             const badge = item.querySelector(".badge");

//             if (unreadCheckbox.checked) {
//                 // unread 없는 방 숨김
//                 if (!badge) {
//                     item.style.display = "none";
//                 }
//             } else {
//                 // 전체 다시 표시
//                 item.style.display = "flex";
//             }

//         });
//     });

//     // 검색 타입
//     searchInput.addEventListener("input", () => {
//         const keyword = searchInput.value.trim();
//         const searchType = searchTypeSelect.value; // 'message' 또는 'user'

//         if (!keyword) {
//             searchMsgIds = [];
//             currentSearchIndex = -1;
//             isSearchMode = false;
//             document.querySelectorAll(".chat-item").forEach(item => item.style.display = "flex");
//             updateSearchCounter();
//             return;
//         }

//         currentSearchKeyword = keyword.toLowerCase();
//         isSearchMode = true;

//         // 검색 API 호출 시 searchType 같이 넘기기
//         fetch(`/chat/rooms/search?user_id=${myUserId}&keyword=${encodeURIComponent(keyword)}&type=${searchType}`)
//             .then(res => {
//                 console.log(res.headers.get('content-type')); // application/json인지 확인
//                 return res.json();
//             })
//             .then(results => {
//                 console.log(results);
//                 const resultMap = new Map();
//                 results.forEach(r => {
//                     const roomId = r.room_id;
//                     const msgId = r.search_msg_id; // 메시지 검색일 때만 존재
//                     if (!resultMap.has(roomId)) resultMap.set(roomId, []);
//                     if (msgId) resultMap.get(roomId).push(msgId);
//                 });

//                 document.querySelectorAll(".chat-item").forEach(item => {
//                     const roomId = Number(item.dataset.room_id);

//                     if (resultMap.has(roomId)) {
//                         item.style.display = "flex";
//                         const msgIds = resultMap.get(roomId);
//                         item.dataset.jump_msg_id = msgIds[0] || "";
//                         console.log(`room_id: ${roomId}, jumpMsgId: ${item.dataset.jump_msg_id}`);
//                         console.log("전체 검색 msgIds 배열:", msgIds);
//                         item.dataset.search_msg_ids = JSON.stringify(msgIds);
//                     } else {
//                         item.style.display = "none";
//                         item.dataset.jump_msg_id = "";
//                         item.dataset.search_msg_ids = "[]";
//                     }
//                 });
//                 if (currentRoomId && resultMap.has(currentRoomId)) {
//                     searchMsgIds = resultMap.get(currentRoomId);
//                     currentSearchIndex = -1; // 아직 점프 안함
//                 }
//             })
//             .catch(err => console.error(err));
//     });

//     searchInput.addEventListener("keydown", (e) => {

//         if (!isSearchMode || searchMsgIds.length === 0) return;

//         if (e.key === "Enter" || e.key === "ArrowDown") {

//             e.preventDefault();

//             currentSearchIndex =
//                 (currentSearchIndex + 1) % searchMsgIds.length;

//             const nextId = searchMsgIds[currentSearchIndex];
//             if (!nextId) return;

//             jumpMsgId = nextId;
//             isSearchJump = true;

//             const container = document.getElementById("messages");
//             const target = container.querySelector(
//                 `[data-msg_id="${jumpMsgId}"]`
//             );

//             const doJump = () => {
//                 jumpToMessage(jumpMsgId, currentSearchKeyword);
//             };

//             if (target) {
//                 doJump();
//             } else {
//                 loadMessages(currentRoomId);
//                 setTimeout(doJump, 80);
//             }
//             updateSearchCounter();
//         }
//     });



//     document.getElementById("nextSearchBtn").addEventListener("click", () => {
//         if (!isSearchMode || searchMsgIds.length === 0) return;

//         currentSearchIndex = (currentSearchIndex + 1) % searchMsgIds.length;
//         const nextId = searchMsgIds[currentSearchIndex];

//         if (!nextId) return; // 유저 검색은 점프 없음

//         jumpMsgId = nextId;
//         isSearchJump = true;

//         const container = document.getElementById("messages");
//         const target = container.querySelector(`[data-msg_id="${jumpMsgId}"]`);

//         const doJump = () => {
//             jumpToMessage(jumpMsgId, currentSearchKeyword);
//         };

//         if (target) {
//             doJump();
//         } else {
//             loadMessages(currentRoomId);
//             setTimeout(doJump, 80);
//         }
//         updateSearchCounter();
//     });



// });

// // 전송 버튼
// document.querySelector(".btn-send").addEventListener("click", () => {

//     const textarea = document.getElementById("chat-textarea");
//     const content = textarea.value;

//     if (!content.trim()) return;
//     if (!currentRoomId) return;
//     if (!stompClient || !stompClient.connected) return;

//     const payload = {
//         roomId: currentRoomId,
//         senderId: myUserId,
//         receiverId: receiverId,
//         content: content
//     };

//     console.log("SENDING PAYLOAD:", payload);
//     stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(payload));

//     textarea.value = "";
// });

// // 파일 첨부
// fileInput.addEventListener("change", (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("sender_id", myUserId);
//     formData.append("receiver_id", receiverId);
//     formData.append("room_id", currentRoomId);

//     fetch("/chat/rooms/upload", {
//         method: "POST",
//         body: formData
//     })
//         .then(res => res.json())
//         .then(data => {
//             // 전송 후 appendMessage 호출 가능
//             appendMessage(data);
//         })
//         .catch(err => console.error("파일 전송 실패", err));

//     fileInput.value = ""; // 다음 업로드를 위해 초기화
// });


