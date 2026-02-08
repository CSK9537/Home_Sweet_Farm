/* ===== PlantMain.js ===== */
document.addEventListener("DOMContentLoaded", function () {
  // contextPath (body data-ctx 또는 window.ctx 또는 "")
  var ctx = "";
  if (document.body && document.body.dataset && document.body.dataset.ctx) {
    ctx = document.body.dataset.ctx;
  } else if (window.ctx) {
    ctx = window.ctx;
  }
  if (ctx && ctx.charAt(ctx.length - 1) === "/") {
    ctx = ctx.substring(0, ctx.length - 1);
  }

  var btns = document.querySelectorAll(".btn-more");
  if (!btns || btns.length === 0) return;

  for (var i = 0; i < btns.length; i++) {
    attachMoreHandler(btns[i], ctx);
  }
});

function attachMoreHandler(btn, ctx) {
  btn.addEventListener("click", function () {
    // 더보기 횟수 제한
    var clicks = parseInt(btn.getAttribute("data-clicks"), 10);
    var maxClicks = parseInt(btn.getAttribute("data-max-clicks"), 10);
    if (isNaN(clicks)) clicks = 0;
    if (isNaN(maxClicks)) maxClicks = 5;

    if (clicks >= maxClicks) {
      btn.style.display = "none";
      return;
    }

    // 중복 클릭 방지
    if (btn.getAttribute("data-loading") === "1") return;
    btn.setAttribute("data-loading", "1");

    var targetSelector = btn.getAttribute("data-target");
    var section = btn.getAttribute("data-section") || "popular";

    var grid = targetSelector ? document.querySelector(targetSelector) : null;
    if (!grid) {
      console.error("target grid not found:", targetSelector);
      btn.setAttribute("data-loading", "0");
      return;
    }

    // offset / limit
    var offset = parseInt(btn.getAttribute("data-offset"), 10);
    var limit = parseInt(btn.getAttribute("data-limit"), 10);
    if (isNaN(offset)) offset = 0;
    if (isNaN(limit)) limit = 4;

    // 버튼 UI
    var originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "불러오는 중...";

    // 요청 URL (백엔드: /plant/more 권장, 현재가 /guide/more면 그쪽으로 바꿔도 됨)
    // 여기서는 PlantMain 기준으로 /plant/more 사용
    var url =
      ctx +
      "/plant/more?section=" +
      encodeURIComponent(section) +
      "&offset=" +
      encodeURIComponent(offset) +
      "&limit=" +
      encodeURIComponent(limit);

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Accept", "application/json");

    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;

      try {
        if (xhr.status < 200 || xhr.status >= 300) throw new Error("HTTP " + xhr.status);

        var data = JSON.parse(xhr.responseText);

        if (!data || Object.prototype.toString.call(data) !== "[object Array]" || data.length === 0) {
          btn.style.display = "none";
          return;
        }

        // 카드 추가
        var frag = document.createDocumentFragment();

        for (var j = 0; j < data.length; j++) {
          var p = data[j] || {};
          var plantId = (p.plant_id !== undefined && p.plant_id !== null) ? String(p.plant_id) : "";
          var nameKor = p.plant_name_kor ? p.plant_name_kor : "";
          var nameEn = p.plant_name ? p.plant_name : "";
          var img = p.plant_image ? p.plant_image : "https://picsum.photos/seed/empty/600/400";

          var card = document.createElement("article");
          card.className = "plant-card";
          if (plantId) card.setAttribute("data-id", plantId);

          var detailUrl = ctx + "/plant/detail?plant_id=" + encodeURIComponent(plantId);

          card.innerHTML =
            '<a class="plant-card__link" href="' + detailUrl + '">' +
              '<div class="plant-card__thumb">' +
                '<img src="' + escapeHtmlAttr(img) + '" alt="' + escapeHtmlAttr(nameKor) + '" loading="lazy" />' +
              "</div>" +
              '<div class="plant-card__body">' +
                '<div class="plant-card__name">' + escapeHtmlText(nameKor) + "</div>" +
                '<div class="plant-card__sub">' + escapeHtmlText(nameEn) + "</div>" +
              "</div>" +
            "</a>";

          frag.appendChild(card);
        }

        grid.appendChild(frag);

        // offset 갱신: 누적 로드 개수로 관리
        btn.setAttribute("data-offset", String(offset + data.length));

        // 클릭 횟수 +1
        btn.setAttribute("data-clicks", String(clicks + 1));

        // 최대치 도달 시 버튼 숨김
        if (clicks + 1 >= maxClicks) btn.style.display = "none";
      } catch (e) {
        console.error(e);
        alert("데이터를 불러오지 못했습니다.");
      } finally {
        btn.disabled = false;
        btn.textContent = originalText;
        btn.setAttribute("data-loading", "0");
      }
    };

    xhr.onerror = function () {
      btn.disabled = false;
      btn.textContent = originalText;
      btn.setAttribute("data-loading", "0");
      alert("네트워크 오류가 발생했습니다.");
    };

    xhr.send();
  });
}

function escapeHtmlText(str) {
  var s = String(str == null ? "" : str);
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeHtmlAttr(str) {
  return escapeHtmlText(str);
}
