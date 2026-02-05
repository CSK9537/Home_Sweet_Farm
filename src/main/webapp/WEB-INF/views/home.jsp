<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="java.util.*" %>

<%
    // view 파라미터: empty | list (기본 empty)
    String view = request.getParameter("view");
    if (view == null || view.isBlank()) view = "empty";

    // 모달 자동 오픈: ?modal=open
    String modal = request.getParameter("modal");
    boolean openModal = "open".equalsIgnoreCase(modal);

    // MyPlantMain.jsp가 사용하는 request attribute: myPlants
    List<Map<String, Object>> myPlants = new ArrayList<>();

    if ("list".equals(view)) {
        Map<String, Object> p1 = new HashMap<>();
        p1.put("id", 101);
        p1.put("koreanName", "몬스테라");
        p1.put("latinName", "Monstera deliciosa");
        p1.put("nickname", "초록이");
        p1.put("imageUrl", "");
        p1.put("lux", 350);
        p1.put("humidity", 58);
        p1.put("temperature", 24);
        p1.put("battery", 3.8);
        p1.put("daysSince", 12);

        Map<String, Object> p2 = new HashMap<>();
        p2.put("id", 102);
        p2.put("koreanName", "스투키");
        p2.put("latinName", "Sansevieria stuckyi");
        p2.put("nickname", "튼튼이");
        p2.put("imageUrl", "https://picsum.photos/300/300");
        p2.put("lux", 120);
        p2.put("humidity", 42);
        p2.put("temperature", 21);
        p2.put("battery", 3.5);
        p2.put("daysSince", 48);

        myPlants.add(p1);
        myPlants.add(p2);
    }

    // ✅ 모달 추천식물 Top5 테스트용 (MyPlantMain.jsp에서 ${recommendedPlants} 사용 전제)
    List<Map<String, Object>> recommendedPlants = new ArrayList<>();
    {
        String[][] rows = {
            {"1","몬스테라","Monstera deliciosa",""},
            {"2","스투키","Sansevieria stuckyi",""},
            {"3","스킨답서스","Epipremnum aureum",""},
            {"4","필로덴드론","Philodendron",""},
            {"5","테이블야자","Chamaedorea elegans",""}
        };

        for (String[] r : rows) {
            Map<String, Object> m = new HashMap<>();
            m.put("plantId", Integer.parseInt(r[0]));
            m.put("koreanName", r[1]);
            m.put("latinName", r[2]);
            m.put("imageUrl", r[3]);
            recommendedPlants.add(m);
        }
    }

    request.setAttribute("myPlants", myPlants);
    request.setAttribute("recommendedPlants", recommendedPlants);
%>

<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>MyPlantMain 뷰 테스트</title>

  <style>
    .testbar{
      position: sticky;
      top: 0;
      z-index: 9999;
      background: #fff;
      border-bottom: 1px solid rgba(0,0,0,.08);
      padding: 10px 14px;
      display:flex;
      gap:10px;
      align-items:center;
    }
    .testbar__title{ font-weight:700; }
    .testbar__btn{
      display:inline-flex; align-items:center; justify-content:center;
      padding:8px 12px; border-radius:10px;
      border:1px solid rgba(0,0,0,.18);
      background:#fff; cursor:pointer; text-decoration:none;
    }
    .testbar__btn--on{ border-color:#6b7b61; color:#6b7b61; font-weight:700; }
  </style>
</head>
<body>

  <div class="testbar">
    <span class="testbar__title">뷰 테스트</span>

    <a class="testbar__btn <%= "empty".equals(view) ? "testbar__btn--on" : "" %>"
       href="<%= request.getContextPath() %>/?view=empty">
      식물 없음(Empty)
    </a>

    <a class="testbar__btn <%= "list".equals(view) ? "testbar__btn--on" : "" %>"
       href="<%= request.getContextPath() %>/?view=list">
      식물 있음(List)
    </a>

    <button class="testbar__btn" type="button" id="testOpenModalBtn">모달 열기</button>

    <a class="testbar__btn"
       href="<%= request.getContextPath() %>/?view=<%= view %>&modal=open">
      모달 자동오픈
    </a>

    <span style="margin-left:auto; opacity:.65;">현재: <%= view %></span>
  </div>

  <!-- ✅ 중요: include는 self-closing 금지(= param 못 넣음). 반드시 body 형태로! -->
  <jsp:include page="/WEB-INF/views/MyPlant/MyPlantMain.jsp">
    <jsp:param name="testMode" value="1"/>
  </jsp:include>

  <!-- 모달 “열기만” 테스트용 최소 스크립트 (실제 모달 동작 JS는 별도 파일로 분리 가능) -->
  <script>
    (function(){
      const modal = document.getElementById('addPlantModal');
      const btn = document.getElementById('testOpenModalBtn');

      function open(){
        if(!modal) return;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
      }

      btn && btn.addEventListener('click', open);

      const shouldOpen = <%= openModal ? "true" : "false" %>;
      if(shouldOpen) open();
    })();
  </script>

</body>
</html>
