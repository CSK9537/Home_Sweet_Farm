<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<jsp:include page="/WEB-INF/views/layout/header.jsp" />

<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/community/CommunityForm.css">
<link rel="stylesheet" href="https://uicdn.toast.com/editor/latest/toastui-editor.min.css">
<script src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js"></script>

<%-- =========================================================
  ✅ Controller(/qna/ask) 정합
  - model: mode, tempKey, boardType 내려옴 (edit 시 question, isOwner 추가)
  - POST : /qna/write, /qna/edit
  - upload: /qna/upload(file,tempKey,boardType)
========================================================= --%>

<c:set var="modeVal" value="${not empty mode ? mode : (empty question ? 'insert' : 'edit')}" />
<c:set var="boardTypeVal"
       value="${not empty boardType ? boardType : (modeVal eq 'edit' ? question.board_type : 'Q')}" />

<div class="page-shell">
  <section class="content-wrap">
    <div class="content-card">

      <div class="insert-head">
        <div class="insert-title">
          <c:choose>
            <c:when test="${modeVal eq 'edit'}">질문 수정</c:when>
            <c:otherwise>질문하기</c:otherwise>
          </c:choose>
        </div>

        <div class="insert-actions">
          <button type="button" class="btn btn--ghost" onclick="history.back()">취소</button>

          <c:choose>
            <c:when test="${modeVal eq 'edit'}">
              <c:if test="${isOwner}">
                <button type="submit" form="writeForm" class="btn btn--primary">수정</button>
              </c:if>
            </c:when>
            <c:otherwise>
              <button type="submit" form="writeForm" class="btn btn--primary">등록</button>
            </c:otherwise>
          </c:choose>
        </div>
      </div>

      <c:if test="${modeVal eq 'edit' && !isOwner}">
        <div class="warn-box">작성자만 수정할 수 있습니다.</div>
      </c:if>

      <form id="writeForm"
            action="<c:choose>
                      <c:when test='${modeVal eq "edit"}'>${pageContext.request.contextPath}/qna/edit</c:when>
                      <c:otherwise>${pageContext.request.contextPath}/qna/write</c:otherwise>
                    </c:choose>"
            method="post"
            enctype="multipart/form-data">

        <%-- mode / board_id --%>
        <input type="hidden" id="mode" value="${modeVal}">
        <c:if test="${modeVal eq 'edit'}">
          <input type="hidden" name="board_id" id="boardId" value="${question.board_id}">
        </c:if>

        <%-- ✅ 컨트롤러(write/edit)가 요구: tempKey --%>
        <input type="hidden" name="tempKey" id="tempKey" value="${tempKey}">

        <%-- BoardVO 바인딩용 --%>
        <input type="hidden" name="board_type" id="boardType" value="${boardTypeVal}">
        
        <%-- ✅ 컨트롤러(write/edit)가 요구: contentHtml / tagsHidden --%>
        <input type="hidden" name="contentHtml" id="contentHtml">
        <input type="hidden" name="tagsHidden" id="tagsHidden"
               value="<c:out value='${modeVal eq "edit" ? question.tags : ""}'/>">

        <div class="form-row form-row--grid">
          <div class="form-field">
            <label class="label">카테고리</label>
            <select class="select" id="typeSelect" disabled>
              <option value="Q">질문</option>
            </select>
            <div class="hint">질문 및 답변 유형은 변경할 수 없습니다.</div>
          </div>

          <div class="form-field">
            <label class="label">관련 태그</label>
            <select class="select" name="category_id" id="headSelect">
              <option value="190" data-for="Q">일반질문</option>
            </select>
            <div class="hint">질문 성격에 맞는 분야를 선택해 주세요.</div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-field">
            <label class="label">제목</label>
            <input class="input" type="text" name="title" id="title"
                   placeholder="무엇이 궁금하신가요?" maxlength="200" required
                   value="<c:out value='${modeVal eq "edit" ? question.title : ""}'/>">
          </div>
        </div>

        <div class="form-row">
          <div class="form-field">
            <label class="label">첨부 파일(선택)</label>
            <input class="input" type="file" name="attachFiles" id="attachFiles" multiple>
            <div class="hint">이미지는 본문에 자동 삽입되며, 문서는 첨부 파일로 저장됩니다.</div>
            <div id="fileList" class="file-list" style="display:none;"></div>
          </div>
        </div>

        <div class="form-row">
          <label class="label">상세 내용</label>
          <div id="editor" class="editor-box"></div>

          <c:if test="${modeVal eq 'edit'}">
            <textarea id="initContent" style="display:none;"><c:out value="${question.content}" escapeXml="false"/></textarea>
          </c:if>
        </div>

        <div class="form-row">
          <div class="form-field">
            <label class="label">해시태그</label>

            <div class="tag-input-wrap">
              <div id="tagChips" class="tag-chips"></div>

              <input type="text" id="tagInput" class="input"
                     placeholder="#태그를 입력해주세요 (최대 10개)"
                     autocomplete="off" />

              <div id="tagSuggest" class="tag-suggest" style="display:none;"></div>
            </div>

            <div class="hint">Enter/쉼표로 추가 · Backspace로 마지막 태그 삭제</div>
          </div>
        </div>

      </form>
    </div>
  </section>
</div>

<script>
  window.__CTX__ = "${pageContext.request.contextPath}";
  window.__IS_OWNER__ = ${modeVal eq 'edit' ? isOwner : true};
  window.__INIT_CATEGORY__ = "${modeVal eq 'edit' ? question.category_id : ''}";
</script>

<script src="${pageContext.request.contextPath}/resources/js/qna/QnaForm.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />