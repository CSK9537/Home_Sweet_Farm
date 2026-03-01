<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<jsp:include page="/WEB-INF/views/layout/header.jsp" />

<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/community/CommunityForm.css">
<link rel="stylesheet" href="https://uicdn.toast.com/editor/latest/toastui-editor.min.css">
<script src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js"></script>

<%-- =========================================================
  ✅ Controller(/community/form) 정합
  - model: mode, tempKey, boardType 내려옴
  - POST : /community/write, /community/edit
  - upload: /community/upload(file,tempKey,boardType)
========================================================= --%>

<c:set var="modeVal" value="${not empty mode ? mode : (empty post ? 'insert' : 'edit')}" />
<c:set var="boardTypeVal"
       value="${not empty boardType ? boardType : (modeVal eq 'edit' ? post.board_type : param.type)}" />

<div class="page-shell">
  <section class="content-wrap">
    <div class="content-card">

      <div class="insert-head">
        <div class="insert-title">
          <c:choose>
            <c:when test="${modeVal eq 'edit'}">글수정</c:when>
            <c:otherwise>글쓰기</c:otherwise>
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
                      <c:when test='${modeVal eq "edit"}'>${pageContext.request.contextPath}/community/edit</c:when>
                      <c:otherwise>${pageContext.request.contextPath}/community/write</c:otherwise>
                    </c:choose>"
            method="post"
            enctype="multipart/form-data">

        <%-- mode / board_id --%>
        <input type="hidden" id="mode" value="${modeVal}">
        <c:if test="${modeVal eq 'edit'}">
          <input type="hidden" name="board_id" id="boardId" value="${post.board_id}">
        </c:if>

        <%-- ✅ 컨트롤러(write/edit)가 요구: tempKey --%>
        <input type="hidden" name="tempKey" id="tempKey" value="${tempKey}">

        <%-- BoardVO 바인딩용 --%>
        <input type="hidden" name="board_type" id="boardType" value="${boardTypeVal}">
        <input type="hidden" name="parent_id" id="parentId"
               value="<c:out value='${modeVal eq "edit" ? post.parent_id : param.parentId}'/>">

        <%-- ✅ 컨트롤러(write/edit)가 요구: contentHtml / tagsHidden --%>
        <input type="hidden" name="contentHtml" id="contentHtml">
        <input type="hidden" name="tagsHidden" id="tagsHidden"
               value="<c:out value='${modeVal eq "edit" ? post.tags : ""}'/>">

        <%-- (옵션) 업로드된 이미지 메타(추후 활용 가능) --%>
        <input type="hidden" name="uploadedImagesJson" id="uploadedImagesJson" value="[]">

        <div class="form-row form-row--grid">
          <div class="form-field">
            <label class="label">게시판</label>
            <select class="select" id="typeSelect" disabled>
              <option value="G">자유게시판</option>
              <option value="T">중고거래</option>
              <option value="S">나눔</option>
              <option value="Q">질문글</option>
              <option value="A">답글</option>
            </select>
            <div class="hint">
              커뮤니티 글쓰기(insert)에서는 G/T/S만 노출되며 변경 가능합니다. QnA(Q/A)는 자동 결정 및 변경 불가입니다.
            </div>
          </div>

          <div class="form-field">
            <label class="label">말머리</label>
            <select class="select" name="category_id" id="headSelect">
              <option value="" data-for="G,Q">선택 안 함</option>

              <option value="101" data-for="G">일상</option>
              <option value="102" data-for="G">정보</option>
              <option value="103" data-for="G">공지</option>
              <option value="104" data-for="G">기타</option>

              <option value="201" data-for="T">판매</option>
              <option value="301" data-for="S">나눔</option>

              <option value="401" data-for="Q">질문</option>
              <option value="501" data-for="A">답변</option>
            </select>
            <div class="hint">현재 type에 맞는 말머리만 노출됩니다.</div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-field">
            <label class="label">제목</label>
            <input class="input" type="text" name="title" id="title"
                   placeholder="제목을 입력해 주세요." maxlength="200" required
                   value="<c:out value='${modeVal eq "edit" ? post.title : ""}'/>">
          </div>
        </div>

        <div class="form-row form-row--grid" id="tradeBox" style="display:none;">
          <div class="form-field">
            <label class="label">가격</label>
            <input class="input" type="number" name="price" id="price"
                   placeholder="예) 40000" min="0" step="100"
                   value="<c:out value='${modeVal eq "edit" ? post.price : ""}'/>">
            <div class="hint">중고거래(T)에서는 가격 사용을 권장합니다.</div>
          </div>

          <div class="form-field">
            <label class="label">거래상태</label>
            <select class="select" name="trade_status" id="tradeStatus">
              <option value="P">진행중</option>
              <option value="C">완료</option>
            </select>
            <div class="hint">T/S에서만 의미가 있습니다.</div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-field">
            <label class="label">첨부파일(선택)</label>
            <input class="input" type="file" name="attachFiles" id="attachFiles" multiple>
            <div class="hint">
              이미지 파일은 자동 업로드되어 본문에 삽입되며, submit 시에는 첨부에서 제외됩니다(중복 저장 방지).<br/>
              문서/압축 등 비이미지 파일만 “첨부”로 제출됩니다.
            </div>
            <div id="fileList" class="file-list" style="display:none;"></div>
          </div>
        </div>

        <div class="form-row">
          <label class="label">본문</label>
          <div id="editor" class="editor-box"></div>

          <c:if test="${modeVal eq 'edit'}">
            <textarea id="initContent" style="display:none;"><c:out value="${post.content}" escapeXml="false"/></textarea>
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

            <div class="hint">Enter/쉼표로 추가 · Backspace로 마지막 태그 삭제 (띄어쓰기 불가)</div>
          </div>
        </div>

      </form>
    </div>
  </section>
</div>

<script>
  window.__CTX__ = "${pageContext.request.contextPath}";
  window.__IS_OWNER__ = ${modeVal eq 'edit' ? isOwner : true};
  window.__INIT_CATEGORY__ = "${modeVal eq 'edit' ? post.category_id : ''}";
  window.__INIT_TRADE_STATUS__ = "${modeVal eq 'edit' ? post.trade_status : ''}";
</script>

<script src="${pageContext.request.contextPath}/resources/js/community/CommunityForm.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />