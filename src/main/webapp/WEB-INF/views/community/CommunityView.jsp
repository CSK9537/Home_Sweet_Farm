<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<jsp:include page="/WEB-INF/views/layout/header.jsp" />

<link rel="stylesheet"
      href="${pageContext.request.contextPath}/resources/css/community/CommunityView.css" />

<div class="page-shell">
  <div class="content-wrap">
    <div class="content-card community-view">

      <!-- 상단 네비 -->
      <div class="cv-top-actions">
        <button type="button" class="cv-top-btn" id="btnPrev">이전글</button>
        <button type="button" class="cv-top-btn" id="btnNext">다음글</button>
        <button type="button" class="cv-top-btn" id="btnList">목록</button>
      </div>

      <!-- 게시글 -->
      <div class="cv-post">

        <div class="cv-breadcrumb">
          <span class="cv-category">${category.category_name}</span>
          <span class="cv-sep">&gt;</span>
        </div>

        <h1 class="cv-title">${board.title}</h1>

        <div class="cv-meta">
          <div class="cv-writer">
            <div class="cv-avatar">
              <span class="cv-avatar-fallback"></span>
            </div>

            <div class="cv-writer-info">
              <div class="cv-writer-line">
                <a href="javascript:void(0)"
                   class="js-user-trigger cv-nick"
                   data-user-id="${board.user_id}"
                   data-user-nick="${board.writer}">
                  ${board.writer}
                </a>
              </div>

              <div class="cv-date-line">
                <span class="cv-date">
                  <fmt:formatDate value="${board.reg_date}" pattern="yyyy.MM.dd HH:mm" />
                </span>

                <c:if test="${not empty board.update_date}">
                  <span class="cv-dot">•</span>
                  <span class="cv-updated">
                   	 수정 <fmt:formatDate value="${board.update_date}" pattern="yyyy.MM.dd HH:mm" />
                  </span>
                </c:if>
              </div>
            </div>
          </div>

          <div class="cv-stats">
            <span>조회 ${board.view_cnt}</span>
            <span class="cv-bar">|</span>
            <span>좋아요 ${board.like_cnt}</span>
            <span class="cv-bar">|</span>
            <span>댓글 ${board.reply_cnt}</span>
          </div>
        </div>

        <div class="cv-divider"></div>

        <div class="cv-content">
          <c:out value="${board.content}" escapeXml="false"/>
        </div>

        <!-- 첨부파일 -->
        <c:if test="${not empty fileList}">
          <div class="cv-attachments">
            <div class="cv-attach-title">첨부파일</div>
            <ul class="cv-attach-list">
              <c:forEach var="f" items="${fileList}">
                <li>
                  <a class="cv-attach-link"
                     href="${pageContext.request.contextPath}/community/file/download?file_id=${f.file_id}">
                    <c:out value="${f.original_name}" />
                  </a>
                </li>
              </c:forEach>
            </ul>
          </div>
        </c:if>

        <!-- ✅ 하단 버튼: (좌)목록+신고 / (우)수정+삭제 -->
        <div class="cv-post-actions">
          <div class="cv-post-actions__left">
            <button type="button" class="cv-btn cv-btn-ghost" id="btnBoardList">목록</button>

            <!-- 작성자 본인이면 신고 숨김, 타인이면 표시 -->
            <c:if test="${loginUserId != board.user_id}">
              <button type="button" class="cv-btn cv-btn-ghost cv-report-btn" id="btnBoardReport">신고</button>
            </c:if>
          </div>

          <div class="cv-post-actions__right">
            <c:if test="${loginUserId == board.user_id}">
              <button type="button" class="cv-btn cv-btn-ghost" id="btnBoardEdit">수정</button>
              <button type="button" class="cv-btn cv-btn-danger" id="btnBoardDelete">삭제</button>
            </c:if>
          </div>
        </div>
      </div>

      <!-- 댓글 작성 -->
      <div class="cv-comment-write">
        <div class="cv-section-title">댓글 작성</div>
        <div class="cv-comment-form">
          <textarea id="replyContent" class="cv-textarea" placeholder="내용을 입력하세요"></textarea>
          <div class="cv-form-actions">
            <button type="button" class="cv-btn cv-btn-ghost" id="btnReplyCancel">취소</button>
            <button type="button" class="cv-btn cv-btn-primary" id="btnReplySubmit">등록</button>
          </div>
        </div>
      </div>

      <!-- 댓글 목록 -->
      <div class="cv-comments">
        <div class="cv-section-title">댓글</div>

        <div id="replyScroll" class="cv-comment-scroll">
          <ul id="replyList" class="cv-comment-list">

            <c:forEach var="r" items="${replyList}">
              <li class="cv-comment-item"
                  data-reply-id="${r.reply_id}"
                  data-writer-id="${r.user_id}"
                  data-writer-nick="${r.writer}">

                <div class="cv-comment-left">
                  <div class="cv-avatar cv-avatar-sm">
                    <span class="cv-avatar-fallback"></span>
                  </div>
                </div>

                <div class="cv-comment-body">
                  <div class="cv-comment-head">
                    <a href="javascript:void(0)"
                       class="js-user-trigger cv-nick"
                       data-user-id="${r.user_id}"
                       data-user-nick="${r.writer}">
                      ${r.writer}
                    </a>

                    <div class="cv-comment-head-right">
                      <span class="cv-comment-date">
                        <fmt:formatDate value="${r.reg_date}" pattern="yyyy.MM.dd" />
                      </span>
                      <button type="button" class="cv-icon-btn js-more-menu" aria-label="menu">⋮</button>
                    </div>
                  </div>

                  <div class="cv-comment-text js-item-text">
                    <c:out value="${r.content}" />
                  </div>

                  <div class="cv-comment-actions">
                    <button type="button" class="cv-action-btn js-like-btn">
                      	좋아요 <span class="js-like-count">${r.like_cnt}</span>
                    </button>

                    <button type="button"
                            class="cv-action-btn js-reply-btn"
                            data-target-nick="${r.writer}">
                      	답글
                    </button>

                    <button type="button" class="cv-action-btn js-reply-toggle">
                      	답글 <span class="js-reply-count">0</span>개 <span class="cv-caret">▾</span>
                    </button>
                  </div>

                  <!-- 대댓글 영역 -->
                  <div class="cv-replies js-replies" style="display:none;">
                    <ul class="cv-reply-list"></ul>

                    <div class="cv-reply-write">
                      <input type="text" class="cv-input js-reply-input" placeholder="답글을 입력하세요" />
                      <button type="button" class="cv-btn cv-btn-primary cv-btn-sm js-reply-submit">등록</button>
                    </div>
                  </div>
                </div>

                <!-- ⋮ 메뉴(원댓글) -->
                <div class="cv-pop cv-cmt-pop js-more-pop" style="display:none;">
                  <button type="button" class="cv-pop-item js-edit">수정</button>
                  <button type="button" class="cv-pop-item cv-pop-danger js-delete">삭제</button>
                  <button type="button" class="cv-pop-item js-report">신고</button>
                </div>
              </li>
            </c:forEach>

          </ul>

          <div id="replyLoading" class="cv-loading" style="display:none;">불러오는 중...</div>
          <div id="replyEnd" class="cv-end" style="display:none;">마지막 댓글입니다.</div>
        </div>
      </div>

      <!-- 유저 팝업 -->
      <div id="userPop" class="cv-pop cv-user-pop" style="display:none;">
        <button type="button" class="cv-pop-item" data-action="boardView">게시글보기</button>
        <button type="button" class="cv-pop-item" data-action="chat">채팅하기</button>
        <button type="button" class="cv-pop-item" data-action="report">프로필 신고하기</button>
        <button type="button" class="cv-pop-item cv-pop-danger" data-action="block">차단하기</button>
      </div>

      <input type="hidden" id="board_id" value="${board.board_id}" />
      <input type="hidden" id="loginUserId" value="${loginUserId}" />
    </div>
  </div>
</div>

<script src="${pageContext.request.contextPath}/resources/js/community/CommunityView.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
