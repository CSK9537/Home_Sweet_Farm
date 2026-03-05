<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<jsp:include page="/WEB-INF/views/layout/header.jsp" />

<%-- CommunityForm 스타일을 재사용하거나 별도 스타일 적용 가능 --%>
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/community/CommunityForm.css">
<style>
  .editor-box { min-height: 300px; border: 1px solid #ddd; border-radius: 8px; padding: 15px; }
  .img-preview-list { display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap; }
  .img-preview { width: 100px; height: 100px; object-fit: cover; border-radius: 4px; border: 1px solid #eee; }
</style>

<div class="page-shell">
  <section class="content-wrap">
    <div class="content-card">

      <div class="insert-head">
        <div class="insert-title">상품 등록 (Admin)</div>
        <div class="insert-actions">
          <button type="button" class="btn btn--ghost" onclick="history.back()">취소</button>
          <button type="button" id="btnSubmit" class="btn btn--primary">등록</button>
        </div>
      </div>

      <form id="productForm">
        <input type="hidden" name="tempKey" id="tempKey" value="${tempKey}">

        <div class="form-row form-row--grid">
          <div class="form-field">
            <label class="label">카테고리</label>
            <select class="select" name="category_id" id="categoryId">
              <c:forEach var="cat" items="${categoryList}">
                <option value="${cat.category_id}">${cat.category_name}</option>
              </c:forEach>
            </select>
          </div>
          <div class="form-field">
            <label class="label">상품명</label>
            <input class="input" type="text" name="product_name" id="productName" placeholder="상품명을 입력하세요" required>
          </div>
        </div>

        <div class="form-row form-row--grid">
          <div class="form-field">
            <label class="label">판매 가격 (원)</label>
            <input class="input" type="number" name="product_price" id="productPrice" placeholder="0" min="0">
          </div>
          <div class="form-field">
            <label class="label">배송비 (원)</label>
            <input class="input" type="number" name="product_delivery_price" id="productDeliveryPrice" placeholder="0" min="0">
          </div>
        </div>

        <div class="form-row form-row--grid">
          <div class="form-field">
            <label class="label">재고 수량</label>
            <input class="input" type="number" name="product_remain" id="productRemain" placeholder="0" min="0">
          </div>
          <div class="form-field">
            <label class="label">할인율 (%)</label>
            <input class="input" type="number" name="product_sale" id="productSale" placeholder="0" min="0" max="100">
          </div>
        </div>

        <div class="form-row">
          <div class="form-field">
            <label class="label">간략 설명</label>
            <input class="input" type="text" name="product_description_brief" id="productDescriptionBrief" placeholder="목록에 표시될 짧은 설명">
          </div>
        </div>

        <div class="form-row">
          <div class="form-field">
            <label class="label">상품 이미지 (첫 번째 이미지가 대표 이미지가 됩니다)</label>
            <input class="input" type="file" id="imageInput" multiple accept="image/*">
            <div id="imgPreviewList" class="img-preview-list"></div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-field">
            <label class="label">상세 설명</label>
            <textarea class="input" name="product_description_detail" id="productDescriptionDetail" rows="10" placeholder="상품 상세 정보를 입력하세요"></textarea>
          </div>
        </div>

        <div class="form-row">
          <div class="form-field">
            <label class="label">주의 사항</label>
            <input class="input" type="text" name="product_caution" id="productCaution" placeholder="주의 사항 (예: 생물 특성상 교환 불가)">
          </div>
        </div>
      </form>
    </div>
  </section>
</div>

<script>
  window.__CTX__ = "${pageContext.request.contextPath}";
</script>
<script src="${pageContext.request.contextPath}/resources/js/store/AdminProductForm.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
