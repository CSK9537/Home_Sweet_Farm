<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
  <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
    <%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
      <%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

        <jsp:include page="/WEB-INF/views/layout/header.jsp" />

        <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/community/CommunityView.css" />

        <c:set var="boardTab" value="${board.board_type eq 'T' or board.board_type eq 'S' ? 'MARKET' : 'FREE'}" />

        <div class="page-shell">
          <div class="content-wrap">
            <div class="content-card community-view">

              <!-- 상단 네비 -->
              <div class="cv-top-actions">
                <button type="button" class="cv-top-btn" id="btnPrev" data-id="${not empty prev ? prev.board_id : ''}"
                  ${empty prev ? "disabled='disabled'" : "" }>이전글</button>

                <button type="button" class="cv-top-btn" id="btnNext" data-id="${not empty next ? next.board_id : ''}"
                  ${empty next ? "disabled='disabled'" : "" }>다음글</button>

                <button type="button" class="cv-top-btn" id="btnList">목록</button>
              </div>

              <!-- 게시글 -->
              <div class="cv-post">

                <div class="cv-breadcrumb">
                  <!-- 1) 커뮤니티 메인 -->
                  <a class="cv-bc-link" href="${pageContext.request.contextPath}/community/main">
                    커뮤니티
                  </a>

                  <span class="cv-sep">&gt;</span>

                  <!-- 2) 게시판 타입 -->
                  <a class="cv-bc-link" id="boardTypeLink" data-board-type="${board.board_type}"
                    data-board-tab="${boardTab}"
                    href="${pageContext.request.contextPath}/community/list?type=${boardTab}">
                  </a>

                  <span class="cv-sep">&gt;</span>

                  <!-- 3) 말머리 -->
                  <span class="cv-category">
                    ${category.category_name}
                  </span>
                </div>

                <div class="cv-title-row">
                  <h1 class="cv-title">${board.title}</h1>
                </div>

                <div class="cv-meta">
                  <div class="cv-writer">
                    <div class="cv-avatar">
                      <span class="cv-avatar-fallback"></span>
                    </div>

                    <div class="cv-writer-info">
                      <div class="cv-writer-line cv-user-pop-wrap">
                        <a href="javascript:void(0)" class="js-user-trigger cv-nick" data-user_id="${board.user_id}"
                          data-nickname="${board.writer}" data-user-id="${board.user_id}"
                          data-user-nick="${board.writer}">
                          ${board.writer}
                        </a>

                        <div class="cv-pop cv-user-pop js-inline-user-pop" style="display:none;">
                          <button type="button" class="cv-pop-item" data-action="boardView">게시글보기</button>
                          <button type="button" class="cv-pop-item" data-action="chat">채팅하기</button>
                          <button type="button" class="cv-pop-item" data-action="report">프로필 신고하기</button>
                          <button type="button" class="cv-pop-item cv-pop-danger" data-action="block">차단하기</button>
                        </div>
                      </div>

                      <div class="cv-date-line">
                        <span class="cv-date">
                          작성
                          <fmt:formatDate value="${board.reg_date}" pattern="yyyy.MM.dd" />
                        </span>

                        <c:if test="${not empty board.update_date}">
                          <span class="cv-dot">||</span>
                          <span class="cv-updated">
                            수정
                            <fmt:formatDate value="${board.update_date}" pattern="yyyy.MM.dd" />
                          </span>
                        </c:if>
                      </div>
                    </div>
                  </div>

                  <div class="cv-stats">
                    <span>조회 <span id="viewCnt">${board.view_cnt}</span></span>
                    <span class="cv-bar">||</span>

                    <button type="button" class="cv-stat-btn" id="btnLikeStat" data-board-id="${board.board_id}" ${liked
                      ? "disabled='disabled'" : "" }>
                      좋아요 <span id="likeCntStat">${board.like_cnt}</span>
                    </button>

                    <span class="cv-bar">||</span>

                    <button type="button" class="cv-stat-btn" id="btnReplyStat">
                      댓글 <span id="replyCntStat">${board.reply_cnt}</span>
                    </button>
                  </div>
                </div>

                <div class="cv-divider"></div>

                <c:if test="${board.board_type eq 'T' or board.board_type eq 'S'}">
                  <div class="cv-market-box">
                    <div class="cv-market-item">
                      <span class="cv-market-label">거래유형</span>
                      <span class="cv-market-value">
                        <c:choose>
                          <c:when test="${board.board_type eq 'T'}">중고거래</c:when>
                          <c:when test="${board.board_type eq 'S'}">나눔</c:when>
                        </c:choose>
                      </span>
                    </div>

                    <div class="cv-market-item">
                      <span class="cv-market-label">거래상태</span>
                      <span class="cv-market-value">
                        <c:choose>
                          <c:when test="${board.trade_status eq 'C'}">완료</c:when>
                          <c:otherwise>진행중</c:otherwise>
                        </c:choose>
                      </span>
                    </div>

                    <div class="cv-market-item cv-market-item--price">
                      <span class="cv-market-label">가격</span>
                      <span class="cv-market-price">
                        <c:choose>
                          <c:when test="${board.board_type eq 'S'}">
                            나눔
                          </c:when>
                          <c:when test="${not empty board.price}">
                            <fmt:formatNumber value="${board.price}" pattern="#,###" />원
                          </c:when>
                          <c:otherwise>
                            가격 미정
                          </c:otherwise>
                        </c:choose>
                      </span>
                    </div>
                  </div>
                </c:if>

                <div class="cv-content">
                  <c:out value="${board.content}" escapeXml="false" />
                </div>

                <c:if test="${not empty board.hashtags}">
                  <div class="cv-hashtags">
                    <div class="cv-hashtags-title">해시태그</div>
                    <div class="cv-hashtags-list">
                      <c:forEach var="tag" items="${fn:split(board.hashtags, ',')}">
                        <c:if test="${not empty fn:trim(tag)}">
                          <span class="cv-hashtag">#${fn:trim(tag)}</span>
                        </c:if>
                      </c:forEach>
                    </div>
                  </div>
                </c:if>

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

                <div class="cv-post-actions">
                  <div class="cv-post-actions__left">
                    <button type="button" class="cv-btn cv-btn-ghost cv-like-btn" id="btnLikeBottom"
                      data-board-id="${board.board_id}" ${liked ? "disabled='disabled'" : "" }>
                      좋아요 <span id="likeCntBottom">${board.like_cnt}</span>
                    </button>

                    <button type="button" class="cv-btn cv-btn-ghost" id="btnBoardList">목록</button>

                    <c:if test="${loginUserId != board.user_id}">
                      <button type="button" class="cv-btn cv-btn-ghost cv-report-btn" id="btnBoardReport"
                        data-board-id="${board.board_id}">
                        신고
                      </button>
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

              <div id="replySection"></div>

              <div class="cv-comment-write">
                <div class="cv-section-title">댓글 작성</div>
                <div class="cv-comment-form">
                  <c:choose>
                    <c:when test="${not empty loginUserId}">
                      <textarea id="replyContent" class="cv-textarea" placeholder="내용을 입력하세요"></textarea>
                      <div class="cv-form-actions">
                        <button type="button" class="cv-btn cv-btn-ghost" id="btnReplyCancel">취소</button>
                        <button type="button" class="cv-btn cv-btn-primary" id="btnReplySubmit">등록</button>
                      </div>
                    </c:when>
                    <c:otherwise>
                      <textarea id="replyContent" class="cv-textarea" placeholder="로그인 후 이용 가능합니다" readonly></textarea>
                      <div class="cv-form-actions">
                        <button type="button" class="cv-btn cv-btn-primary"
                          onclick="location.href='${pageContext.request.contextPath}/member/login'">로그인하러 가기</button>
                      </div>
                    </c:otherwise>
                  </c:choose>
                </div>
              </div>

              <div class="cv-comments">
                <div class="cv-section-title">댓글</div>

                <div id="replyScroll" class="cv-comment-scroll">
                  <ul id="replyList" class="cv-comment-list">

                    <c:forEach var="r" items="${replyList}">
                      <li class="cv-comment-item" data-reply-id="${r.reply_id}" data-writer-id="${r.user_id}"
                        data-writer-nick="${r.writer}">

                        <div class="cv-comment-left">
                          <div class="cv-avatar cv-avatar-sm">
                            <span class="cv-avatar-fallback"></span>
                          </div>
                        </div>

                        <div class="cv-comment-body">
                          <div class="cv-comment-head">
                            <div class="cv-user-pop-wrap">
                              <a href="javascript:void(0)" class="js-user-trigger cv-nick" data-user_id="${r.user_id}"
                                data-nickname="${r.writer}" data-user-id="${r.user_id}" data-user-nick="${r.writer}">
                                ${r.writer}
                              </a>

                              <div class="cv-pop cv-user-pop js-inline-user-pop" style="display:none;">
                                <button type="button" class="cv-pop-item" data-action="boardView">게시글보기</button>
                                <button type="button" class="cv-pop-item" data-action="chat">채팅하기</button>
                                <button type="button" class="cv-pop-item" data-action="report">프로필 신고하기</button>
                                <button type="button" class="cv-pop-item cv-pop-danger"
                                  data-action="block">차단하기</button>
                              </div>
                            </div>

                            <span class="cv-comment-date">
                              <fmt:formatDate value="${r.reg_date}" pattern="yyyy.MM.dd HH:mm" />
                            </span>
                          </div>

                          <div class="cv-comment-text js-item-text">
                            <c:out value="${r.content}" />
                          </div>

                          <div class="cv-comment-actions">
                            <button type="button" class="cv-action-btn js-like-btn">
                              좋아요 <span class="js-like-count">${r.like_cnt}</span>
                            </button>

                            <button type="button" class="cv-action-btn js-reply-btn" data-target-nick="${r.writer}">
                              답글
                            </button>

                            <button type="button" class="cv-action-btn js-reply-toggle">
                              답글 <span class="js-reply-count">0</span>개 <span class="cv-caret">▾</span>
                            </button>
                          </div>

                          <div class="cv-replies js-replies" style="display:none;">
                            <ul class="cv-reply-list"></ul>

                            <div class="cv-reply-write">
                              <input type="text" class="cv-input js-reply-input" placeholder="답글을 입력하세요" />
                              <button type="button" class="cv-btn cv-btn-primary cv-btn-sm js-reply-submit">등록</button>
                            </div>
                          </div>
                        </div>

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

              <input type="hidden" id="board_id" value="${board.board_id}" />
              <input type="hidden" id="loginUserId" value="${loginUserId}" />
              <input type="hidden" id="prev_id" value="${not empty prev ? prev.board_id : ''}" />
              <input type="hidden" id="next_id" value="${not empty next ? next.board_id : ''}" />
              <input type="hidden" id="board_tab" value="${boardTab}" />

            </div>
          </div>
        </div>

        <script src="${pageContext.request.contextPath}/resources/js/community/CommunityView.js"></script>
        <jsp:include page="/WEB-INF/views/layout/footer.jsp" />