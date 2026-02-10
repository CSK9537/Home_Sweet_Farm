<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<%
    // --- 임시 더미 가이드 데이터 (뷰 테스트용) ---
    GuideVO dummy = new GuideVO();
    dummy.setPlant_id(1);
    dummy.setGuide_carelevel("중간");
    dummy.setGuide_caredifficulty("보통");
    dummy.setGuide_toughness("강함");
    dummy.setGuide_lifespan("1년생");

    dummy.setGuide_caretip("잎이 처지기 전 흙 상태를 확인하고 물을 주세요.\n통풍이 중요합니다.");
    dummy.setGuide_watering_schedule("주 2~3회");
    dummy.setGuide_sunlight_requirements("하루 6시간 이상");
    dummy.setGuide_soil_type("배수가 잘 되는 흙");
    dummy.setGuide_soil_ph("6.0 ~ 6.8");
    dummy.setGuide_hardinesszone("9~11");
    dummy.setGuide_toxicity("없음");

    dummy.setGuide_watering_humiditylevel("중간(40~60%)");
    dummy.setGuide_watering_content("겉흙이 마르면 흠뻑 주세요.");

    dummy.setGuide_sunlight_tolerance("±1시간");
    dummy.setGuide_sunlight_content("강한 직사광선에서 잎 끝이 탈 수 있어요. 한여름은 차광 추천.");

    dummy.setGuide_temperature_imin(18);
    dummy.setGuide_temperature_imax(28);
    dummy.setGuide_temperature_tmin(12);
    dummy.setGuide_temperature_tmax(32);
    dummy.setGuide_temperature_content("야간 최저 12℃ 아래로 떨어지면 생육이 둔화될 수 있습니다.");

    dummy.setGuide_soil_composition("상토 70% + 펄라이트 30%");
    dummy.setGuide_soil_content("배수/통기성을 위해 펄라이트 비율을 올리면 좋습니다.");

    dummy.setGuide_fertilizing_content("생육기(봄~여름)에 2주 1회 액비를 희석해 주세요.");

    dummy.setGuide_pruning_time("생육기 중");
    dummy.setGuide_pruning_benefits("통풍 개선, 병해 예방");
    dummy.setGuide_pruning_content("약한 줄기/잎은 제거하고, 지나치게 밀집된 부분을 정리합니다.");

    dummy.setGuide_propagation_time("봄~초여름");
    dummy.setGuide_propagation_type("삽목");
    dummy.setGuide_propagation_content("마디 아래를 사선으로 자른 뒤 물꽂이/흙꽂이를 진행하세요.");

    dummy.setGuide_transplanting_time("봄");
    dummy.setGuide_transplanting_content("뿌리가 화분을 꽉 채웠다면 1~2호 큰 화분으로 옮깁니다.");

    dummy.setGuide_planting_time("봄");
    dummy.setGuide_planting_content("정식 전 1주일 정도 순화시키고 심으면 활착이 좋습니다.");

    dummy.setGuide_repotting_schedule("1년에 1회");
    dummy.setGuide_repotting_content("뿌리 상태를 확인하며 상한 뿌리는 제거합니다.");

    dummy.setGuide_harvest_time("여름");
    dummy.setGuide_harvest_content("열매가 단단해지고 색이 진해지면 수확합니다.");

    request.setAttribute("guide", dummy);

    // (선택) 제목/이미지 테스트용
    request.setAttribute("plantName", "오이(테스트)");
    request.setAttribute("subtitle", "뷰 단독 확인용 더미 데이터");
    request.setAttribute("heroImageUrl", request.getContextPath() + "/resources/images/sample.jpg");
%>

<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/community/CommunityList.css" />

<jsp:include page="/WEB-INF/views/layout/header.jsp" />

<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/plant/GuideView.css" />

<c:set var="g" value="${guide}" />

<div class="page-shell">
  <div class="content-wrap">
    <div class="content-card community">

      <!-- 상단 타이틀/탭/버튼 -->
      <div class="community__header">
        <div class="community__titleRow">
          <h2 class="community__title">자유게시판</h2>

          <a class="community__writeBtn" href="${pageContext.request.contextPath}/community/write">
            	글쓰기
          </a>
        </div>

        <div class="community__subRow">
          <div class="community__tabs" role="tablist" aria-label="게시판 탭">
            <a class="community__tab is-active" href="#" role="tab" aria-selected="true">자유게시판</a>
            <span class="community__tabSep">|</span>
            <a class="community__tab" href="#" role="tab" aria-selected="false">비움시장</a>
          </div>
          <article class="guide-article">
            <p class="guide-text">${g.guide_caretip}</p>
          </article>
        </section>
      </c:if>

		<!-- 급수 -->
		<c:if test="${not empty g.guide_watering_schedule 
		             or not empty g.guide_watering_humiditylevel 
		             or not empty g.guide_watering_content}">
		             
		  <section class="guide-section js-empty-scan">
		    <div class="guide-section__head">
		      <h2 class="guide-section__title">급수 방법</h2>
		    </div>
		
		    <div class="guide-kv">
		
		      <c:if test="${not empty g.guide_watering_schedule}">
		        <div class="guide-kv__row">
		          <span class="guide-kv__label">급수 일정(주기)</span>
		          <span class="guide-kv__value">
		            ${g.guide_watering_schedule}
		          </span>
		        </div>
		      </c:if>
		
		      <!-- VO 기준 watering 그대로 사용 -->
		      <c:if test="${not empty g.guide_watering_humiditylevel}">
		        <div class="guide-kv__row">
		          <span class="guide-kv__label">급수 습도 수준</span>
		          <span class="guide-kv__value">
		            ${g.guide_watering_humiditylevel}
		          </span>
		        </div>
		      </c:if>
		
		    </div>
		
		    <c:if test="${not empty g.guide_watering_content}">
		      <article class="guide-article">
		        <p class="guide-text">
		          ${g.guide_watering_content}
		        </p>
		      </article>
		    </c:if>
		
		  </section>
		</c:if>

          <div class="community__viewBtns" aria-label="보기 방식">
            <button type="button" class="viewBtn is-active" data-view="card">카드</button>
            <button type="button" class="viewBtn" data-view="album">앨범</button>
            <button type="button" class="viewBtn" data-view="list">리스트</button>
          </div>
        </div>

        <div class="community__divider"></div>
      </div>

      <!-- 목록 래퍼 (뷰 모드 클래스가 여기에 붙음) -->
      <div id="communityList" class="community__list view-card">

        <c:forEach var="p" items="${posts}">
          <a class="postItem" href="${pageContext.request.contextPath}/community/detail?id=${p.id}">
            <div class="postItem__imgWrap">
              <img class="postItem__img" src="${p.img}" alt="게시글 썸네일" />
              <!-- 앨범형 오버레이 텍스트 -->
              <div class="postItem__overlay">
                <div class="postItem__overlayTitle">${p.title}</div>
                <div class="postItem__overlayMeta">
                  <span>${p.writer}</span>
                  <span class="sep">|</span>
                  <span>${p.date}</span>
                </div>
                <div class="postItem__overlayStats">
                  <span>조회수 ${p.views}</span><span class="sep">|</span>
                  <span>좋아요 ${p.likes}</span><span class="sep">|</span>
                  <span>댓글 ${p.comments}</span>
                </div>
              </div>
            </div>

            <div class="postItem__body">
              <div class="postItem__title">${p.title}</div>
              <div class="postItem__writer">${p.writer}</div>

              <div class="postItem__meta">
                <span class="label">등록날짜</span>
                <span class="value">${p.date}</span>
                <span class="sep">|</span>
                <span class="value">조회수 ${p.views}</span>
                <span class="sep">|</span>
                <span class="value">좋아요 ${p.likes}</span>
                <span class="sep">|</span>
                <span class="value">댓글 ${p.comments}</span>
              </div>

              <div class="postItem__content">${p.content}</div>
            </div>
          </a>
        </c:forEach>

      </div>

      <!-- 하단: 페이지네이션 + 검색 -->
      <div class="community__bottom">
        <div class="pagination">
          <button type="button" class="pageBtn">&lsaquo;</button>
          <button type="button" class="pageNum is-active">1</button>
          <button type="button" class="pageNum">2</button>
          <button type="button" class="pageNum">3</button>
          <button type="button" class="pageNum">4</button>
          <button type="button" class="pageNum">5</button>
          <button type="button" class="pageBtn">&rsaquo;</button>
        </div>

        <form class="searchBar" action="${pageContext.request.contextPath}/community/list" method="get">
          <input type="text" name="q" class="searchInput" placeholder="검색어를 입력하세요" />
          <button type="submit" class="searchBtn">검색</button>
        </form>
      </div>

    </div>
  </div>
</div>

<script defer src="${pageContext.request.contextPath}/resources/js/plant/GuideView.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
