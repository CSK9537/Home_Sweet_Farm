<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<div class="store-category-container">
    <div class="category-menu-wrapper">
        <ul class="category-menu">
            <li class="category-item ${empty param.categoryId and empty category_id and pageContext.request.requestURI.endsWith('StoreMain.jsp') ? 'active' : ''}">
                <a href="${pageContext.request.contextPath}/store">전체</a>
            </li>
            <c:if test="${not empty categoryList}">
                <c:forEach var="cat" items="${categoryList}">
                    <li class="category-item ${(param.categoryId == cat.category_id or category_id == cat.category_id) ? 'active' : ''}">
                        <a href="${pageContext.request.contextPath}/store/productListPage/category/${cat.category_id}">
                            <c:out value="${cat.category_name}" />
                        </a>
                    </li>
                </c:forEach>
            </c:if>
            <li class="category-item ${pageContext.request.requestURI.contains('/sale') or categoryName eq '세일 중인 상품' ? 'active' : ''}">
                <a href="${pageContext.request.contextPath}/store/sale">세일</a>
            </li>
        </ul>
    </div>
</div>
