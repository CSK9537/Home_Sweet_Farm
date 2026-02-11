<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<jsp:include page="/WEB-INF/views/layout/header.jsp" />

<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/plant/PlantView.css" />

<div class="page-shell">
  <div class="content-wrap">
    <div class="content-card plant-view" id="plantViewRoot">

      <!-- ===== plant 모델 바인딩  ===== -->
      <c:choose>
        <c:when test="${not empty plantInfo}">
          <c:set var="p" value="${plantInfo}" />
        </c:when>
        <c:otherwise>
          <c:set var="p" value="${null}" />
        </c:otherwise>
      </c:choose>

      <!-- ===== 상단 헤더(이름/요약/썸네일) ===== -->
      <c:if test="${not empty p}">
        <section class="pv-hero" data-section>
          <div class="pv-hero__left">
            <!-- <div class="pv-breadcrumb">홈 / 식물 / 상세</div> -->

            <h1 class="pv-title">
              <c:out value="${p.plant_name_kor}" />
            </h1>

            <c:if test="${not empty p.plant_name}">
              <div class="pv-subtitle">
                <c:out value="${p.plant_name}" />
              </div>
            </c:if>

            <c:if test="${not empty p.plant_description}">
              <p class="pv-desc">
                <c:out value="${p.plant_description}" />
              </p>
            </c:if>

            <!-- 학명/분류(간단 요약 라인) -->
            <div class="pv-mini-meta" data-section>
              <c:if test="${not empty p.plant_species}">
                <span class="pv-chip">종: <c:out value="${p.plant_species}" /></span>
              </c:if>
              <c:if test="${not empty p.plant_genus}">
                <span class="pv-chip">속: <c:out value="${p.plant_genus}" /></span>
              </c:if>
              <c:if test="${not empty p.plant_family}">
                <span class="pv-chip">과: <c:out value="${p.plant_family}" /></span>
              </c:if>
            </div>
          </div>

          <div class="pv-hero__right" data-section>
            <c:if test="${not empty p.plant_image}">
              <img class="pv-thumb" src="/plant/image/${p.plant_image}" alt="식물 이미지" loading="lazy" />
            </c:if>
          </div>
        </section>

        <!-- ===== CTA 카드 (스크린샷의 큰 박스 느낌) ===== -->
        <section class="pv-cta" data-section>
          <div class="pv-cta__box">
            <div class="pv-cta__title">식물을 키워서 식물을 잘 아신다면?</div>
            <div class="pv-cta__text">같이 키우는 사람들과 팁을 공유하고 관리 기록을 남겨보세요.</div>
            <div class="pv-cta__actions">
              <!-- 오류 제거를 위한 href 제거, 커뮤니티 완성시 추가할 것 -->
              <!-- href="${pageContext.request.contextPath}/community/write?plant_id=${p.plant_id} -->
              <a class="btn btn-primary">
                	글 작성하러 가기
              </a>
            </div>
          </div>
        </section>

        <!-- ===== 분류 테이블 ===== -->
        <section class="pv-box" data-section>

          <table class="pv-table" data-section>
            <tbody>
              <c:if test="${not empty p.plant_species}">
                <tr><th>종</th><td><c:out value="${p.plant_species}" /></td></tr>
              </c:if>
              <c:if test="${not empty p.plant_genus}">
                <tr><th>속</th><td><c:out value="${p.plant_genus}" /></td></tr>
              </c:if>
              <c:if test="${not empty p.plant_family}">
                <tr><th>과</th><td><c:out value="${p.plant_family}" /></td></tr>
              </c:if>
              <c:if test="${not empty p.plant_order}">
                <tr><th>목</th><td><c:out value="${p.plant_order}" /></td></tr>
              </c:if>
              <c:if test="${not empty p.plant_class}">
                <tr><th>강</th><td><c:out value="${p.plant_class}" /></td></tr>
              </c:if>
              <c:if test="${not empty p.plant_phylum}">
                <tr><th>문</th><td><c:out value="${p.plant_phylum}" /></td></tr>
              </c:if>
            </tbody>
          </table>
        </section>

        <!-- ===== 아이콘 성격(스펙) 영역: 값 없으면 항목 숨김 ===== -->
        <section class="pv-spec" data-section>
          <div class="pv-spec__grid">
          
            <c:if test="${not empty p.plant_toxicity}">
              <div class="spec-item">
                <div class="spec-ico" aria-hidden="true">☣</div>
                <div class="spec-txt">
                  <div class="spec-k">독성</div>
                  <div class="spec-v"><c:out value="${p.plant_toxicity}" /></div>
                </div>
              </div>
            </c:if>

            <c:if test="${not empty p.plant_lifespan}">
              <div class="spec-item">
                <div class="spec-ico" aria-hidden="true">⏳</div>
                <div class="spec-txt">
                  <div class="spec-k">수명</div>
                  <div class="spec-v"><c:out value="${p.plant_lifespan}" /></div>
                </div>
              </div>
            </c:if>

            <c:if test="${not empty p.plant_type}">
              <div class="spec-item">
                <div class="spec-ico" aria-hidden="true">🌿</div>
                <div class="spec-txt">
                  <div class="spec-k">식물 타입</div>
                  <div class="spec-v"><c:out value="${p.plant_type}" /></div>
                </div>
              </div>
            </c:if>

            <c:if test="${not empty p.plant_height}">
              <div class="spec-item">
                <div class="spec-ico" aria-hidden="true">📏</div>
                <div class="spec-txt">
                  <div class="spec-k">높이</div>
                  <div class="spec-v"><c:out value="${p.plant_height}" /></div>
                </div>
              </div>
            </c:if>

            <c:if test="${not empty p.plant_spread}">
              <div class="spec-item">
                <div class="spec-ico" aria-hidden="true">↔</div>
                <div class="spec-txt">
                  <div class="spec-k">꼭대기 지름</div>
                  <div class="spec-v"><c:out value="${p.plant_spread}" /></div>
                </div>
              </div>
            </c:if>

            <c:if test="${p.plant_temperature_imin ne 0 || p.plant_temperature_imax ne 0}">
              <div class="spec-item">
                <div class="spec-ico" aria-hidden="true">🌡</div>
                <div class="spec-txt">
                  <div class="spec-k">이상적인 온도</div>
                  <div class="spec-v">
                    <c:out value="${p.plant_temperature_imin}" />°C ~ <c:out value="${p.plant_temperature_imax}" />°C
                  </div>
                </div>
              </div>
            </c:if>

            <c:if test="${not empty p.plant_growthrate}">
              <div class="spec-item">
                <div class="spec-ico" aria-hidden="true">📈</div>
                <div class="spec-txt">
                  <div class="spec-k">성장률</div>
                  <div class="spec-v"><c:out value="${p.plant_growthrate}" /></div>
                </div>
              </div>
            </c:if>

            <c:if test="${not empty p.plant_growthseason}">
              <div class="spec-item">
                <div class="spec-ico" aria-hidden="true">🗓</div>
                <div class="spec-txt">
                  <div class="spec-k">성장기</div>
                  <div class="spec-v"><c:out value="${p.plant_growthseason}" /></div>
                </div>
              </div>
            </c:if>
            
            <c:if test="${not empty p.plant_stemcolor}">
              <div class="spec-item">
                <div class="spec-ico" aria-hidden="true">🌿</div>
                <div class="spec-txt">
                  <div class="spec-k">줄기 색</div>
                  <div class="spec-v"><c:out value="${p.plant_stemcolor}" /></div>
                </div>
              </div>
            </c:if>
            
            <c:if test="${not empty p.plant_leafcolor}">
              <div class="spec-item">
                <div class="spec-ico" aria-hidden="true">🍃</div>
                <div class="spec-txt">
                  <div class="spec-k">잎 색</div>
                  <div class="spec-v"><c:out value="${p.plant_leafcolor}" /></div>
                </div>
              </div>
            </c:if>
            
            <c:if test="${not empty p.plant_leaftype}">
              <div class="spec-item">
                <div class="spec-ico" aria-hidden="true">🍃</div>
                <div class="spec-txt">
                  <div class="spec-k">잎 종류</div>
                  <div class="spec-v"><c:out value="${p.plant_leaftype}" /></div>
                </div>
              </div>
            </c:if>
            
            <c:if test="${not empty p.plant_flowercolor}">
              <div class="spec-item">
                <div class="spec-ico" aria-hidden="true">🌸</div>
                <div class="spec-txt">
                  <div class="spec-k">꽃 색 </div>
                  <div class="spec-v"><c:out value="${p.plant_flowercolor}" /></div>
                </div>
              </div>
            </c:if>
            
            <c:if test="${not empty p.plant_flowersize}">
              <div class="spec-item">
                <div class="spec-ico" aria-hidden="true">🌸</div>
                <div class="spec-txt">
                  <div class="spec-k">꽃 지름</div>
                  <div class="spec-v"><c:out value="${p.plant_flowersize}" /></div>
                </div>
              </div>
            </c:if>
            
            <c:if test="${not empty p.plant_bloomtime}">
              <div class="spec-item">
                <div class="spec-ico" aria-hidden="true">🗓</div>
                <div class="spec-txt">
                  <div class="spec-k">개화 시기</div>
                  <div class="spec-v"><c:out value="${p.plant_bloomtime}" /></div>
                </div>
              </div>
            </c:if>
            
            <c:if test="${not empty p.plant_fruitcolor}">
              <div class="spec-item">
                <div class="spec-ico" aria-hidden="true">🍎</div>
                <div class="spec-txt">
                  <div class="spec-k">과일 색</div>
                  <div class="spec-v"><c:out value="${p.plant_fruitcolor}" /></div>
                </div>
              </div>
            </c:if>
            
            <c:if test="${not empty p.plant_harvesttime}">
              <div class="spec-item">
                <div class="spec-ico" aria-hidden="true">🗓</div>
                <div class="spec-txt">
                  <div class="spec-k">수확 시기</div>
                  <div class="spec-v"><c:out value="${p.plant_harvesttime}" /></div>
                </div>
              </div>
            </c:if>
            
            <c:if test="${not empty p.plant_dormancy}">
              <div class="spec-item">
                <div class="spec-ico" aria-hidden="true">🗓</div>
                <div class="spec-txt">
                  <div class="spec-k">휴면기</div>
                  <div class="spec-v"><c:out value="${p.plant_dormancy}" /></div>
                </div>
              </div>
            </c:if>
            
          </div>
        </section>



        <!-- ===== 이미지 스트립(여러 장) : plantImages(List<String>) 있으면 사용, 없으면 기본이미지 1장만 ===== -->
        <%-- <section class="pv-box" data-section>
          <div class="pv-box__head">
            <h2 class="pv-h2">이미지</h2>
          </div>

          <div class="pv-gallery" data-section>
            <button type="button" class="pv-gbtn pv-gbtn--prev" aria-label="이전 이미지">‹</button>

            <div class="pv-gtrack" id="pvGalleryTrack">
              <c:choose>
                <c:when test="${not empty plantImages}">
                  <c:forEach var="img" items="${plantImages}">
                    <c:if test="${not empty img}">
                      <img class="pv-gimg" src="<c:out value='${img}'/>" alt="식물 이미지" loading="lazy" />
                    </c:if>
                  </c:forEach>
                </c:when>
                <c:otherwise>
                  <c:if test="${not empty p.plant_image}">
                    <img class="pv-gimg" src="<c:out value='${p.plant_image}'/>" alt="식물 이미지" loading="lazy" />
                  </c:if>
                </c:otherwise>
              </c:choose>
            </div>

            <button type="button" class="pv-gbtn pv-gbtn--next" aria-label="다음 이미지">›</button>
          </div>
        </section> --%>

        <!-- ===== 문화/가치 섹션: 긴 텍스트(CLOB)들 ===== -->
        <section class="pv-box" data-section>
          <div class="pv-box__head">
            <h2 class="pv-h2">문화</h2>
          </div>

          <div class="pv-article" data-section>
            <c:if test="${not empty p.plant_culture_symbolism}">
              <h3 class="pv-h3">상징</h3>
              <p class="pv-p"><c:out value="${p.plant_culture_symbolism}" /></p>
            </c:if>

            <c:if test="${not empty p.plant_culture_if}">
              <h3 class="pv-h3">흥미로운 사실들</h3>
              <p class="pv-p"><c:out value="${p.plant_culture_if}" /></p>
            </c:if>

            <c:if test="${not empty p.plant_culture_gu}">
              <h3 class="pv-h3">정원 용도</h3>
              <p class="pv-p"><c:out value="${p.plant_culture_gu}" /></p>
            </c:if>

            <c:if test="${not empty p.plant_culture_epv}">
              <h3 class="pv-h3">환경 보호 가치</h3>
              <p class="pv-p"><c:out value="${p.plant_culture_epv}" /></p>
            </c:if>

            <c:if test="${not empty p.plant_culture_ev}">
              <h3 class="pv-h3">경제적 가치</h3>
              <p class="pv-p"><c:out value="${p.plant_culture_ev}" /></p>
            </c:if>

            <c:if test="${not empty p.plant_culture_biv}">
              <h3 class="pv-h3">미용 개선 가치</h3>
              <p class="pv-p"><c:out value="${p.plant_culture_biv}" /></p>
            </c:if>
          </div>
        </section>


        <!-- ===== 추천/연관 식물(있을 때만) : similarPlants(List<PlantVO>) 가정 ===== -->
        <c:if test="${not empty similarPlants}">
          <section class="pv-box" data-section>
            <div class="pv-box__head">
              <h2 class="pv-h2">당신이 좋아할 만한 다른 식물들</h2>
            </div>

            <div class="pv-sim-grid">
              <c:forEach var="sp" items="${similarPlants}">
                <c:if test="${not empty sp}">
                  <a class="pv-sim-card" href="${pageContext.request.contextPath}/plant/view?plant_id=${sp.plant_id}">
                    <div class="pv-sim-thumb">
                      <c:if test="${not empty sp.plant_image}">
                        <img src="<c:out value='${sp.plant_image}'/>" alt="연관 식물" loading="lazy"/>
                      </c:if>
                    </div>
                    <div class="pv-sim-body">
                      <div class="pv-sim-name"><c:out value="${sp.plant_name_kor}" /></div>
                      <c:if test="${not empty sp.plant_name}">
                        <div class="pv-sim-sub"><c:out value="${sp.plant_name}" /></div>
                      </c:if>
                    </div>
                  </a>
                </c:if>
              </c:forEach>
            </div>
          </section>
        </c:if>

      </c:if>

      <!-- plant 자체가 없을 때 -->
      <c:if test="${empty p}">
        <section class="pv-empty">
          <h2>식물 정보를 찾을 수 없습니다.</h2>
          <p>잘못된 접근이거나 데이터가 삭제되었을 수 있습니다.</p>
          <a class="btn btn-primary" href="${pageContext.request.contextPath}/plant/PlantMain">목록으로</a>
        </section>
      </c:if>

    </div>
  </div>
</div>

<script src="${pageContext.request.contextPath}/resources/js/plant/PlantView.js"></script>
<jsp:include page="/WEB-INF/views/layout/footer.jsp" />
