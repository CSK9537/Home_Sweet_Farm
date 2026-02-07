(function () {
  var modal = document.getElementById("statsModal");
  if (!modal) return;

  /* ===== 요소들 ===== */
  var openBtns = document.querySelectorAll("[data-open-stats-modal]"); // ✅ 여러 개 지원
  var closeBtns = modal.querySelectorAll("[data-close-stats-modal]");
  var backdrop = modal.querySelector(".stats-modal__backdrop"); // ✅ 모달 밖 클릭 닫기
  var panel = modal.querySelector(".stats-modal__panel");
  var tabs = modal.querySelectorAll(".stats-tab");

  /* ===== chart instances (Map 대신 plain object) ===== */
  var charts = {}; // metricKey -> Chart
  var METRICS = [
    { key: "illumination", label: "조도", canvasId: "chart-illumination", detailBodySel: '[data-detail-body="illumination"]' },
    { key: "temperature",  label: "온도", canvasId: "chart-temperature",  detailBodySel: '[data-detail-body="temperature"]' },
    { key: "humidity",     label: "습도", canvasId: "chart-humidity",     detailBodySel: '[data-detail-body="humidity"]' },
    { key: "soil_moisture",label: "토양 수분", canvasId: "chart-soil",    detailBodySel: '[data-detail-body="soil_moisture"]' }
  ];

  var plantId = null;
  var currentRange = "HOURLY";

  function openModal() {
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    // (선택) 상세 영역 열려있던 버튼 문구를 원상복구하고 싶으면 여기서 처리 가능
    // 예: 모든 detail hidden + 버튼 텍스트 "상세 정보 보기"
  }

  function pad2(n) { return String(n).padStart(2, "0"); }

  function setActiveTab(range) {
    for (var i = 0; i < tabs.length; i++) {
      var t = tabs[i];
      var on = (t.getAttribute("data-range") === range);
      if (on) {
        t.classList.add("is-active");
        t.setAttribute("aria-selected", "true");
      } else {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      }
    }
  }

  function fmtTime(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    return (
      d.getFullYear() + "-" +
      pad2(d.getMonth() + 1) + "-" +
      pad2(d.getDate()) + " " +
      pad2(d.getHours()) + ":" +
      pad2(d.getMinutes())
    );
  }

  function buildLabels(points) {
    var out = [];
    for (var i = 0; i < points.length; i++) {
      var d = new Date(points[i].t);
      if (currentRange === "HOURLY") out.push(pad2(d.getHours()) + ":00");
      else if (currentRange === "DAILY") out.push((d.getMonth() + 1) + "/" + d.getDate());
      else out.push(d.getFullYear() + "-" + pad2(d.getMonth() + 1));
    }
    return out;
  }

  function buildData(points) {
    var out = [];
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      out.push((p && p.v !== undefined && p.v !== null) ? p.v : null);
    }
    return out;
  }

  function ensureChart(metricKey, canvas) {
    if (charts[metricKey]) return charts[metricKey];

    var ctx = canvas.getContext("2d");
    var c = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [{
          label: metricKey,
          data: [],
          tension: 0.35,
          pointRadius: 0,
          borderWidth: 2,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        },
        scales: {
          x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } },
          y: { grid: { color: "rgba(0,0,0,.08)" }, ticks: { maxTicksLimit: 5 } }
        }
      }
    });

    charts[metricKey] = c;
    return c;
  }

  function findMetric(metricKey) {
    for (var i = 0; i < METRICS.length; i++) {
      if (METRICS[i].key === metricKey) return METRICS[i];
    }
    return null;
  }

  function renderDetail(metricKey, points) {
    var metric = findMetric(metricKey);
    if (!metric) return;

    var body = modal.querySelector(metric.detailBodySel);
    if (!body) return;

    body.innerHTML = "";
    for (var i = 0; i < points.length; i++) {
      var p = points[i];

      var row = document.createElement("div");
      row.className = "row";

      var left = document.createElement("span");
      left.textContent = fmtTime(p.t);

      var right = document.createElement("span");
      right.textContent = (p && p.v !== undefined && p.v !== null) ? String(p.v) : "";

      row.appendChild(left);
      row.appendChild(right);
      body.appendChild(row);
    }
  }

  function loadStats(range) {
    if (!plantId) return;

    var base = (window.__ctx || "");
    var url = base
      + "/my-plants/statistics?plantId=" + encodeURIComponent(plantId)
      + "&range=" + encodeURIComponent(range);

    fetch(url, { headers: { "Accept": "application/json" } })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        applyData(data);
      })
      .catch(function (e) {
        console.error("[stats] fetch failed:", e);
        applyData({ series: { illumination: [], temperature: [], humidity: [], soil_moisture: [] } });
      });
  }

  function applyData(data) {
    for (var i = 0; i < METRICS.length; i++) {
      var m = METRICS[i];
      var points = (data && data.series && data.series[m.key]) ? data.series[m.key] : [];

      var canvas = document.getElementById(m.canvasId);
      if (!canvas) continue;

      var chart = ensureChart(m.key, canvas);
      chart.data.labels = buildLabels(points);
      chart.data.datasets[0].data = buildData(points);
      chart.update();

      renderDetail(m.key, points);
    }
  }

  /* =======================
   * ✅ 이벤트 바인딩
   * ======================= */

  /* open: 여러 버튼 지원 */
  for (var i = 0; i < openBtns.length; i++) {
    (function (btn) {
      btn.addEventListener("click", function () {
        plantId = btn.getAttribute("data-plant-id");

        currentRange = "HOURLY";
        setActiveTab(currentRange);

        openModal();
        loadStats(currentRange);
      });
    })(openBtns[i]);
  }

  /* close: data-close-stats-modal (닫기/확인 버튼 등) */
  for (var j = 0; j < closeBtns.length; j++) {
    closeBtns[j].addEventListener("click", function (e) {
      if (e && e.preventDefault) e.preventDefault();
      closeModal();
    });
  }

  /* ✅ backdrop 클릭(모달 밖 클릭) */
  if (backdrop) {
    backdrop.addEventListener("click", function () {
      closeModal();
    });
  } else {
    // 혹시 backdrop 클래스가 다르면, modal 자체에서 aria-hidden false 상태 + panel 바깥 클릭을 감지
    modal.addEventListener("click", function (e) {
      if (modal.getAttribute("aria-hidden") !== "false") return;
      if (panel && panel.contains(e.target)) return; // 패널 내부 클릭은 무시
      closeModal();
    });
  }

  /* ✅ 패널 내부 클릭은 backdrop으로 전파되지 않게 */
  if (panel) {
    panel.addEventListener("click", function (e) {
      if (e && e.stopPropagation) e.stopPropagation();
    });
  }

  /* ESC close */
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
      closeModal();
    }
  });

  /* tab change */
  for (var t = 0; t < tabs.length; t++) {
    (function (tab) {
      tab.addEventListener("click", function () {
        currentRange = tab.getAttribute("data-range");
        setActiveTab(currentRange);
        loadStats(currentRange);
      });
    })(tabs[t]);
  }

  /* detail toggle */
  modal.addEventListener("click", function (e) {
    var target = e.target;

    // data-toggle-detail 찾기(ES5)
    while (target && target !== modal) {
      if (target.getAttribute && target.getAttribute("data-toggle-detail")) break;
      target = target.parentNode;
    }
    if (!target || target === modal) return;

    var metric = target.getAttribute("data-toggle-detail");
    var detail = document.getElementById("detail-" + metric);
    if (!detail) return;

    var willOpen = detail.hasAttribute("hidden");
    if (willOpen) {
      detail.removeAttribute("hidden");
      target.textContent = "상세 정보 닫기";
    } else {
      detail.setAttribute("hidden", "");
      target.textContent = "상세 정보 보기";
    }
  });

})();
