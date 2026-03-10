/* UserProfileModal.js */

const GlobalProfileModal = (function() {
  let backdrop, modal, closeBtn;
  let avatarImg, nicknameTxt, gradeTxt, chatLink, introTxt, currentGradeTxt;
  let totalAnswers, totalViews, acceptedAnswers;
  let gradeStep1, gradeStep2, gradeStep3;
  let recentPostsList, recentQuestionsList;

  function init() {
    backdrop = document.getElementById('upmBackdrop');
    modal = document.getElementById('upmModal');
    closeBtn = document.getElementById('upmCloseBtn');
    
    avatarImg = document.getElementById('upmAvatar');
    nicknameTxt = document.getElementById('upmNickname');
    gradeTxt = document.getElementById('upmGrade');
    chatLink = document.getElementById('upmChatLink');
    introTxt = document.getElementById('upmIntro');
    
    currentGradeTxt = document.getElementById('upmCurrentGrade');
    gradeStep1 = document.getElementById('upmGradeStep1');
    gradeStep2 = document.getElementById('upmGradeStep2');
    gradeStep3 = document.getElementById('upmGradeStep3');
    
    totalAnswers = document.getElementById('upmTotalAnswers');
    totalViews = document.getElementById('upmTotalViews');
    acceptedAnswers = document.getElementById('upmAcceptedAnswers');
    
    recentPostsList = document.getElementById('upmRecentPosts');
    recentQuestionsList = document.getElementById('upmRecentQuestions');

    if(closeBtn) closeBtn.addEventListener('click', close);
    if(backdrop) backdrop.addEventListener('click', close);
  }

  function close() {
    backdrop.hidden = true;
    modal.hidden = true;
    document.body.style.overflow = ''; 
  }

  function bindData(data) {
    // 1. 프로필 이미지 세팅
    if (data.profile) {
      avatarImg.src = `/user/getProfile?fileName=${data.profile}`;
    } else {
      avatarImg.src = '/resources/image/default_profile.png';
    }

    // 2. 닉네임, 등급 세팅
    nicknameTxt.textContent = data.nickname || data.username || '이름 없음';
    const gradeName = data.gradeName || '일반';
    gradeTxt.textContent = gradeName;
    currentGradeTxt.textContent = gradeName;

    [gradeStep1, gradeStep2, gradeStep3].forEach(step => step.classList.remove('active'));
    if (gradeName === '전문가') {
      gradeStep3.classList.add('active');
    } else if (gradeName === '고수') {
      gradeStep2.classList.add('active');
    } else {
      gradeStep1.classList.add('active');
    }

    // 3. 채팅 링크
    if (data.user_id) {
      chatLink.href = `/chat?targetId=${data.user_id}`;
      chatLink.style.display = 'inline-flex';
    } else {
      chatLink.style.display = 'none';
    }

    // 4. 자기소개 및 통계 세팅
    introTxt.textContent = data.intro || '등록된 자기소개가 없습니다.';
    totalAnswers.textContent = data.totalAnswers || 0;
    totalViews.textContent = data.totalViews || 0;
    acceptedAnswers.textContent = data.acceptedAnswers || 0;

    // 5. 최근 작성한 글 렌더링 (최대 3개)
    recentPostsList.innerHTML = '';
    const topPosts = (data.posts || []).slice(0, 3);
    if (topPosts.length > 0) {
      topPosts.forEach(p => {
        recentPostsList.innerHTML += `
          <li>
            <a href="/community/view?board_id=${p.boardId}">
              <div class="upm-post-title">${p.title}</div>
              <div class="upm-post-meta">커뮤니티 · 조회${p.viewCount} · 댓글${p.replyCnt}</div>
            </a>
          </li>
        `;
      });
    } else {
      recentPostsList.innerHTML = '<li class="upm-empty-list">최근 작성한 글이 없습니다.</li>';
    }

    // 6. 최근 질문 렌더링 (최대 3개)
    recentQuestionsList.innerHTML = '';
    const topQuests = (data.quests || []).slice(0, 3);
    if (topQuests.length > 0) {
      topQuests.forEach(q => {
        recentQuestionsList.innerHTML += `
          <li>
            <a href="/qna/detail?qna_id=${q.boardId}">
              <div class="upm-post-title">${q.title}</div>
              <div class="upm-post-meta">Q&A · 조회${q.viewCount} · 댓글${q.replyCnt}</div>
            </a>
          </li>
        `;
      });
    } else {
      recentQuestionsList.innerHTML = '<li class="upm-empty-list">최근 질문이 없습니다.</li>';
    }
  }

  return {
    init: init,
    open: function(userId) {
      if (!modal) init();

      fetch(`/user/profileData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ userId: userId })
      })
      .then(response => {
        if (!response.ok) throw new Error('유저 정보를 불러올 수 없습니다.');
        return response.json();
      })
      .then(data => {
        bindData(data);
        document.body.style.overflow = 'hidden';
        backdrop.hidden = false;
        modal.hidden = false;
      })
      .catch(error => {
        alert(error.message);
        console.error(error);
      });
    }
  };
})();

document.addEventListener('DOMContentLoaded', GlobalProfileModal.init);