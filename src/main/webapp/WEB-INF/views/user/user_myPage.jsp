<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<c:set var="ctx" value="${pageContext.request.contextPath}" />
<link rel="stylesheet" href="${ctx}/resources/css/user/user_myPage.css" />
<jsp:include page="/WEB-INF/views/layout/header.jsp" />

<div class="page-shell">
  <section class="content-wrap">
    <div class="content-card mypage-card"
         data-ctx="${ctx}"
         data-profile-user-id="${profileUser.user_id}"
         data-is-owner="${isOwner ? 'true' : 'false'}">

      <div class="mypage-layout">
        
        <aside class="mypage-left">
          <div class="left-profile">
            <button type="button"
                    class="avatar-btn"
                    id="btnAvatar"
                    aria-label="프로필 이미지 크게 보기"
                    <c:if test="${!isOwner}">disabled="disabled"</c:if>>
              <c:choose>
                <c:when test="${empty profileUser.profile}">
                  <img class="avatar" src="${ctx}/resources/image/default_profile.png" alt="프로필 이미지"/>
                </c:when>
                <c:otherwise>
                  <img class="avatar" src="/user/getProfile?fileName=${profileUser.profile}" alt="프로필 이미지"/>
                </c:otherwise>
              </c:choose>
            </button>

            <div class="left-profile-meta">
              <c:choose>
                <c:when test="${not empty profileUser.nickname}">
                  <div class="nickname" id="leftNickname"><c:out value="${profileUser.nickname}" /></div>
                </c:when>
                <c:otherwise>
                  <div class="nickname" id="leftNickname"><c:out value="${profileUser.username}" /></div>
                </c:otherwise>
              </c:choose>
              <div class="grade"><c:out value="${profileUser.gradeName}" /></div>
              <a class="chat-link" href="${ctx}/chat">채팅하기</a>
            </div>
          </div>

          <nav class="left-menu" aria-label="마이페이지 메뉴">
            <button type="button" class="menu-item js-nav is-active" data-target="secProfile">프로필</button>
            <button type="button" class="menu-item js-nav" data-target="secPosts">나의 글</button>

            <c:if test="${isOwner}">
              <button type="button" class="menu-item js-nav" data-target="secMyQuestions">나의 질문</button>
            </c:if>

            <button type="button" class="menu-item js-nav" data-target="secMyAnswers">나의 답변</button>
            <button type="button" class="menu-item js-nav" data-target="secComments">나의 댓글</button>
            
            <c:if test="${isOwner}">
              <button type="button" class="menu-item js-nav" data-target="secAccount">나의 정보 수정</button>
            </c:if>
          </nav>
        </aside>

        <section class="mypage-right" id="rightLayout">
          
          <section id="secProfile" class="right-section is-show">
            <header class="section-head">
              <h2 class="section-title">프로필</h2>
            </header>

            <div class="profile-grid">
              <div class="profile-col">
                
                <div class="box">
                  <div class="box-title">자기소개
                    <c:if test="${isOwner}">
                      <button class="btn-edit" id="editIntro">수정</button>
                    </c:if>
                  </div>
                  <div class="box-body scroll-box">
                    <textarea id="introText"
                              class="pre-text"
                              data-original="${empty profileUser.intro ? '' : profileUser.intro}"
                              placeholder="간단한 자기소개를 작성해보세요.">${empty profileUser.intro ? '' : profileUser.intro}</textarea>
                  </div>
                  <span id="introMsg" class="form-msg"></span>
                </div>
                
                <div class="box grade-box" id="btnGrade" role="button" tabindex="0" aria-controls="modalGrade">
                  <div class="box-title">회원 등급</div>
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
                
                <div class="box">
                  <div class="box-title">답변수</div>
                  <div class="stats">
                    <div class="stat">
                      <div class="num">${empty profileUser.totalAnswers ? 0 : profileUser.totalAnswers}</div>
                      <div class="label">전체 답변</div>
                    </div>
                    <div class="stat">
                      <div class="num">${empty profileUser.totalViews ? 0 : profileUser.totalViews}</div>
                      <div class="label">조회수</div>
                    </div>
                    <div class="stat">
                      <div class="num">${empty profileUser.acceptedAnswers ? 0 : profileUser.acceptedAnswers}</div>
                      <div class="label">채택 답변</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="right-column">
                <div class="box">
                  <div class="box-title">최근 작성한 글</div>
                  <div class="recent-posts">
                    <ul class="recent-list">
                      <c:forEach var="p" items="${profileUser.posts}" varStatus="s">
                        <li>
                          <a href="${ctx}/community/view?board_id=${p.boardId}">
                            <div class="post-title"><c:out value='${p.title}'/></div>
                            <div class="post-meta">커뮤니티 · 조회<c:out value='${p.viewCount}'/> · 댓글<c:out value='${p.replyCnt}'/></div>
                          </a>
                        </li>
                      </c:forEach>
                    </ul>
                  </div>
                </div>    
                
                <div class="box">
                  <div class="box-title">최근 질문</div>
                  <div class="recent-questions">
                    <ul class="recent-list">
                      <c:forEach var="q" items="${profileUser.quests}" varStatus="s">
                        <li>
                          <a href="${ctx}/qna/detail?qna_id=${q.boardId}">
                            <div class="post-title"><c:out value='${q.title}'/></div>
                            <div class="post-meta">Q&A · 조회<c:out value='${q.viewCount}'/> · 댓글<c:out value='${q.replyCnt}'/></div>
                          </a>
                        </li>
                      </c:forEach>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </section>

          <section id="secPosts" class="right-section">
            <header class="section-head">
              <h2 class="section-title">나의 글</h2>
              <div class="section-actions">
                <div class="tabbar" data-section="posts">
                  <button type="button" class="tab is-active" data-tab="all">전체</button>
                  <button type="button" class="tab" data-tab="free">자유게시판</button>
                  <button type="button" class="tab" data-tab="market">벼룩시장</button>
                </div>
              </div>
            </header>

            <div class="list-wrap" data-api="${ctx}/user/mypage/posts" data-default-tab="all">
              <div class="list-head">
                <div class="list-count">
                  <span class="muted">총</span> <b class="js-total">0</b><span class="muted">건</span>
                </div>
              </div>
              <ul class="list js-list" aria-label="나의 글 목록"></ul>
              <div class="pager js-pager" aria-label="페이지네이션"></div>
              <div class="empty js-empty">표시할 데이터가 없습니다.</div>
            </div>
          </section>

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

              <div class="list-wrap" data-api="${ctx}/user/mypage/questions" data-default-tab="all">
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

            <div class="list-wrap" data-api="${ctx}/user/mypage/answers" data-default-tab="all">
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
          
          <section id="secComments" class="right-section">
            <header class="section-head">
              <h2 class="section-title">나의 댓글</h2>
              <div class="section-actions">
                <div class="tabbar" data-section="comments">
                  <button type="button" class="tab is-active" data-tab="all">전체</button>
                  <button type="button" class="tab" data-tab="community">커뮤니티</button>
                  <button type="button" class="tab" data-tab="qna">Q&amp;A</button>
                </div>
              </div>
            </header>

            <div class="list-wrap" data-api="${ctx}/user/mypage/replys" data-default-tab="all">
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

          <c:if test="${isOwner}">
            <section id="secAccount" class="right-section">
              <header class="section-head">
                <h2 class="section-title">나의 정보 수정</h2>
              </header>

              <form id="accountForm" class="account-form" method="post" action="${ctx}/user/mypage/update" autocomplete="off">
                <div class="form-stack">

                  <div class="form-col">
                    <label class="form-label">이름</label>
                    <input class="form-input" type="text" name="name" value="<c:out value='${profileUser.name}'/>" placeholder="한글, 영문 대소문자 2~10자" />
                  </div>

                  <div class="form-col">
                    <label class="form-label">생년월일</label>
                    <input class="form-input" type="date" name="brith_date" value="<c:out value='${profileUser.brith_date}'/>" />
                  </div>

                  <div class="form-col">
                    <label class="form-label">닉네임</label>
                    <input id="nicknameInput" class="form-input" type="text" name="nickname" value="<c:out value='${profileUser.nickname}'/>" placeholder="한글, 영문, 숫자 2~10자 (특수문자 제외)" />
                  </div>

                  <div class="form-col">
                    <label class="form-label">관심사</label>
                    <div class="input-group">
                      <input class="form-input" type="text" name="aspect" value="<c:out value='${profileUser.aspect}'/>" readonly placeholder="관심사를 선택하세요" />
                      <button type="button" class="btn btn-ghost" id="btnInterestPlant">선택</button>
                    </div>
                  </div>

                  <div class="form-col">
                    <label class="form-label">주소</label>
                    <input id="addressInput" class="form-input" type="text" name="address" value="<c:out value='${profileUser.address}'/>" placeholder="주소를 입력하세요" />
                  </div>
                  
                  <div class="form-col">
                    <label class="form-label">휴대전화</label>
                    <input class="form-input" type="text" id="inpPhone" name="phone" value="<c:out value='${profileUser.phone}'/>" placeholder="010으로 시작, 10~11자리 숫자" />
                  </div>

                  <div class="form-col">
                    <label class="form-label">이메일</label>
                    <div class="verify-card">
                      <div class="verify-card__head">
                        <h3 class="verify-title">이메일 인증</h3>
                        <p class="verify-desc">이메일을 수정하시길 원한다면 <strong>인증</strong>이 필요합니다.</p>
                      </div>
                      <div class="verify-card__body">
                        <div class="verify-single-row">
                          <input class="form-input" type="email" id="inpEmail" name="email" value="<c:out value='${profileUser.email}'/>" placeholder="이메일 주소" readonly/>
                        </div>
                        <div class="verify-single-row mt-15">
                          <button type="button" class="btn btn-outline w-100" id="sendCode-btn" data-email-open>이메일 인증</button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                <div class="form-bottom-actions">
                  <button type="submit" class="btn-large btn-large--primary" id="btnUpdateAll">정보 수정</button>
                </div>
              </form>
            </section>
          </c:if>

        </section> </div> <div class="modal-backdrop" id="modalBackdrop" hidden></div>
      
      <div class="modal" id="modalGrade" role="dialog" aria-modal="true" aria-labelledby="modalGradeTitle" hidden>
        <div class="modal-card">
          <div class="modal-head">
            <h3 id="modalGradeTitle">회원등급</h3>
            <button type="button" class="icon-btn" data-modal-close aria-label="닫기">×</button>
          </div>
          <div class="modal-body grade-guide">
            <h4>등급 안내</h4>
            <div class="grade-box">
              <ol>
                <li>일반 회원</li>
                <li>고수 회원</li>
                <li>전문가 회원</li>
              </ol>
            </div>
            
            <h4>1. 일반 회원</h4>
            <div class="grade-box">
              <ol>
                <li>가입 시 자동으로 부여됩니다.</li>
                <li>신규회원 / 게시글 조회만 가능</li>
              </ol>
            </div>
            
            <h4>2. 고수 회원</h4>
            <div class="grade-box">
              <ol>
                <li>게시글 100개</li>
                <li>댓글 70개</li>
                <li>방문 수 10회</li>
                <li>답변 채택 기능 사용</li>
                <li>게시글 신고 시 가중치 부여</li>
              </ol>
            </div>
            
            <h4>3. 전문가 회원</h4>
            <div class="grade-box">
              <ol>
                <li>관련 자격증 pdf 파일 제출 및 폼 작성 시, 검토 후 등업</li>
                <li>전문가 답변 작성 및 고정</li>
              </ol>
              <div class="expert-link">
                <a href="#">전문가 인증하러 가기</a>
              </div>
            </div>
          </div>
          <div class="modal-foot">
            <button type="button" class="btn" data-modal-close>닫기</button>
          </div>
        </div>
      </div>

      <div class="modal" id="modalPlant" role="dialog" aria-modal="true" aria-labelledby="modalPlantTitle" hidden>
        <div class="modal-card">
          <div class="modal-head">
            <h3 id="modalPlantTitle">관심사 선택</h3>
            <button type="button" class="icon-btn" data-modal-close aria-label="닫기">×</button>
          </div>
          <div class="modal-body">
            <div class="plant-search">
              <input type="text" id="plantKeyword" placeholder="관심사 검색" />
              <button type="button" class="btn" id="btnPlantSearch">검색</button>
            </div>
            <ul class="list" id="plantResult" aria-label="관심사 검색 결과"></ul>
            <div class="empty" id="plantEmpty">검색 결과가 없습니다.</div>
          </div>
          <div class="modal-foot">
            <button type="button" class="btn" data-modal-close>닫기</button>
          </div>
        </div>
      </div>
      
      <jsp:include page="/WEB-INF/views/common/EmailModal.jsp">
        <jsp:param name="mode" value="signup" />
      </jsp:include>

      <c:if test="${isOwner}">
        <div class="modal" id="modalAvatar" role="dialog" aria-modal="true" aria-labelledby="modalAvatarTitle" hidden>
          <div class="modal-card">
            <div class="modal-head">
              <h3 id="modalAvatarTitle">프로필 이미지</h3>
              <button type="button" class="icon-btn" data-modal-close aria-label="닫기">×</button>
            </div>
            <div class="modal-body center">
              <c:choose>
                <c:when test="${empty profileUser.profile}">
                  <img id="avatarLarge" src="${ctx}/resources/image/default_profile.png" alt="프로필 이미지 크게 보기"/>
                </c:when>
                <c:otherwise>
                  <img id="avatarLarge" src="/user/getProfile?fileName=${profileUser.profile}" 
                       onerror="this.onerror=null; this.src='${ctx}/resources/image/default_profile.png';" alt="프로필이미지 크게 보기"/>
                </c:otherwise>
              </c:choose>
              
              <div class="avatar-actions" style="margin-top:12px;">
                <label class="btn" for="avatarFile">이미지 선택</label>
                <input type="file" id="avatarFile" accept="image/*" hidden>
                <div class="help-text" style="margin-top:6px; font-size:12px; opacity:.7;"></div>
              </div>
            </div>
            <div class="modal-foot">
              <button type="button" class="btn primary" id="btnAvatarSave">저장</button>
              <button type="button" class="btn" data-modal-close>닫기</button>
            </div>
          </div>
        </div>
      </c:if>

    </div>
  </section>
</div>

<script src="${pageContext.request.contextPath}/resources/js/user/user_myPageUpdate.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/user/user_myPage.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />