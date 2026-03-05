<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<c:set var="ctx" value="${pageContext.request.contextPath}" />
<link rel="stylesheet" href="${ctx}/resources/css/user/user_myPage.css" />
<jsp:include page="/WEB-INF/views/layout/header.jsp" />


<div class="page-shell">
    <div class="content-card mypage-card"
         data-ctx="${ctx}"
         data-profile-user-id="${profileUser.user_id}"
         data-is-owner="${isOwner ? 'true' : 'false'}">

      <div class="mypage-layout">
        <!-- LEFT -->
        <aside class="mypage-left">
          <div class="left-profile">
            <button type="button"
                    class="avatar-btn"
                    id="btnAvatar"
                    aria-label="프로필 이미지 크게 보기"
                    <c:if test="${!isOwner}">disabled="disabled"</c:if>>
              <img class="avatar"
                   src="<c:out value='${empty profileUser.profile ? (ctx.concat("/resources/img/default_profile.png")) : profileUser.profile}'/>"
                   alt="프로필 이미지"/>
            </button>

            <div class="left-profile-meta">
              <div class="nickname"><c:out value="${profileUser.nickname}" /></div>
              <div class="grade"><c:out value="${profileUser.gradeName}" /></div>
              <a class="chat-link" href="${ctx}/chat/room?targetUserId=${profileUser.user_id}">채팅하기</a>
            </div>
          </div>

          <nav class="left-menu" aria-label="마이페이지 메뉴">
            <!-- 채팅하기는 페이지 이동 -->
            <a class="menu-item" href="${ctx}/chat/room?targetUserId=${profileUser.user_id}">채팅하기</a>

            <!-- 아래는 우측 영역 변경 -->
            <c:if test="${isOwner}">
              <button type="button" class="menu-item js-nav" data-target="secAccount">마이페이지</button>
            </c:if>

            <button type="button" class="menu-item js-nav is-active" data-target="secProfile">프로필</button>
            <button type="button" class="menu-item js-nav" data-target="secPosts">작성글</button>
            <button type="button" class="menu-item js-nav" data-target="secComments">작성댓글</button>

            <c:if test="${isOwner}">
              <button type="button" class="menu-item js-nav" data-target="secMyQuestions">나의 질문</button>
            </c:if>

            <button type="button" class="menu-item js-nav" data-target="secMyAnswers">나의 답변</button>
          </nav>
        </aside>

        <!-- RIGHT -->
        <section class="mypage-right" id="rightLayout">
          <!-- =======================
               1) 프로필 (공개)
          ======================== -->
          <section id="secProfile" class="right-section is-show">
            <header class="section-head">
              <h2 class="section-title">프로필</h2>
              <div class="section-actions">
                <c:if test="${isOwner}">
                  <a class="btn btn-ghost" href="${ctx}/mypage/profile/edit">수정</a>
                </c:if>
              </div>
            </header>

            <div class="profile-grid">

			  <!-- =======================
			       LEFT COLUMN
			  ======================== -->
			  <div class="profile-col">
			
			    <!-- 자기소개 -->
			    <div class="box">
			      <div class="box-title">자기소개</div>
			      <div class="box-body scroll-box">
			        <pre class="pre-text"><c:choose>
			  <c:when test="${not empty profileUser.intro}"><c:out value="${profileUser.intro}" /></c:when>
			  <c:otherwise>간단한 자기소개를 작성해보세요. (스크롤 방식)</c:otherwise>
			</c:choose></pre>
			      </div>
			    </div>
			
			    <!-- 활동내역 (JSP 단계: 더미) -->
			    <div class="box">
			      <div class="box-title">활동내역</div>
			      <div class="box-body scroll-box">
			        <ul class="bullet">
			          <li>활동 내역 1</li>
			          <li>활동 내역 2</li>
			          <li>활동 내역 3 (스크롤 방식)</li>
			        </ul>
			      </div>
			    </div>
			
			    <!-- 주요 활동 분야 (JSP 단계: 더미) -->
			    <div class="box">
			      <div class="box-title">주요 활동 분야</div>
			      <div class="box-body scroll-box">
			        <ul class="bullet">
			          <li>활동 분야 1</li>
			          <li>활동 분야 2</li>
			          <li>활동 분야 3 (스크롤 방식)</li>
			        </ul>
			      </div>
			    </div>
			
			    <!-- 답변수 -->
			    <div class="box">
			      <div class="box-title">답변수</div>
			      <div class="stats">
			        <div class="stat">
			          <div class="num">${empty profileStats.totalAnswers ? 0 : profileStats.totalAnswers}</div>
			          <div class="label">전체 답변</div>
			        </div>
			        <div class="stat">
			          <div class="num">${empty profileStats.totalViews ? 0 : profileStats.totalViews}</div>
			          <div class="label">조회수</div>
			        </div>
			        <div class="stat">
			          <div class="num">${empty profileStats.acceptedAnswers ? 0 : profileStats.acceptedAnswers}</div>
			          <div class="label">채택 답변</div>
			        </div>
			      </div>
			    </div>
			
			  </div>
			
			  <!-- =======================
			       RIGHT COLUMN
			  ======================== -->
			  <div class="profile-col">
			
			    <!-- 나의 등급 -->
			    <div class="box">
			      <div class="box-title">나의 등급</div>
			
			      <div class="grade-progress">
			        <div class="grade-line"></div>
			
			        <div class="grade-step active">
			          <div class="grade-icon">🌱</div>
			          <div class="grade-label">일반</div>
			        </div>
			
			        <div class="grade-step">
			          <div class="grade-icon">🌿</div>
			          <div class="grade-label">고수</div>
			        </div>
			
			        <div class="grade-step">
			          <div class="grade-icon">🌳</div>
			          <div class="grade-label">전문가</div>
			        </div>
			      </div>
			
			      <div class="grade-desc">
			        현재 <b><c:out value="${empty profileUser.gradeName ? '일반' : profileUser.gradeName}" /></b> 등급입니다<br/>
			        <a class="link-btn" href="#">전문가 인증하러 가기</a>
			      </div>
			    </div>
			
			    <!-- 나의 Q&A 등급 -->
			    <div class="box">
			      <div class="box-title">나의 Q&amp;A 등급</div>
			
			      <div class="qna-progress">
			        <div class="qna-line"></div>
			
			        <div class="qna-step active">
					  <div class="qna-icon">🏅</div>
					  <div class="qna-label">
					    새싹등급 <span class="qna-lv">LV <c:out value="${empty profileStats.qnaLevel ? 1 : profileStats.qnaLevel}" /></span>
					  </div>
					</div>
			
			      <div class="grade-desc">
					  <div class="qna-desc-text">
					    현재 새싹등급 (<span class="qna-lv">LV <c:out value="${empty profileStats.qnaLevel ? 1 : profileStats.qnaLevel}" /></span>) 입니다
					  </div>
					  <a class="link-btn qna-link" href="#">Q&amp;A 등급 올리기</a>
				</div>
			    </div>
			
			  </div>
			
			</div>

          <!-- =======================
               2) 작성글 (공개)
          ======================== -->
          <section id="secPosts" class="right-section">
            <header class="section-head">
              <h2 class="section-title">작성글</h2>
              <div class="section-actions">
                <div class="tabbar" data-section="posts">
                  <button type="button" class="tab is-active" data-tab="all">전체</button>
                  <button type="button" class="tab" data-tab="community">커뮤니티</button>
                  <button type="button" class="tab" data-tab="qna">Q&amp;A</button>
                </div>
              </div>
            </header>

            <div class="list-wrap"
                 data-api="${ctx}/mypage/api/posts"
                 data-default-tab="all">
              <div class="list-head">
                <div class="list-count">
                  <span class="muted">총</span> <b class="js-total">0</b><span class="muted">건</span>
                </div>
              </div>

              <ul class="list js-list" aria-label="작성글 목록"></ul>

              <div class="pager js-pager" aria-label="페이지네이션"></div>
              <div class="empty js-empty">표시할 데이터가 없습니다.</div>
            </div>
          </section>

          <!-- =======================
               3) 작성댓글 (공개)
          ======================== -->
          <section id="secComments" class="right-section">
            <header class="section-head">
              <h2 class="section-title">작성댓글</h2>
              <div class="section-actions">
                <div class="tabbar" data-section="comments">
                  <button type="button" class="tab is-active" data-tab="all">전체</button>
                  <button type="button" class="tab" data-tab="community">커뮤니티</button>
                  <button type="button" class="tab" data-tab="qna">Q&amp;A</button>
                </div>
              </div>
            </header>

            <div class="list-wrap"
                 data-api="${ctx}/mypage/api/comments"
                 data-default-tab="all">
              <div class="list-head">
                <div class="list-count">
                  <span class="muted">총</span> <b class="js-total">0</b><span class="muted">건</span>
                </div>
              </div>

              <ul class="list js-list" aria-label="작성댓글 목록"></ul>

              <div class="pager js-pager" aria-label="페이지네이션"></div>
              <div class="empty js-empty">표시할 데이터가 없습니다.</div>
            </div>
          </section>

          <!-- =======================
               4) 나의 질문 (주인만)
          ======================== -->
          <c:if test="${isOwner}">
            <section id="secMyQuestions" class="right-section">
              <header class="section-head">
                <h2 class="section-title">나의 질문</h2>
                <div class="section-actions">
                  <div class="tabbar" data-section="myQuestions">
                    <button type="button" class="tab is-active" data-tab="all">전체</button>
                    <button type="button" class="tab" data-tab="open">미해결</button>
                    <button type="button" class="tab" data-tab="solved">해결</button>
                  </div>
                </div>
              </header>

              <div class="list-wrap"
                   data-api="${ctx}/mypage/api/questions"
                   data-default-tab="all">
                <div class="list-head">
                  <div class="list-count">
                    <span class="muted">총</span> <b class="js-total">0</b><span class="muted">건</span>
                  </div>
                </div>

                <ul class="list js-list" aria-label="나의 질문 목록"></ul>

                <div class="pager js-pager" aria-label="페이지네이션"></div>
                <div class="empty js-empty">표시할 데이터가 없습니다.</div>
              </div>
            </section>
          </c:if>

          <!-- =======================
               5) 나의 답변 (공개)
          ======================== -->
          <section id="secMyAnswers" class="right-section">
            <header class="section-head">
              <h2 class="section-title">나의 답변</h2>
              <div class="section-actions">
                <div class="tabbar" data-section="myAnswers">
                  <button type="button" class="tab is-active" data-tab="all">전체</button>
                  <button type="button" class="tab" data-tab="accepted">채택</button>
                </div>
              </div>
            </header>

            <div class="list-wrap"
                 data-api="${ctx}/mypage/api/answers"
                 data-default-tab="all">
              <div class="list-head">
                <div class="list-count">
                  <span class="muted">총</span> <b class="js-total">0</b><span class="muted">건</span>
                </div>
              </div>

              <ul class="list js-list" aria-label="나의 답변 목록"></ul>

              <div class="pager js-pager" aria-label="페이지네이션"></div>
              <div class="empty js-empty">표시할 데이터가 없습니다.</div>
            </div>
          </section>

          <!-- =======================
               6) 마이페이지(계정 주인만)
          ======================== -->
          <c:if test="${isOwner}">
            <section id="secAccount" class="right-section">
              <header class="section-head">
                <h2 class="section-title">마이페이지</h2>
              </header>

              <form id="accountForm" class="account-form" method="post" action="${ctx}/mypage/account/update">
                <div class="form-row">
                  <label class="label">이름</label>
                  <input type="text" value="<c:out value='${profileUser.name}'/>" disabled />
                </div>
                <div class="form-row">
                  <label class="label">생년월일</label>
                  <input type="text" value="<c:out value='${profileUser.birth_date}'/>" disabled />
                </div>

                <div class="form-row">
                  <label class="label">닉네임</label>
                  <div class="input-actions">
                    <input type="text" name="nickname" value="<c:out value='${profileUser.nickname}'/>" />
                    <button type="submit" class="btn">수정</button>
                  </div>
                </div>

                <div class="form-row">
                  <label class="label">관심식물</label>
                  <div class="input-actions">
                    <input type="text" value="<c:out value='${profileUser.aspect}'/>" readonly />
                    <button type="button" class="btn" id="btnInterestPlant">+</button>
                  </div>
                </div>

                <div class="form-row">
                  <label class="label">휴대전화</label>
                  <div class="input-actions">
                    <input type="text" value="<c:out value='${profileUser.phone}'/>" readonly id="inpPhone" />
                    <button type="button" class="btn btn-ghost" id="btnPhoneVerify">인증</button>
                  </div>
                </div>

                <div class="form-row">
                  <label class="label">이메일</label>
                  <div class="input-actions">
                    <input type="text" value="<c:out value='${profileUser.email}'/>" readonly id="inpEmail" />
                    <button type="button" class="btn btn-ghost" id="btnEmailVerify">인증</button>
                  </div>
                </div>
              </form>
            </section>
          </c:if>

        </section>
      </div>

      <!-- =======================
           MODALS
      ======================== -->
      <div class="modal-backdrop" id="modalBackdrop" hidden></div>

      <!-- 등급 안내 모달 -->
      <div class="modal" id="modalGrade" role="dialog" aria-modal="true" aria-labelledby="modalGradeTitle" hidden>
        <div class="modal-card">
          <div class="modal-head">
            <h3 id="modalGradeTitle">등급 안내</h3>
            <button type="button" class="icon-btn" data-modal-close aria-label="닫기">×</button>
          </div>
          <div class="modal-body">
            <!-- DB/정책 문구를 서버에서 내려주고 싶으면 여기 바인딩 -->
            <p class="muted">등급 기준/혜택 안내 내용을 표시합니다.</p>
          </div>
          <div class="modal-foot">
            <button type="button" class="btn" data-modal-close>닫기</button>
          </div>
        </div>
      </div>

      <!-- Q&A 등급 올리기 모달 -->
      <div class="modal" id="modalQna" role="dialog" aria-modal="true" aria-labelledby="modalQnaTitle" hidden>
        <div class="modal-card">
          <div class="modal-head">
            <h3 id="modalQnaTitle">Q&amp;A 등급 올리기</h3>
            <button type="button" class="icon-btn" data-modal-close aria-label="닫기">×</button>
          </div>
          <div class="modal-body">
            <p class="muted">등급 업 조건/미션 등을 표시하고, 수행 버튼을 제공할 수 있습니다.</p>
            <button type="button" class="btn">미션 확인</button>
          </div>
          <div class="modal-foot">
            <button type="button" class="btn" data-modal-close>닫기</button>
          </div>
        </div>
      </div>

      <!-- 관심식물 추가 모달 -->
      <div class="modal" id="modalPlant" role="dialog" aria-modal="true" aria-labelledby="modalPlantTitle" hidden>
        <div class="modal-card">
          <div class="modal-head">
            <h3 id="modalPlantTitle">관심식물 선택</h3>
            <button type="button" class="icon-btn" data-modal-close aria-label="닫기">×</button>
          </div>
          <div class="modal-body">
            <div class="plant-search">
              <input type="text" id="plantKeyword" placeholder="식물명 검색" />
              <button type="button" class="btn" id="btnPlantSearch">검색</button>
            </div>
            <ul class="list" id="plantResult" aria-label="관심식물 검색 결과"></ul>
            <div class="empty" id="plantEmpty">검색 결과가 없습니다.</div>
          </div>
          <div class="modal-foot">
            <button type="button" class="btn" data-modal-close>닫기</button>
          </div>
        </div>
      </div>

      <!-- 인증(휴대폰/이메일) 모달 -->
      <div class="modal" id="modalVerify" role="dialog" aria-modal="true" aria-labelledby="modalVerifyTitle" hidden>
        <div class="modal-card">
          <div class="modal-head">
            <h3 id="modalVerifyTitle">인증</h3>
            <button type="button" class="icon-btn" data-modal-close aria-label="닫기">×</button>
          </div>
          <div class="modal-body">
            <p class="muted" id="verifyDesc">인증 절차를 진행합니다.</p>
            <div class="verify-grid">
              <input type="text" id="verifyTarget" readonly />
              <button type="button" class="btn" id="btnSendCode">인증번호 발송</button>
              <input type="text" id="verifyCode" placeholder="인증번호 입력" />
              <button type="button" class="btn" id="btnConfirmCode">확인</button>
            </div>
          </div>
          <div class="modal-foot">
            <button type="button" class="btn" data-modal-close>닫기</button>
          </div>
        </div>
      </div>

      <!-- 프로필 이미지 크게보기 모달(주인만) -->
      <div class="modal" id="modalAvatar" role="dialog" aria-modal="true" aria-labelledby="modalAvatarTitle" hidden>
        <div class="modal-card">
          <div class="modal-head">
            <h3 id="modalAvatarTitle">프로필 이미지</h3>
            <button type="button" class="icon-btn" data-modal-close aria-label="닫기">×</button>
          </div>
          <div class="modal-body center">
            <img id="avatarLarge"
                 src="<c:out value='${empty profileUser.profile ? (ctx.concat("/resources/img/default_profile.png")) : profileUser.profile}'/>"
                 alt="프로필 이미지 크게 보기" />
          </div>
          <div class="modal-foot">
            <button type="button" class="btn" data-modal-close>닫기</button>
          </div>
        </div>
      </div>

    </div>
  </div>

<script src="${pageContext.request.contextPath}/resources/js/user/user_myPage.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
