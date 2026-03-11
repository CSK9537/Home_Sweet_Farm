<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Home Sweet Farm</title>
<link rel="stylesheet" href="/webjars/sweetalert2/11.10.7/dist/sweetalert2.min.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/layout/header.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/layout/globals.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/layout/ContentLayout.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/layout/footer.css">

</head>
<body>
	<header class="header">
	  <div class="header__inner">
	
	    <!-- 데스크탑/태블릿: 로고 / 필터검색 / 로그인 유지 -->
	    <div class="header__top">
	      <a class="logo" href="/" aria-label="Home Sweet Farm">
	        <span class="logo__text">Home Sweet Farm</span>
	      </a>
	
	      <!-- 검색 (데스크탑/태블릿에서만 사용, 모바일에서는 CSS로 숨김) -->
	      <form class="fsearch" action="/searchResult" method="get">
            <span class="fsearch__icon" aria-hidden="true"></span>
            <input type="text" class="fsearch__input" name="q" placeholder="식물, 스토어, 커뮤니티, Q&A 검색" autocomplete="off" />
          </form>
		   
		    <div class="auth auth--desktop">
			  <c:choose>
			    <c:when test="${empty sessionScope.loginUser}">
				  <a class="auth__link" href="/user/login">로그인</a>
				  <span class="auth__sep" aria-hidden="true">||</span>
				  <a class="auth__link" href="/user/join">회원가입</a>
				</c:when>
				
				<c:otherwise>
				  <c:set var="profileUrl" value="/resources/image/default_profile.png" />
				  
				  <c:if test="${not empty sessionScope.loginUser.profile_filename}">
				    <c:set var="profileUrl" value="/user/getProfile?fileName=${sessionScope.loginUser.profile_filename}" />
				  </c:if>
				
				  <a class="auth__link profile-link" href="/user/mypage">
				    <img src="${profileUrl}" alt="프로필" class="profile-img">
				    <span class="profile-name">
				      ${not empty sessionScope.loginUser.nickname ? sessionScope.loginUser.nickname : sessionScope.loginUser.username}
				    </span>
				  </a>
				  <span class="auth__sep" aria-hidden="true">||</span>
				  <a class="auth__link" href="/user/logout">로그아웃</a>
				</c:otherwise>
		      </c:choose>
			</div>
	    </div>
	
	    <!-- 모바일 1줄: 햄버거 / 로그인 / 회원가입 -->
	    <div class="mrow mrow--top">
	      <button
	        class="mnav__btn"
	        type="button"
	        id="mnavBtn"
	        aria-label="메뉴 열기"
	        aria-expanded="false"
	        aria-controls="mnav"
	      >
	        <span class="mnav__icon" aria-hidden="true"><span></span></span>
	      </button>
	
	      <div class="auth auth--mobile">
	        <c:choose>
				<c:when test="${empty sessionScope.loginUser}">
					 <a class="auth__link" href="/user/login">로그인</a>
					 <span class="auth__sep" aria-hidden="true">||</span>
					 <a class="auth__link" href="/user/join">회원가입</a>
				</c:when>
					
				<c:otherwise>
				  <c:set var="profileUrl" value="/resources/image/default_profile.png" />
				  
				  <c:if test="${not empty sessionScope.loginUser.profile_filename}">
				    <c:set var="profileUrl" value="/user/getProfile?fileName=${sessionScope.loginUser.profile_filename}" />
				  </c:if>
				
				  <a class="auth__link profile-link" href="/user/mypage">
				    <img src="${profileUrl}" alt="프로필" class="profile-img">
				    <span class="profile-name">
				      ${not empty sessionScope.loginUser.nickname ? sessionScope.loginUser.nickname : sessionScope.loginUser.username}
				    </span>
				  </a>
				  <span class="auth__sep" aria-hidden="true">||</span>
				  <a class="auth__link" href="/user/logout">로그아웃</a>
				</c:otherwise>
			</c:choose>
	      </div>
	    </div>
	
	    <!-- 모바일 2줄: 로고 -->
	    <div class="mrow mrow--logo">
	      <a class="mlogo" href="/" aria-label="Home Sweet Farm">Home Sweet Farm</a>
	    </div>
	
	    <!-- 모바일 3줄: 필터 없는 검색창 -->
	    <div class="mrow mrow--search">
	      <form class="msearch" action="/searchResult" method="get" role="search" aria-label="모바일 검색">
	        <span class="fsearch__icon" aria-hidden="true"></span>
	        <input class="msearch__input" type="search" name="q" placeholder="검색어를 입력하세요" />
	      </form>
	    </div>
	
	    <!-- 데스크탑 메뉴바 유지 -->
	    <nav class="gnb gnb--desktop" aria-label="주요 메뉴">
	      <ul class="gnb__list">
	        <li class="gnb__item has-sub">
	          <a class="gnb__link" href="/community">커뮤니티</a>
	          <div class="subbar">
	            <div class="subbar__pill">
	              <a class="subbar__link" href="/community/list?type=FREE">자유게시판</a>
	              <span class="subbar__sep">||</span>
	              <a class="subbar__link" href="/community/list?type=MARKET">벼룩시장</a>
	            </div>
	          </div>
	        </li>
	
	        <li class="gnb__sep">||</li>
	        
	        <li class="gnb__item"><a class="gnb__link" href="/plant">식물</a></li>
	        
	        <li class="gnb__sep">||</li>
	        
	        <li class="gnb__item"><a class="gnb__link" href="/store">스토어</a></li>
	        
	        <li class="gnb__sep">||</li>
	
	        <li class="gnb__item has-sub">
	          <a class="gnb__link" href="/myplant">나의 식물</a>
	          <div class="subbar">
	            <div class="subbar__pill">
	              <a class="subbar__link" href="/myplant">나의 식물 관리</a>
	              <span class="subbar__sep">||</span>
	              <a class="subbar__link" href="/myplant/recommend">추천 가이드</a>
	            </div>
	          </div>
	        </li>
	
	        <li class="gnb__sep">||</li>
	        
	        <li class="gnb__item">
						<c:choose>
							<c:when test="${not empty sessionScope.loginUser}">
								<a class="gnb__link" href="/chat" 
									onclick="window.open(this.href); return false;">채팅</a>
							</c:when>
							<c:otherwise>
								<a class="gnb__link" href="/chat">채팅</a>
							</c:otherwise>
						</c:choose>
					</li>

	        <li class="gnb__sep">||</li>
	
	        <li class="gnb__item has-sub">
	          <a class="gnb__link" href="/qna">Q&amp;A</a>
	          <div class="subbar">
	            <div class="subbar__pill">
	              <a class="subbar__link" href="/qna/QnaList">질문들</a>
	              <span class="subbar__sep">||</span>
	              <a class="subbar__link" href="/qna/people">사람들</a>
	            </div>
	          </div>
	        </li>
	      </ul>
	    </nav>
	
	    <!-- 모바일 햄버거 드로어 + 아코디언(하위메뉴까지) -->
	    <aside class="mnav" id="mnav" aria-hidden="true">
	      <div class="mnav__backdrop" id="mnavBackdrop" aria-hidden="true"></div>
	
	      <div class="mnav__panel" role="dialog" aria-label="모바일 메뉴">
	        <div class="mnav__head">
	          <div class="mnav__title">MENU</div>
	          <button class="mnav__close" type="button" id="mnavClose" aria-label="메뉴 닫기">✕</button>
	        </div>
	
	        <nav class="mnav__list" aria-label="모바일 주요 메뉴">
	          <details class="mnav__item">
	            <summary>커뮤니티</summary>
	            <a href="/community/list?type=FREE">자유게시판</a>
	            <a href="/community/list?type=MARKET">벼룩시장</a>
	          </details>
	
	          <a class="mnav__link" href="/plant">식물</a>
	          
	          <a class="mnav__link" href="/store">스토어</a>
	
	          <details class="mnav__item">
	            <summary>나의 식물</summary>
	            <a href="/myplant">나의 식물 관리</a>
	            <a href="/myplant/recommend">추천 가이드</a>
	          </details>
	
						<c:choose>
							<c:when test="${not empty sessionScope.loginUser}">
								<a class="mnav__link" href="/chat" 
									onclick="window.open(this.href); return false;">채팅</a>
							</c:when>
							<c:otherwise>
								<a class="mnav__link" href="/chat">채팅</a>
							</c:otherwise>
						</c:choose>

	          <details class="mnav__item">
	            <summary>Q&amp;A</summary>
	            <a href="/qna/QnaList">질문들</a>
	            <a href="/qna/people">사람들</a>
	          </details>
	        </nav>
	      </div>
	    </aside>
	
	  </div>
	  <div class=hiddenMsg id="serverMsg" data-msg="${msg}"></div>
	  <div class=hiddenMsg id="serverMsgType" data-msgType="${msgType}"></div>
	  <jsp:include page="/WEB-INF/views/common/UserProfileModal.jsp" />
	</header>