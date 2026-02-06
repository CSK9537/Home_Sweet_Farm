document.addEventListener("DOMContentLoaded", function () {
  // contextPath 가져오기
  var ctx = "";
  if (document.body && document.body.dataset && document.body.dataset.ctx) {
    ctx = document.body.dataset.ctx;
  } else if (window.ctx) {
    ctx = window.ctx;
  }

  // 끝 슬래시 제거
  if (ctx && ctx.charAt(ctx.length - 1) === "/") {
    ctx = ctx.substring(0, ctx.length - 1);
  }

  var moreButtons = document.querySelectorAll(".btn-more");
  if (!moreButtons || moreButtons.length === 0) return;

  for (var i = 0; i < moreButtons.length; i++) {
    (function (btn) {
      btn.addEventListener("click", function () {
        // 중복 클릭 방지
        if (btn.getAttribute("data-loading") === "1") return;
        btn.setAttribute("data-loading", "1");

        var targetSelector = btn.getAttribute("data-target");
        var section = btn.getAttribute("data-section") || "";

        var grid = targetSelector ? document.querySelector(targetSelector) : null;
        if (!grid) {
          console.error("target grid not found:", targetSelector);
          btn.setAttribute("data-loading", "0");
          return;
        }

        // offset 파싱(안전)
        var offsetRaw = btn.getAttribute("data-offset");
        var offset = parseInt(offsetRaw, 10);
        if (isNaN(offset)) offset = 0;

        // 버튼 UI
        var originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = "불러오는 중...";

        // 요청 URL
        var url =
          ctx +
          "/guide/more?section=" +
          encodeURIComponent(section) +
          "&offset=" +
          encodeURIComponent(offset);

        // XHR 요청
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Accept", "application/json");

        xhr.onreadystatechange = function () {
          if (xhr.readyState !== 4) return;

          try {
            if (xhr.status < 200 || xhr.status >= 300) {
              throw new Error("HTTP " + xhr.status);
            }

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
              var nameKr = p.plant_name_kr ? p.plant_name_kr : "";
              var nameEn = p.plant_name_en ? p.plant_name_en : "";
              var imgUrl = p.plant_img_url ? p.plant_img_url : "https://picsum.photos/seed/empty/600/400";

              var card = document.createElement("article");
              card.className = "plant-card";
              if (plantId) card.setAttribute("data-id", plantId);

              var detailUrl = ctx + "/guide/detail?plant_id=" + encodeURIComponent(plantId);

              card.innerHTML =
                '<a class="plant-card__link" href="' + detailUrl + '">' +
                  '<div class="plant-card__thumb">' +
                    '<img src="' + escapeHtmlAttr(imgUrl) + '" alt="' + escapeHtmlAttr(nameKr) + '" loading="lazy" />' +
                  '</div>' +
                  '<div class="plant-card__body">' +
                    '<div class="plant-card__name">' + escapeHtmlText(nameKr) + "</div>" +
                    '<div class="plant-card__sub">' + escapeHtmlText(nameEn) + "</div>" +
                  "</div>" +
                "</a>";

              frag.appendChild(card);
            }

            grid.appendChild(frag);

            // offset 갱신
            btn.setAttribute("data-offset", String(offset + data.length));
          } catch (e) {
            console.error(e);
            alert("데이터를 불러오지 못했습니다.");
          } finally {
            // 버튼 복구
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
    })(moreButtons[i]);
  }
});

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
