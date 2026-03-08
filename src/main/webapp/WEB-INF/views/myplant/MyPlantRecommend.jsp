<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<jsp:include page="/WEB-INF/views/layout/header.jsp" />
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/myplant/MyPlantRecommend.css" />

<div class="page-shell">
  <div class="content-wrap">
    <div class="content-card mpr-card">

      <div id="mprIntro" class="mpr-step is-active">
        <div class="mpr-intro__icon">🌱</div>
        <h2 class="mpr-intro__title">나에게 딱 맞는 반려식물 찾기</h2>
        <p class="mpr-intro__desc">
          우리 집 환경과 나의 라이프스타일에 맞는<br/>
          최고의 식물 친구를 추천해 드릴게요!
        </p>
        <button type="button" class="btn-large btn-large--primary" id="btnStart">테스트 시작하기</button>
      </div>

      <div id="mprQuestion" class="mpr-step">
        <div class="mpr-progress">
          <div class="mpr-progress__bar" id="progressBar"></div>
        </div>
        <div class="mpr-qna">
          <div class="mpr-qna__num" id="qNum">Q1.</div>
          <h3 class="mpr-qna__title" id="qTitle">질문 내용이 들어갑니다.</h3>
          <div class="mpr-qna__options" id="qOptions">
            </div>
        </div>
      </div>

      <div id="mprResult" class="mpr-step">
        <div class="mpr-result__head">
          <span class="mpr-result__subtitle">당신에게 어울리는 반려식물은</span>
          <h2 class="mpr-result__title" id="resName">식물 이름</h2>
        </div>
        
        <div class="mpr-result__card">
          <div class="mpr-result__thumb">
            <img id="resImg" src="" alt="추천 식물" />
          </div>
          <div class="mpr-result__info">
            <div class="mpr-result__tags" id="resTags">
              </div>
            <p class="mpr-result__desc" id="resDesc">
              식물에 대한 설명이 들어갑니다.
            </p>
          </div>
        </div>

        <div class="mpr-result__actions">
          <button type="button" class="btn-large btn-large--ghost" id="btnRetry">다시 하기</button>
          <a href="${pageContext.request.contextPath}/store/list" class="btn-large btn-large--primary" id="btnGoStore">
            스토어에서 찾아보기
          </a>
        </div>
      </div>

    </div>
  </div>
</div>

<script src="${pageContext.request.contextPath}/resources/js/myplant/MyPlantRecommend.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />