<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<jsp:include page="/WEB-INF/views/layout/header.jsp" />

<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/community/CommunityView.css" />
<style>
  /* Q&A 전용 스타일 보완 */
  .qv-answer-section { margin-top: 40px; }
  .qv-answer-item { border: 1px solid #eee; border-radius: 8px; padding: 20px; margin-bottom: 20px; transition: all 0.2s; }
  .qv-answer-item.is-selected { border-color: #8bc34a; background-color: #f9fff0; box-shadow: 0 2px 8px rgba(139, 195, 74, 0.2); }
  .qv-selected-badge { display: inline-block; background: #8bc34a; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-bottom: 10px; font-weight: bold; }
  .qv-answer-write { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
  .qv-comment-container { margin-top: 15px; padding-left: 20px; border-left: 2px solid #eee; }
  .qv-comment-toggle-btn { background: none; border: none; color: #666; font-size: 13px; cursor: pointer; padding: 5px 0; }
  .qv-comment-toggle-btn:hover { color: #333; text-decoration: underline; }
</style>

<div class="page-shell">
  <div class="content-wrap">
    <div class="content-card community-view">

      <!-- 상단 네비게이션 -->
      <div class="cv-top-actions">
        <button type="button" class="cv-top-btn" id="btnList">목록으로</button>
      </div>

      <!-- [1] 질문글(Question) 영역 -->
      <div class="cv-post qv-question-box">
        <div class="cv-breadcrumb">
          <span class="cv-category">Q&A 질문</span>
        </div>

        <h1 class="cv-title">${board.title}</h1>

        <div class="cv-meta">
          <div class="cv-writer">
            <div class="cv-avatar"><span class="cv-avatar-fallback"></span></div>
            <div class="cv-writer-info">
              <div class="cv-writer-line">
                <a href="javascript:void(0)" class="js-user-trigger cv-nick" data-user-id="${board.user_id}" data-user-nick="${board.writer}">${board.writer}</a>
              </div>
              <div class="cv-date-line">
                <span class="cv-date"><fmt:formatDate value="${board.reg_date}" pattern="yyyy.MM.dd HH:mm" /></span>
              </div>
            </div>
          </div>
          <div class="cv-stats">
            <span>조회 ${board.view_cnt}</span>
            <span class="cv-bar">|</span>
            <span>좋아요 ${board.like_cnt}</span>
          </div>
        </div>

        <div class="cv-divider"></div>

        <div class="cv-content">
          <c:out value="${board.content}" escapeXml="false"/>
        </div>

        <!-- 질문 하단 액션 -->
        <div class="cv-post-actions">
          <div class="cv-post-actions__left">
            <button type="button" class="cv-btn cv-btn-ghost js-board-like" data-id="${board.board_id}">좋아요</button>
            <c:if test="${loginUserId != board.user_id}">
              <button type="button" class="cv-btn cv-btn-ghost cv-report-btn">신고</button>
            </c:if>
          </div>
          <div class="cv-post-actions__right">
            <c:if test="${loginUserId == board.user_id}">
              <button type="button" class="cv-btn cv-btn-ghost" id="btnEditQuestion">수정</button>
              <button type="button" class="cv-btn cv-btn-danger" id="btnDeleteQuestion">삭제</button>
            </c:if>
          </div>
        </div>
      </div>

      <!-- [2] 질문 댓글 영역 (본문용 댓글) -->
      <div class="cv-comments qv-question-comments">
        <div class="cv-section-title">질문 댓글</div>
        <div class="cv-comment-write">
           <div class="cv-comment-form">
             <textarea class="cv-textarea js-reply-content" data-parent-id="${board.board_id}" placeholder="질문에 대한 간단한 의견을 남겨주세요."></textarea>
             <div class="cv-form-actions">
               <button type="button" class="cv-btn cv-btn-primary js-reply-submit" data-parent-id="${board.board_id}">등록</button>
             </div>
           </div>
        </div>
        <div class="js-reply-list-container" data-board-id="${board.board_id}">
            <!-- AJAX로 로드될 질문 댓글 목록 -->
            <ul class="cv-comment-list js-reply-list"></ul>
        </div>
      </div>

      <div class="cv-divider" style="margin: 40px 0;"></div>

      <!-- [3] 답변 작성 영역 -->
      <div class="qv-answer-write">
        <div class="cv-section-title">나의 답변 남기기</div>
        <p style="font-size: 14px; color: #666; margin-bottom: 15px;">정확하고 친절한 답변은 질문자에게 큰 도움이 됩니다.</p>
        <!-- 답변 작성은 QnaForm과 유사한 에디터를 쓰거나, 간단한 영역을 제공할 수 있음 -->
        <!-- 여기서는 CommunityView 스타일의 텍스트 영역을 확장하여 사용 -->
        <textarea id="answerContent" class="cv-textarea" style="height: 150px;" placeholder="답변 내용을 상세히 입력해주세요."></textarea>
        <div class="cv-form-actions" style="margin-top: 10px;">
          <button type="button" class="cv-btn cv-btn-primary" id="btnAnswerSubmit">답변 등록</button>
        </div>
      </div>

      <!-- [4] 답변 목록(Answers) -->
      <div class="qv-answer-section">
        <div class="cv-section-title">답변 <span class="text-primary">${answerList.size()}</span></div>
        
        <c:if test="${empty answerList}">
          <div style="text-align: center; padding: 40px; color: #999;">아직 등록된 답변이 없습니다. 첫 번째 답변의 주인공이 되어보세요!</div>
        </c:if>

        <c:forEach var="ans" items="${answerList}">
          <div class="qv-answer-item ${ans.is_selected eq 'Y' ? 'is-selected' : ''}" data-answer-id="${ans.board_id}">
            <c:if test="${ans.is_selected eq 'Y'}">
              <div class="qv-selected-badge">채택된 답변</div>
            </c:if>

            <div class="cv-meta">
              <div class="cv-writer">
                <div class="cv-avatar cv-avatar-sm"><span class="cv-avatar-fallback"></span></div>
                <div class="cv-writer-info">
                  <div class="cv-writer-line">
                    <a href="javascript:void(0)" class="js-user-trigger cv-nick" data-user-id="${ans.user_id}" data-user-nick="${ans.writer}">${ans.writer}</a>
                  </div>
                  <div class="cv-date-line">
                    <span class="cv-date"><fmt:formatDate value="${ans.reg_date}" pattern="yyyy.MM.dd HH:mm" /></span>
                  </div>
                </div>
              </div>
              <div class="cv-stats">
                 <c:if test="${loginUserId == board.user_id && board.is_selected ne 'Y'}">
                    <button type="button" class="cv-btn cv-btn-ghost cv-btn-sm js-btn-select-answer" data-id="${ans.board_id}">채택하기</button>
                 </c:if>
                 <button type="button" class="cv-btn cv-btn-ghost cv-btn-sm js-board-like" data-id="${ans.board_id}">좋아요 ${ans.like_cnt}</button>
              </div>
            </div>

            <div class="cv-content" style="margin: 15px 0;">
              <c:out value="${ans.content}" escapeXml="false"/>
            </div>

            <div class="cv-post-actions" style="border: none; padding: 0;">
               <div class="cv-post-actions__right">
                  <c:if test="${loginUserId == ans.user_id}">
                    <button type="button" class="cv-btn cv-btn-ghost cv-btn-sm js-btn-edit-answer" data-id="${ans.board_id}">수정</button>
                    <button type="button" class="cv-btn cv-btn-ghost cv-btn-sm js-btn-delete-answer" data-id="${ans.board_id}">삭제</button>
                  </c:if>
               </div>
            </div>

            <!-- 답변별 댓글 영역 (비동기) -->
            <div class="qv-comment-container">
              <button type="button" class="qv-comment-toggle-btn js-reply-toggle" data-answer-id="${ans.board_id}">
                댓글 <span class="js-reply-count">${ans.reply_cnt}</span>개 보기 ▾
              </button>
              
              <div class="js-answer-reply-box" style="display: none;" data-board-id="${ans.board_id}">
                <ul class="cv-comment-list js-reply-list">
                  <!-- 댓글 목록 AJAX 로드 -->
                </ul>
                <div class="cv-reply-write" style="margin-top: 10px;">
                  <input type="text" class="cv-input js-reply-input" placeholder="댓글을 입력하세요" />
                  <button type="button" class="cv-btn cv-btn-primary cv-btn-sm js-reply-submit" data-parent-id="${ans.board_id}">등록</button>
                </div>
              </div>
            </div>
          </div>
        </c:forEach>
      </div>

    </div>
  </div>
</div>

<script>
  window.__CTX__ = "${pageContext.request.contextPath}";
  window.__LOGIN_USER_ID__ = "${loginUserId}";
  window.__BOARD_ID__ = "${board.board_id}";
  window.__BOARD_WRITER_ID__ = "${board.user_id}";
  window.__IS_POST_SELECTED__ = "${board.is_selected eq 'Y'}";
</script>

<script src="${pageContext.request.contextPath}/resources/js/qna/QnaView.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
