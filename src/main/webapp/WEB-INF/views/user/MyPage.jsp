<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<link rel="stylesheet" href="${ctx}/resources/css/user/MyPage.css" />
<jsp:include page="/WEB-INF/views/layout/header.jsp" />

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<div class="page-shell">
  <div class="content-wrap">
    <div class="content-card mypage-card"
         data-ctx="${ctx}"
         data-profile-user-id="${profileUser.user_id}"
         data-is-owner="${isOwner}">

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
        <section class="mypage-right">
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
              <!-- LEFT COLUMN -->
              <div class="profile-col">
                <!-- 자기소개 -->
                <c:if test="${not empty profile.intro}">
                  <div class="box">
                    <div class="box-title">자기소개</div>
                    <div class="box-body scroll-box">
                      <pre class="pre-text"><c:out value="${profile.intro}" /></pre>
                    </div>
                  </div>
                </c:if>

                <!-- 활동내역 -->
                <c:if test="${not empty profile.activities}">
                  <div class="box">
                    <div class="box-title">활동내역</div>
                    <div class="box-body scroll-box">
                      <!-- activities가 List<String> 이라고 가정 -->
                      <ul class="bullet">
                        <c:forEach var="a" items="${profile.activities}">
                          <li><c:out value="${a}" /></li>
                        </c:forEach>
                      </ul>
                    </div>
                  </div>
                </c:if>

                <!-- 주요 활동 분야 -->
                <c:if test="${not empty profile.fields}">
                  <div class="box">
                    <div class="box-title">주요 활동 분야</div>
                    <div class="box-body scroll-box">
                      <!-- fields가 List<String> 이라고 가정 -->
                      <ul class="bullet">
                        <c:forEach var="f" items="${profile.fields}">
                          <li><c:out value="${f}" /></li>
                        </c:forEach>
                      </ul>
                    </div>
                  </div>
                </c:if>

                <!-- 답변수 요약 (없으면 숨김) -->
                <c:if test="${profileStats.totalAnswers gt 0 or profileStats.totalViews gt 0 or profileStats.acceptedAnswers gt 0}">
                  <div class="box">
                    <div class="box-title">답변수</div>
                    <div class="stats">
                      <div class="stat">
                        <div class="num"><c:out value="${profileStats.totalAnswers}" /></div>
                        <div class="label">전체 답변</div>
                      </div>
                      <div class="stat">
                        <div class="num"><c:out value="${profileStats.totalViews}" /></div>
                        <div class="label">조회수</div>
                      </div>
                      <div class="stat">
                        <div class="num"><c:out value="${profileStats.acceptedAnswers}" /></div>
                        <div class="label">채택 답변</div>
                      </div>
                    </div>
                  </div>
                </c:if>
              </div>

              <!-- RIGHT COLUMN -->
              <div class="profile-col">
                <!-- 나의 등급 -->
                <div class="box">
                  <div class="box-title">나의 등급</div>
                  <div class="grade-area">
                    <div class="grade-current">
                      현재 <b><c:out value="${profileUser.gradeName}" /></b> 등급입니다
                    </div>

                    <div class="grade-actions">
                      <button type="button" class="link-btn" id="btnGradeGuide">등급 안내</button>
                      <c:if test="${isOwner}">
                        <a class="link-btn" href="${ctx}/mypage/verify/expert">전문가 인증하러가기</a>
                      </c:if>
                    </div>
                  </div>
                </div>

                <!-- 나의 Q&A 등급 -->
                <div class="box">
                  <div class="box-title">나의 Q&amp;A 등급</div>
                  <div class="qna-area">
                    <div class="qna-level">LV <c:out value="${profileStats.qnaLevel}" /></div>
                    <div class="qna-actions">
                      <c:if test="${isOwner}">
                        <button type="button" class="link-btn" id="btnQnaLevelUp">Q&amp;A 등급 올리기</button>
                      </c:if>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

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
</div>

<script src="${ctx}/resources/js/user/MyPage.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
