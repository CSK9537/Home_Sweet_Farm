// storeList.js (ES5)
(function () {
  function addClickToCards() {
    var cards = document.getElementsByClassName("js-card");
    for (var i = 0; i < cards.length; i++) {
      (function (el) {
        el.onclick = function () {
          var href = el.getAttribute("data-href");
          if (href) window.location.href = href;
        };
      })(cards[i]);
    }
  }

  function bindSearchEnter() {
    var form = document.getElementById("storeSearchForm");
    var input = document.getElementById("storeKeyword");
    if (!form || !input) return;

    input.onkeydown = function (e) {
      e = e || window.event;
      var key = e.keyCode || e.which;
      if (key === 13) form.submit();
    };
  }

  // (선택) 더보기 버튼: 서버에서 nextPage로 이동(간단 버전)
  function bindMoreButton() {
    var btn = document.getElementById("btnMore");
    if (!btn) return;

    btn.onclick = function () {
      var nextPage = btn.getAttribute("data-nextpage");
      if (!nextPage) return;

      // 현재 쿼리 유지
      var qs = [];
      var keyword = document.getElementById("storeKeyword");
      if (keyword && keyword.value) qs.push("keyword=" + encodeURIComponent(keyword.value));

      // category_id는 히든으로 들어가 있을 수 있음
      var form = document.getElementById("storeSearchForm");
      if (form) {
        var inputs = form.getElementsByTagName("input");
        for (var i = 0; i < inputs.length; i++) {
          if (inputs[i].name === "category_id" && inputs[i].value) {
            qs.push("category_id=" + encodeURIComponent(inputs[i].value));
          }
        }
      }

      qs.push("currentPage=" + encodeURIComponent(nextPage));

      // list 경로는 프로젝트 라우팅에 맞게 수정 가능
      var base = (window.__STORE_LIST_URL__) ? window.__STORE_LIST_URL__ : (location.pathname);
      location.href = base + "?" + qs.join("&");
    };
  }

  function init() {
    addClickToCards();
    bindSearchEnter();
    bindMoreButton();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
