<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Home Sweet Farm</title>
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
	      <a class="logo" href="/main" aria-label="Home Sweet Farm">
	        <span class="logo__text">Home Sweet Farm</span>
	      </a>
	
	      <!-- 필터 검색 (데스크탑/태블릿에서만 사용, 모바일에서는 CSS로 숨김) -->
	      <div class="fsearch" id="filterSearch">
	        <input class="fsearch__toggle" type="checkbox" id="fsearchToggle" />
	
	        <div class="fsearch__bar" id="fsearchBar" role="button" tabindex="0" aria-label="검색창 열기">
	          <span class="fsearch__icon" aria-hidden="true"></span>
	          <input id="searchQ" name="q" class="fsearch__input" type="search" placeholder="" />
	        </div>
	
	        <div class="fchips" id="filterChips" aria-label="선택된 필터"></div>
	
	        <div class="fpanel" role="dialog" aria-label="필터 검색 패널">
	          <div class="fpanel__row">
	            <div class="fpanel__cell fpanel__cell--category">
	              <span class="fpanel__hint" id="filterHint">대분류를 선택해주세요.</span>
	
	              <div class="fcat" id="mainCategories">
	                <details class="fcat__item" data-main="커뮤니티">
	                  <summary class="fcat__summary">커뮤니티</summary>
	                  <div class="fsub">
	                    <button type="button" class="fsub__item" data-sub="자유게시판">자유게시판</button>
	                    <button type="button" class="fsub__item" data-sub="벼룩시장">벼룩시장</button>
	                  </div>
	                </details>
	
	                <button type="button" class="fcat__solo" data-main="백과사전">식물</button>
	
	                <details class="fcat__item" data-main="스토어">
	                  <summary class="fcat__summary">스토어</summary>
	                  <div class="fsub">
	                    <button type="button" class="fsub__item" data-sub="재배 & 관리용품">재배 &amp; 관리용품</button>
	                    <button type="button" class="fsub__item" data-sub="비료 & 영양제">비료 &amp; 영양제</button>
	                    <button type="button" class="fsub__item" data-sub="병해충 & 보호">병해충 &amp; 보호</button>
	                    <button type="button" class="fsub__item" data-sub="씨앗 & 번식">씨앗 &amp; 번식</button>
	                  </div>
	                </details>
	
	                <details class="fcat__item" data-main="나의 식물">
	                  <summary class="fcat__summary">나의 식물</summary>
	                  <div class="fsub">
	                    <button type="button" class="fsub__item" data-sub="추천 가이드">추천 가이드</button>
	                    <button type="button" class="fsub__item" data-sub="나의 식물 관리">나의 식물 관리</button>
	                  </div>
	                </details>
	
	                <button type="button" class="fcat__solo" data-main="채팅">채팅</button>
	
	                <details class="fcat__item" data-main="Q&A">
	                  <summary class="fcat__summary">Q&amp;A</summary>
	                  <div class="fsub">
	                    <button type="button" class="fsub__item" data-sub="질문들">질문들</button>
	                    <button type="button" class="fsub__item" data-sub="사람들">사람들</button>
	                  </div>
	                </details>
	              </div>
	
	              <div class="fsub-panel" id="subPanel" aria-hidden="true"></div>
	            </div>
	
	            <div class="fpanel__cell fpanel__cell--actions">
	              <button class="fbtn fbtn--plus" type="button" id="addFilterBtn" aria-label="필터 추가">+</button>
	              <button class="fbtn fbtn--search" type="button" id="doSearchBtn">검색</button>
	              <button class="fbtn fbtn--close" type="button" id="closePanelBtn" aria-label="닫기">X</button>
	            </div>
	          </div>
	        </div>
	      </div>
	
	      <div class="auth auth--desktop">
	        <a class="auth__link" href="/user/login">로그인</a>
	        <span class="auth__sep" aria-hidden="true">||</span>
	        <a class="auth__link" href="/user/JoinUser">회원가입</a>
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
	        <a class="auth__link" href="/user/login">로그인</a>
	        <span class="auth__sep" aria-hidden="true">||</span>
	        <a class="auth__link" href="/user/JoinUser">회원가입</a>
	      </div>
	    </div>
	
	    <!-- 모바일 2줄: 로고 -->
	    <div class="mrow mrow--logo">
	      <a class="mlogo" href="/main" aria-label="Home Sweet Farm">Home Sweet Farm</a>
	    </div>
	
	    <!-- 모바일 3줄: 필터 없는 검색창 -->
	    <div class="mrow mrow--search">
	      <form class="msearch" action="/search" method="get" role="search" aria-label="모바일 검색">
	        <span class="fsearch__icon" aria-hidden="true"></span>
	        <input class="msearch__input" type="search" name="q" placeholder="검색어를 입력하세요" />
	      </form>
	    </div>
	
	    <!-- 데스크탑 메뉴바 유지 -->
	    <nav class="gnb gnb--desktop" aria-label="주요 메뉴">
	      <ul class="gnb__list">
	        <li class="gnb__item has-sub">
	          <a class="gnb__link" href="#">커뮤니티</a>
	          <div class="subbar">
	            <div class="subbar__pill">
	              <a class="subbar__link" href="#">자유게시판</a>
	              <span class="subbar__sep">||</span>
	              <a class="subbar__link" href="#">벼룩시장</a>
	            </div>
	          </div>
	        </li>
	
	        <li class="gnb__sep">||</li>
	        <li class="gnb__item"><a class="gnb__link" href="/plant">식물</a></li>
	        <li class="gnb__sep">||</li>
	
	        <li class="gnb__item has-sub">
	          <a class="gnb__link" href="#">스토어</a>
	          <div class="subbar">
	            <div class="subbar__pill">
	              <a class="subbar__link" href="#">재배 &amp; 관리용품</a>
	              <span class="subbar__sep">||</span>
	              <a class="subbar__link" href="#">비료 &amp; 영양제</a>
	              <span class="subbar__sep">||</span>
	              <a class="subbar__link" href="#">병해충 &amp; 보호</a>
	              <span class="subbar__sep">||</span>
	              <a class="subbar__link" href="#">씨앗 &amp; 번식</a>
	            </div>
	          </div>
	        </li>
	
	        <li class="gnb__sep">||</li>
	
	        <li class="gnb__item has-sub">
	          <a class="gnb__link" href="#">나의 식물</a>
	          <div class="subbar">
	            <div class="subbar__pill">
	              <a class="subbar__link" href="#">추천 가이드</a>
	              <span class="subbar__sep">||</span>
	              <a class="subbar__link" href="#">나의 식물 관리</a>
	            </div>
	          </div>
	        </li>
	
	        <li class="gnb__sep">||</li>
	        <li class="gnb__item"><a class="gnb__link" href="#">채팅</a></li>
	        <li class="gnb__sep">||</li>
	
	        <li class="gnb__item has-sub">
	          <a class="gnb__link" href="#">Q&amp;A</a>
	          <div class="subbar">
	            <div class="subbar__pill">
	              <a class="subbar__link" href="#">질문들</a>
	              <span class="subbar__sep">||</span>
	              <a class="subbar__link" href="#">사람들</a>
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
	            <a href="#">자유게시판</a>
	            <a href="#">벼룩시장</a>
	          </details>
	
	          <a class="mnav__link" href="#">백과사전</a>
	          <a class="mnav__link" href="#">관리가이드</a>
	
	          <details class="mnav__item">
	            <summary>스토어</summary>
	            <a href="#">재배 &amp; 관리용품</a>
	            <a href="#">비료 &amp; 영양제</a>
	            <a href="#">병해충 &amp; 보호</a>
	            <a href="#">씨앗 &amp; 번식</a>
	          </details>
	
	          <details class="mnav__item">
	            <summary>나의 식물</summary>
	            <a href="#">추천 가이드</a>
	            <a href="#">나의 식물 관리</a>
	          </details>
	
	          <a class="mnav__link" href="#">채팅</a>
	
	          <details class="mnav__item">
	            <summary>Q&amp;A</summary>
	            <a href="#">질문들</a>
	            <a href="#">사람들</a>
	          </details>
	        </nav>
	      </div>
	    </aside>
	
	  </div>
	</header>
