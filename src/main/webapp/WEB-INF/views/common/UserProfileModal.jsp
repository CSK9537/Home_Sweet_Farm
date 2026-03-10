<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common/UserProfileModal.css" />

<div class="upm-backdrop" id="upmBackdrop" hidden></div>
<div class="upm-modal" id="upmModal" role="dialog" aria-modal="true" aria-labelledby="upmModalTitle" hidden>
  <div class="upm-modal-card">
    <div class="upm-modal-head">
      <h3 id="upmModalTitle">프로필 정보</h3>
      <button type="button" class="upm-icon-btn" id="upmCloseBtn" aria-label="닫기">×</button>
    </div>
    
    <div class="upm-modal-body scroll-box">
      <div class="upm-left-profile">
        <button type="button" class="upm-avatar-btn" disabled>
          <img class="upm-avatar" id="upmAvatar" src="${pageContext.request.contextPath}/resources/image/default_profile.png" alt="프로필 이미지"/>
        </button>

        <div class="upm-left-profile-meta">
          <div class="upm-nickname" id="upmNickname">-</div>
          <div class="upm-grade" id="upmGrade">-</div>
          <a class="upm-chat-link" id="upmChatLink" href="#">채팅하기</a>
        </div>
      </div>
      
      <div class="upm-profile-grid">
        <div class="upm-profile-col">
          <div class="upm-box">
            <div class="upm-box-title">자기소개</div>
            <div class="upm-box-body">
              <div id="upmIntro" class="upm-pre-text">등록된 자기소개가 없습니다.</div>
            </div>
          </div>

          <div class="upm-box upm-grade-box">
            <div class="upm-box-title">회원 등급</div>
            <div class="upm-grade-progress">
              <div class="upm-grade-line"></div>
              <div class="upm-grade-step" id="upmGradeStep1">
                <div class="upm-grade-icon">🌱</div>
                <div class="upm-grade-label">일반</div>
              </div>
              <div class="upm-grade-step" id="upmGradeStep2">
                <div class="upm-grade-icon">🌿</div>
                <div class="upm-grade-label">고수</div>
              </div>
              <div class="upm-grade-step" id="upmGradeStep3">
                <div class="upm-grade-icon">🌳</div>
                <div class="upm-grade-label">전문가</div>
              </div>
            </div>
            <div class="upm-grade-desc">
              현재 <b id="upmCurrentGrade">일반</b> 등급입니다
            </div>
          </div>

          <div class="upm-box">
            <div class="upm-box-title">답변</div>
            <div class="upm-stats">
              <div class="upm-stat">
                <div class="upm-num" id="upmTotalAnswers">0</div>
                <div class="upm-label">전체 답변</div>
              </div>
              <div class="upm-stat">
                <div class="upm-num" id="upmAcceptedAnswers">0</div>
                <div class="upm-label">채택 답변</div>
              </div>
              <div class="upm-stat">
                <div class="upm-num" id="upmTotalAnswerLikes">0</div>
                <div class="upm-label">좋아요</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="upm-right-column">
          <div class="upm-box">
            <div class="upm-box-title">최근 작성한 글</div>
            <div class="upm-recent-wrap">
              <ul class="upm-recent-list" id="upmRecentPosts">
                </ul>
            </div>
          </div>  
          
          <div class="upm-box">
            <div class="upm-box-title">최근 질문</div>
            <div class="upm-recent-wrap">
              <ul class="upm-recent-list" id="upmRecentQuestions">
                </ul>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</div>

<script src="${pageContext.request.contextPath}/resources/js/common/UserProfileModal.js"></script>