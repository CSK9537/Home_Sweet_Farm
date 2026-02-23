<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
	<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
		<!DOCTYPE html>
		<html>

		<head>
			<meta charset="UTF-8">
			<title>Insert title here</title>
			<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/chat/chat.css">
		</head>

		<body>
			<header class="top-bar">
				<div class="logo">사이트로고</div>
				<div class="account">
					<img src="https://via.placeholder.com/40" alt="프로필"> <span class="username">내계정</span>
				</div>
			</header>
			<div class="chat-container">


				<!-- 좌측 채팅 목록 -->
				<div class="chat-list">
					<div class="chat-list-header">
						<div class="chat-list-tabs">
							<div class="tab active" id="tab-all">전체보기</div>
							<div class="tab" id="tab-search">검색하기</div>
						</div>
					</div>

					<!-- 채팅방 목록 -->
					<div class="chat-items" id="items"></div>

					<!-- 검색 박스 (초기에는 hidden) -->
					<div class="chat-search-box" style="display: none;">
						<div class="search-top">
							<select id="searchType">
								<option value="message" selected>메시지</option>
								<option value="user">유저</option>
							</select> <input type="text" placeholder="검색어를 입력하세요..." />
						</div>

						<div class="search-bottom">
							<div class="search-nav">
								<button id="nextSearchBtn">다음</button>
							</div>
							<div class="search-counter">0 / 0</div>
						</div>

					</div>


					<!-- 하단 체크박스 -->
					<div class="chat-list-footer">
						<label> <input type="checkbox" id="unread-only"> 읽지
							않은 채팅만 보기
						</label>
					</div>
				</div>

				<!-- 우측 채팅 영역 -->
				<div class="chat-main">
					<div id="empty-view" class="empty-view">
						<div class="empty-content">
							<img src="/resources/img/logo.png" alt="logo" class="empty-logo">
							<div class="empty-text">채팅방을 선택해주세요.</div>
						</div>
					</div>
					<div id="chat-view" style="display: none; flex-direction: column; height: 100%;">
						<div class="chat-header">
							<div class="user-left" style="display: flex; align-items: center;">
								<img src="https://via.placeholder.com/40" alt="유저">
								<div class="user-info">
									<span class="name"></span> <span class="role"></span>
								</div>
							</div>


							<div class="btn-menu-container">
								<button class="btn-menu" id="menuBtn">
									<span></span> <span></span> <span></span>
								</button>
								<div class="menu-dropdown" id="menuDropdown">
									<button class="menu-item">나가기</button>
									<button class="menu-item">차단하기</button>
									<button class="menu-item">신고하기</button>
								</div>
							</div>
						</div>

						<!-- 채팅방 메세지 목록 -->
						<div class="chat-messages" id="messages"></div>
						<button id="new-msg-btn" class="new-msg-btn">⬇ 새 메시지 도착</button>

						<!-- 채팅방 하단 -->
						<div class="chat-input-container">
							<!-- 채팅 입력란 -->
							<div class="chat-textarea">
								<textarea id="chat-textarea" placeholder="메시지를 입력해주세요..." maxlength="1000"></textarea>
							</div>

							<!-- 채팅 버튼란 -->
							<div class="chat-button-area">
								<div class="left-buttons">
									<button class="btn-image" title="이미지 첨부">
										<img src="image_icon.png" alt="이미지">
									</button>
									<button class="btn-file" title="파일 첨부">
										<img src="file_icon.png" alt="파일">
									</button>
								</div>
								<div class="right-info">
									<span class="char-count" id="char-count">0/1000</span>
									<button class="btn-send">전송</button>
								</div>
							</div>
							<input type="file" id="imageInput" accept="image/*" multiple hidden>
							<input type="file" id="fileInput" multiple hidden>
						</div>

					</div>
				</div>

			</div>
			<!-- 이미지/파일 첨부 modal -->
			<div id="pendingFilesModal" class="modal modal-files">
				<div class="modal-content files-modal-content">
					<div class="modal-header">
						<h3 id="modalTitle">
							<c:choose>
								<c:when test="${uploadType eq 'IMAGE'}">
									이미지 첨부
								</c:when>
								<c:otherwise>
									파일 첨부
								</c:otherwise>
							</c:choose>
						</h3>
					</div>
					<div id="pendingFilesContainer"></div>
					<div class="modal-footer">
						<button id="attachBtn">첨부</button>
						<button id="uploadAllBtn" disabled>업로드</button>
						<button id="closeModalBtn">닫기</button>
					</div>
				</div>
				<!-- 숨겨진 input -->
				<input type="file" id="imageInput" accept="image/*" multiple hidden />
				<input type="file" id="fileInput" multiple hidden />
			</div>
			<!-- 이미지 확대 modal -->
			<div id="imagePreviewModal" class="modal">
				<div class="modal-content image-modal-content">
					<span id="closeImageModal" class="close-btn">&times;</span>
					<img id="previewImage" src="" alt="이미지 미리보기">
				</div>
			</div>


		</body>
		<script src="https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js"></script>
		<script src="https://cdn.jsdelivr.net/npm/stompjs@2.3.3/lib/stomp.min.js"></script>
		<script type="module" src="${pageContext.request.contextPath}/resources/js/chat/ChatMain.js"></script>

		</html>