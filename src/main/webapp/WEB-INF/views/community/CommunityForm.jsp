<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<jsp:include page="/WEB-INF/views/layout/header.jsp" />

<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/community/CommunityForm.css">
<link rel="stylesheet" href="https://uicdn.toast.com/editor/latest/toastui-editor.min.css">
<script src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js"></script>

<c:set var="modeVal" value="${not empty mode ? mode : (empty post ? 'insert' : 'edit')}" />
<c:set var="boardTypeVal"
       value="${not empty boardType ? boardType : (modeVal eq 'edit' ? post.board_type : param.type)}" />
<c:set var="safeTempKey" value="${not empty tempKey ? tempKey : ''}" />

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

        <input type="hidden" id="mode" value="${modeVal}">

        <c:if test="${modeVal eq 'edit'}">
          <input type="hidden" name="board_id" id="boardId" value="${post.board_id}">
        </c:if>

        <input type="hidden" name="tempKey" id="tempKey" value="${safeTempKey}">
        <input type="hidden" name="board_type" id="boardType" value="${boardTypeVal}">
        <input type="hidden" name="parent_id" id="parentId"
               value="<c:out value='${modeVal eq "edit" ? post.parent_id : param.parentId}'/>">

        <input type="hidden" name="contentHtml" id="contentHtml">
        <input type="hidden" name="tagsHidden" id="tagsHidden"
               value="<c:out value='${modeVal eq "edit" ? editTags : ""}'/>">
        <input type="hidden" name="uploadedImagesJson" id="uploadedImagesJson" value="[]">
        <input type="hidden" name="uploadedAttachFilesJson" id="uploadedAttachFilesJson" value="[]">
        <input type="hidden" name="existingDeletedFileIds" id="existingDeletedFileIds" value="">
        <input type="hidden" name="thumbnailTarget" id="thumbnailTarget" value="">

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
            <select class="select" name="category_id" id="headSelect" required>
              <option value="" data-for="G,Q">선택 안 함</option>
              <option value="120" data-for="G">일상</option>
              <option value="130" data-for="G">정보</option>
              <option value="140" data-for="G">후기</option>
              <option value="150" data-for="G">공지</option>
              <option value="160" data-for="T">판매</option>
              <option value="170" data-for="T">구매</option>
              <option value="180" data-for="S">나눔</option>
              <option value="190" data-for="Q">질문</option>
              <option value="200" data-for="A">답변</option>
            </select>
            <div class="hint">현재 type에 맞는 말머리만 노출됩니다.</div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-field">
            <label class="label">제목</label>
            <input type="text" name="title" class="input"
                   value="<c:out value='${modeVal eq "edit" ? post.title : ""}'/>"
                   maxlength="200" placeholder="제목을 입력해 주세요.">
          </div>
        </div>

        <div class="form-row" id="tradeBox" style="display:none;">
		  <div class="form-field">
		    <label class="label">가격</label>
		
		    <input type="number"
		           name="price"
		           id="price"
		           class="input"
		           value="<c:out value='${modeVal eq "edit" ? post.price : ""}'/>"
		           min="0"
		           inputmode="numeric"
		           placeholder="가격을 입력해 주세요.">
		
		    <div id="priceTextDisplay" class="hint" style="display:none;">나눔</div>
		    <div id="priceHint" class="hint">
		      	판매글은 가격 필수, 구매글은 선택사항, 나눔글은 가격 입력이 불가능합니다.
		    </div>
		  </div>
		
		  <div class="form-field">
		    <label class="label">거래상태</label>
		    <select name="trade_status" id="tradeStatus" class="select">
		      <option value="P">진행중</option>
		      <option value="C">거래완료</option>
		    </select>
		  </div>
		</div>

        <div class="form-row">
          <div class="form-field">
            <label class="label" for="attachFiles">첨부파일</label>

            <input type="file"
                   name="attachFiles"
                   id="attachFiles"
                   class="input-file"
                   multiple>

            <div class="hint">
            	여러 파일을 첨부할 수 있습니다.
			      이미지 미리보기는 제공하지 않으며, 이미지 파일은 썸네일 선택이 가능합니다.
			      벼룩시장(중고거래/나눔) 게시글은 이미지 첨부파일이 1개 이상 필수입니다.
			</div>

            <div id="filePreview" class="file-preview"></div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-field">
            <label class="label">본문</label>
            <div id="editor" class="editor-box"></div>

            <c:if test="${modeVal eq 'edit'}">
              <textarea id="initContent" style="display:none;"><c:out value="${post.content}" escapeXml="false"/></textarea>
            </c:if>
          </div>
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
  window.__EXISTING_FILES__ = [
    <c:forEach var="f" items="${existingFiles}" varStatus="st">
      {
        fileId: ${f.file_id},
        originalName: "<c:out value='${f.original_name}'/>",
        savedName: "<c:out value='${f.saved_name}'/>",
        subDir: "<c:out value='${f.sub_dir}'/>",
        size: ${f.file_size},
        contentType: "<c:out value='${f.content_type}'/>",
        fileKind: "<c:out value='${f.file_kind}'/>",
        isThumbnail: "<c:out value='${f.is_thumbnail}'/>",
        url: "${pageContext.request.contextPath}/community/file?subDir=<c:out value='${f.sub_dir}'/>&savedName=<c:out value='${f.saved_name}'/>"
      }<c:if test="${!st.last}">,</c:if>
    </c:forEach>
  ];
</script>

<script src="${pageContext.request.contextPath}/resources/js/community/CommunityForm.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />