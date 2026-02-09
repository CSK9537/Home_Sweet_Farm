<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/law/Personal.css">

<div class="page-shell">
  <%@ include file="/WEB-INF/views/layout/header.jsp" %>

  <div class="content-wrap">
    <section class="content-card policy" aria-labelledby="policy-title">
      <header class="policy__header">
        <h1 id="policy-title" class="policy__title">개인정보처리방침</h1>
        <p class="policy__date">시행일: 2026년 3월 01일</p>
        <p class="policy__intro">
          <strong class="policy__brand">Home Sweet Farm</strong>
          <span class="policy__intro-text">
          	(이하 '회사')는 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
          </span>
        </p>
      </header>

      <!-- 제1조 -->
      <section class="policy__section">
        <h2 class="policy__section-title">제1조 (개인정보의 처리 목적)</h2>
        <p class="policy__text">
         	'회사'는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지
         	 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
        </p>

        <ol class="policy__list policy__list--ordered">
          <li class="policy__list-item">
            <span class="policy__label">홈페이지 회원가입 및 관리:</span>
		            회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리,
		            서비스 부정이용 방지, 각종 고지·통지 등을 목적으로 개인정보를 처리합니다.
          </li>
          <li class="policy__list-item">
            <span class="policy__label">서비스 제공:</span>
            	콘텐츠 제공, 맞춤 서비스 제공, AI 상담 서비스 운영 등을 목적으로 개인정보를 처리합니다.
          </li>
          <li class="policy__list-item">
            <span class="policy__label">민원사무 처리:</span>
            	민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보 등을 목적으로 개인정보를 처리합니다.
          </li>
        </ol>
      </section>

      <!-- 제2조 -->
      <section class="policy__section">
        <h2 class="policy__section-title">제2조 (처리하는 개인정보의 항목)</h2>
        <p class="policy__text">① '회사'는 다음의 개인정보 항목을 처리하고 있습니다.</p>

        <ul class="policy__list">
          <li class="policy__list-item">
            <span class="policy__label">회원가입 및 관리:</span>
            	(필수) 이메일 주소, 비밀번호, 이름/닉네임
          </li>
          <li class="policy__list-item">
            <span class="policy__label">서비스 이용 과정에서 자동 생성 정보:</span>
            	IP 주소, 쿠키, 서비스 이용 기록, 기기정보
          </li>
        </ul>
      </section>

      <!-- 제3조 -->
      <section class="policy__section">
        <h2 class="policy__section-title">제3조 (개인정보의 처리 및 보유 기간)</h2>
        <p class="policy__text">
		          ① '회사'는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은
		        개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
        </p>
        <p class="policy__text">② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.</p>

        <ul class="policy__list">
          <li class="policy__list-item">
            <span class="policy__label">홈페이지 회원 가입 및 관리:</span>
            	회원 탈퇴 시까지. 다만, 다음의 사유에 해당하는 경우에는 해당 사유 종료 시까지 보유합니다.
            <ul class="policy__sublist">
              <li>관계 법령 위반에 따른 수사·조사 등이 진행 중인 경우에는 해당 수사·조사 종료 시까지</li>
              <li>서비스 이용에 따른 채권·채무관계 잔존 시에는 해당 채권·채무관계 정산 시까지</li>
            </ul>
          </li>
          <li class="policy__list-item">
            <span class="policy__label">전자상거래에서의 계약·청약철회, 대금결제, 재화 등 공급기록:</span>
            	5년 (전자상거래 등에서의 소비자보호에 관한 법률)
          </li>
        </ul>
      </section>

      <!-- 제4조 -->
      <section class="policy__section">
        <h2 class="policy__section-title">제4조 (정보주체와 법정대리인의 권리·의무 및 그 행사방법)</h2>
        <p class="policy__text">
		          정보주체는 '회사'에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.
		          권리 행사는 '회사'에 대해 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 '회사'는 이에 대해 지체 없이 조치하겠습니다.
        </p>
      </section>

      <!-- 제5조 -->
      <section class="policy__section">
        <h2 class="policy__section-title">제5조 (개인정보의 파기)</h2>
        <p class="policy__text">
          ① '회사'는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
        </p>
        <p class="policy__text">② 개인정보 파기의 절차 및 방법은 다음과 같습니다.</p>

        <ul class="policy__list">
          <li class="policy__list-item">
            <span class="policy__label">파기절차:</span>
            	파기 사유가 발생한 개인정보를 선정하고, 회사의 개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.
          </li>
          <li class="policy__list-item">
            <span class="policy__label">파기방법:</span>
            	전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하며, 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.
          </li>
        </ul>
      </section>

      <!-- 제6조 -->
      <section class="policy__section">
        <h2 class="policy__section-title">제6조 (개인정보의 안전성 확보 조치)</h2>
        <p class="policy__text">'회사'는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>

        <ol class="policy__list policy__list--ordered">
          <li class="policy__list-item"><span class="policy__label">관리적 조치:</span> 내부관리계획 수립·시행, 정기적 직원 교육 등</li>
          <li class="policy__list-item"><span class="policy__label">기술적 조치:</span> 접근권한 관리, 접근통제시스템 설치, 암호화, 보안프로그램 설치</li>
          <li class="policy__list-item"><span class="policy__label">물리적 조치:</span> 전산실, 자료보관실 등의 접근통제</li>
        </ol>
      </section>

      <!-- 제7조 -->
      <section class="policy__section">
        <h2 class="policy__section-title">제7조 (개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항)</h2>
        <p class="policy__text">
			'회사'는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.
			이용자는 웹브라우저 옵션 설정을 통해 쿠키 저장을 거부하거나, 저장 시 확인을 거칠 수 있습니다.
        </p>
      </section>

      <!-- 제8조 -->
      <section class="policy__section">
        <h2 class="policy__section-title">제8조 (개인정보 보호책임자)</h2>
        <p class="policy__text">
          	① '회사'는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 불만처리 및 피해구제를 위하여 아래와 같이 책임자를 지정하고 있습니다.
        </p>

        <ul class="policy__info-list">
		  <li class="policy__info-title">▶ 개인정보 보호책임자</li>
		
		  <li class="policy__info-item">
		    <span class="policy__info-label">성명</span>
		    <span class="policy__info-value">박해진</span>
		  </li>
		
		  <li class="policy__info-item">
		    <span class="policy__info-label">직책</span>
		    <span class="policy__info-value">대표</span>
		  </li>
		
		  <li class="policy__info-item">
		    <span class="policy__info-label">연락처</span>
		    <span class="policy__info-value">
		      010-6258-1675
		    </span>
		  </li>
		  <li class="policy__info-item">
		    <span class="policy__info-label">이메일</span>
		    <span class="policy__info-value">
		      hermann8hesse@gmail.com
		    </span>
		  </li>
		</ul>

        <p class="policy__text">
          	② 정보주체께서는 서비스 이용 중 발생한 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 책임자 및 담당부서로 문의하실 수 있습니다.
          	'회사'는 지체 없이 답변 및 처리해드릴 것입니다.
        </p>
      </section>

      <!-- 제9조 -->
      <section class="policy__section">
        <h2 class="policy__section-title">제9조 (개인정보 처리방침의 변경)</h2>
        <p class="policy__text">
	          이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는
	          변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
        </p>
      </section>

      <div class="policy__actions">
        <a class="policy__home-btn" href="#">홈으로 돌아가기</a>
      </div>
    </section>
  </div>
</div>
