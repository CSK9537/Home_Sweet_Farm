<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<jsp:include page="/WEB-INF/views/layout/header.jsp" />

<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/community/CommunityInsert.css">

<link rel="stylesheet" href="https://uicdn.toast.com/editor/latest/toastui-editor.min.css">
<script src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js"></script>

<div class="page-shell">
  <section class="content-wrap">
    <div class="content-card">

      <div class="insert-head">
        <div class="insert-title">글쓰기</div>
        <div class="insert-actions">
          <button type="button" class="btn btn--ghost" onclick="history.back()">취소</button>
          <button type="submit" form="writeForm" class="btn btn--primary">등록</button>
        </div>
      </div>

      <form id="writeForm"
            action="${pageContext.request.contextPath}/Community/Insert"
            method="post"
            enctype="multipart/form-data">

        <!-- 서버 전송 -->
        <input type="hidden" name="board_type" id="boardType" value="${param.type}">
        <input type="hidden" name="parent_id"  id="parentId"  value="${param.parentId}">
        <input type="hidden" name="content"    id="contentHtml">
        <input type="hidden" name="tags"       id="tagsHidden" value="">

        <!-- ★ 이미지 자동업로드 목록(중복 저장 방지용) -->
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
            <div class="hint">type 파라미터로 자동 결정됩니다.</div>
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
              <option value="202" data-for="T">구매</option>
              <option value="203" data-for="T">거래완료</option>

              <option value="301" data-for="S">나눔</option>
              <option value="302" data-for="S">완료</option>

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
                   placeholder="제목을 입력해 주세요." maxlength="200" required>
          </div>
        </div>

        <div class="form-row form-row--grid" id="tradeBox" style="display:none;">
          <div class="form-field">
            <label class="label">가격</label>
            <input class="input" type="number" name="price" id="price"
                   placeholder="예) 40000" min="0" step="100">
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

            <div class="hint">Enter/쉼표/스페이스로 추가 · Backspace로 마지막 태그 삭제</div>
          </div>
        </div>

      </form>
    </div>
  </section>
</div>

<script>
  window.__CTX__ = "${pageContext.request.contextPath}";
</script>
<script src="${pageContext.request.contextPath}/resources/js/community/CommunityInsert.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
