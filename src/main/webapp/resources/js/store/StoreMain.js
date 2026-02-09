// storeMain.js (ES5)
(function () {
  function addClickToCards() {
    var cards = document.getElementsByClassName("js-card");
    for (var i = 0; i < cards.length; i++) {
      (function (el) {
        el.onclick = function () {
          var href = el.getAttribute("data-href");
          if (href) {
            window.location.href = href;
          }
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
      if (key === 13) {
        // 엔터 시 submit
        form.submit();
      }
    };
  }

  // (선택) Hot 추천 가로 스크롤을 마우스 휠로도 부드럽게
  function bindHotWheelScroll() {
    var hotRow = document.getElementById("hotRow");
    if (!hotRow) return;

    hotRow.onwheel = function (e) {
      e = e || window.event;
      if (e.deltaY) {
        hotRow.scrollLeft += e.deltaY;
        if (e.preventDefault) e.preventDefault();
        return false;
      }
    };
  }

  function init() {
    addClickToCards();
    bindSearchEnter();
    bindHotWheelScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
