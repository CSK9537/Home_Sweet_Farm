<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/law/TermsOfUse.css">

<%@ include file="/WEB-INF/views/layout/header.jsp" %>
<div class="page-shell">

  <main class="content-wrap">
    <section class="content-card">
      <div class="terms">
        <div class="terms__container">

          <!-- 상단 타이틀 -->
          <header class="terms__header">
            <h1 class="terms__title">이용약관</h1>
            <p class="terms__effective-date">시행일: 2026년 03월 01일</p>
          </header>

          <!-- 제1조 -->
          <section class="terms__section">
            <h2 class="terms__section-title">제1조 (목적)</h2>
            <p class="terms__paragraph">
              이 약관은 <strong class="terms__brand">Home Sweet Farm</strong>(이하 '회사')가 제공하는
              '오후의 식물' 관련 제반 서비스(이하 '서비스')의 이용과 관련하여 회사와 회원과의 권리, 의무 및 책임사항,
              기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <!-- 제2조 -->
          <section class="terms__section">
            <h2 class="terms__section-title">제2조 (정의)</h2>
            <p class="terms__lead">이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>

            <ol class="terms__list terms__list--ordered">
              <li class="terms__list-item">
                <strong class="terms__term">'서비스'</strong>
                <span class="terms__desc">
                  라 함은 구현되는 단말기(PC, 모바일, 태블릿 등의 각종 유무선 장치를 포함)와 상관없이
                  '회원'이 이용할 수 있는 오후의 식물 및 관련 제반 서비스를 의미합니다.
                </span>
              </li>
              <li class="terms__list-item">
                <strong class="terms__term">'회원'</strong>
                <span class="terms__desc">
                  이라 함은 회사의 '서비스'에 접속하여 이 약관에 따라 '회사'와 이용계약을 체결하고
                  '회사'가 제공하는 '서비스'를 이용하는 고객을 말합니다.
                </span>
              </li>
              <li class="terms__list-item">
                <strong class="terms__term">'게시물'</strong>
                <span class="terms__desc">
                  이라 함은 '회원'이 '서비스'를 이용함에 있어 '서비스'상에 게시한 부호·문자·음성·화상·동영상 등의
                  정보 형태의 글, 사진, 동영상 및 각종 파일과 링크 등을 의미합니다.
                </span>
              </li>
            </ol>
          </section>

          <!-- 제3조 -->
          <section class="terms__section">
            <h2 class="terms__section-title">제3조 (약관의 게시와 개정)</h2>
            <p class="terms__paragraph">① '회사'는 이 약관의 내용을 '회원'이 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.</p>
            <p class="terms__paragraph">
              ② '회사'는 '약관의 규제에 관한 법률', '정보통신망 이용촉진 및 정보보호 등에 관한 법률(이하 '정보통신망법')'
              등 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
            </p>
            <p class="terms__paragraph">
              ③ '회사'가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 제1항의 방식에 따라
              그 개정약관의 적용일자 30일 전부터 적용일자 전일까지 공지합니다. 다만, 회원에게 불리한 약관의 개정의 경우에는
              공지 외에 일정 기간 서비스 내 전자우편, 전자쪽지, 로그인시 동의창 등의 전자적 수단을 통해 따로 명확히 통지하도록 합니다.
            </p>
          </section>

          <!-- 제4조 -->
          <section class="terms__section">
            <h2 class="terms__section-title">제4조 (회원의 의무)</h2>
            <p class="terms__paragraph">① '회원'은 다음 행위를 하여서는 안 됩니다.</p>

            <ul class="terms__list terms__list--bulleted">
              <li class="terms__bullet-item">신청 또는 변경 시 허위 내용의 등록</li>
              <li class="terms__bullet-item">타인의 정보 도용</li>
              <li class="terms__bullet-item">'회사'가 게시한 정보의 변경</li>
              <li class="terms__bullet-item">'회사'와 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
              <li class="terms__bullet-item">'회사' 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
              <li class="terms__bullet-item">외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 '서비스'에 공개 또는 게시하는 행위</li>
            </ul>

            <p class="terms__paragraph">
              ② '회원'은 관계법, 이 약관의 규정, 이용안내 및 '서비스'와 관련하여 공지한 주의사항,
              '회사'가 통지하는 사항 등을 준수하여야 하며, 기타 '회사'의 업무에 방해되는 행위를 하여서는 아니 됩니다.
            </p>
          </section>

          <!-- 제5조 -->
          <section class="terms__section">
            <h2 class="terms__section-title">제5조 (서비스의 제공 등)</h2>
            <p class="terms__paragraph">① '회사'는 '회원'에게 아래와 같은 서비스를 제공합니다.</p>

            <ol class="terms__list terms__list--ordered">
              <li class="terms__list-item">식물 정보 검색 및 추천 서비스</li>
              <li class="terms__list-item">AI 기반 식물 진단 및 상담 서비스</li>
              <li class="terms__list-item">커뮤니티 서비스 (게시판 등)</li>
              <li class="terms__list-item">기타 '회사'가 추가 개발하거나 다른 회사와의 제휴계약 등을 통해 '회원'에게 제공하는 일체의 서비스</li>
            </ol>

            <p class="terms__paragraph">② '회사'는 '서비스'의 이용에 필요한 최소한의 기술 사양을 서비스 내에 공지할 수 있습니다.</p>
            <p class="terms__paragraph">
              ③ '서비스'는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다. 다만, '회사'는 컴퓨터 등 정보통신설비의 보수점검,
              교체 및 고장, 통신두절 또는 운영상 상당한 이유가 있는 경우 서비스의 제공을 일시적으로 중단할 수 있습니다.
            </p>
          </section>

          <!-- 제6조 -->
          <section class="terms__section">
            <h2 class="terms__section-title">제6조 (게시물의 저작권)</h2>
            <p class="terms__paragraph">① '회원'이 '서비스' 내에 게시한 '게시물'의 저작권은 해당 게시물의 저작자에게 귀속됩니다.</p>
            <p class="terms__paragraph">
              ② '회원'이 '서비스' 내에 게시하는 '게시물'은 '서비스' 및 관련 프로모션 등에 노출될 수 있으며,
              해당 노출을 위해 필요한 범위 내에서는 일부 수정, 복제, 편집되어 게시될 수 있습니다. 이 경우, 회사는 저작권법 규정을 준수하며,
              '회원'은 언제든지 고객센터 또는 '서비스' 내 관리기능을 통해 해당 게시물에 대해 삭제, 비공개 등의 조치를 취할 수 있습니다.
            </p>
          </section>

          <!-- 제7조 -->
          <section class="terms__section">
            <h2 class="terms__section-title">제7조 (면책조항)</h2>
            <p class="terms__paragraph">
              ① '회사'는 천재지변 또는 이에 준하는 불가항력으로 인하여 '서비스'를 제공할 수 없는 경우에는 '서비스' 제공에 관한 책임이 면제됩니다.
            </p>
            <p class="terms__paragraph">② '회사'는 '회원'의 귀책사유로 인한 '서비스' 이용의 장애에 대하여는 책임을 지지 않습니다.</p>
            <p class="terms__paragraph">
              ③ '회사'가 제공하는 정보 및 AI 진단 결과는 참고 자료이며, 그 정확성이나 완전성을 보증하지 않습니다.
              이를 신뢰하여 발생한 '회원'의 손해에 대하여 '회사'는 책임을 지지 않습니다.
            </p>
          </section>

          <!-- 제8조 -->
          <section class="terms__section">
            <h2 class="terms__section-title">제8조 (재판권 및 준거법)</h2>
            <p class="terms__paragraph">
              '회사'와 '회원' 간에 발생한 분쟁에 관한 소송은 제소 당시의 '회원'의 주소에 의하고, 주소가 없는 경우 거소를 관할하는 지방법원의
              전속관할로 합니다. 단, 제소 당시 '회원'의 주소 또는 거소가 분명하지 아니한 경우에는 민사소송법에 따라 관할법원을 정합니다.
              준거법은 대한민국법으로 합니다.
            </p>
          </section>

          <!-- 부칙 -->
          <footer class="terms__appendix">
            <strong class="terms__appendix-title">[부칙]</strong>
            <p class="terms__appendix-text">이 약관은 2025년 7월 30일부터 적용됩니다.</p>
          </footer>

          <!-- CTA -->
          <div class="terms__cta">
            <a class="terms__cta-btn" href="/">홈으로 돌아가기</a>
          </div>

        </div>
      </div>
    </section>
  </main>
</div>
