(function () {
  var modal = document.getElementById("statsModal");
  if (!modal) return;

  var openBtns = document.querySelectorAll("[data-open-stats-modal]");
  var closeBtn = modal.querySelector(".stats-modal__close");
  var backdrop = modal.querySelector(".stats-modal__backdrop");
  var tabs = modal.querySelectorAll(".stats-tab");

  var charts = {}; 
  var METRICS = [
    { key: "illumination", label: "조도", canvasId: "chart-illumination", detailBodySel: '[data-detail-body="illumination"]', suffix: "%" },
    { key: "temperature",  label: "온도", canvasId: "chart-temperature",  detailBodySel: '[data-detail-body="temperature"]', suffix: "℃" },
    { key: "humidity",     label: "습도", canvasId: "chart-humidity",     detailBodySel: '[data-detail-body="humidity"]', suffix: "%" },
    { key: "soil_moisture",label: "토양 수분", canvasId: "chart-soil",    detailBodySel: '[data-detail-body="soil_moisture"]', suffix: "%" }
  ];

  var myplant_id = null;
  var currentRange = "HOURLY";

  function openModal() {
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    modal.setAttribute("aria-hidden", "true");
  }

  function pad2(n) { 
    return String(n).padStart(2, "0"); 
  }

  function setActiveTab(range) {
    for (var i = 0; i < tabs.length; i++) {
      var t = tabs[i];
      if (t.getAttribute("data-range") === range) {
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

  /* 백엔드에서 넘어온 데이터를 바탕으로 X축 라벨 생성 */
  function buildLabels(points) {
    var out = [];
    for (var i = 0; i < points.length; i++) {
      var d = new Date(points[i].t);
      if (currentRange === "HOURLY") {
        out.push(pad2(d.getHours()) + ":00"); 
      } else if (currentRange === "DAILY") {
        out.push((d.getMonth() + 1) + "/" + pad2(d.getDate()));
      } else {
        out.push(d.getFullYear() + "-" + pad2(d.getMonth() + 1));
      }
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
  
  function findMetric(metricKey) {
    for (var i = 0; i < METRICS.length; i++) {
      if (METRICS[i].key === metricKey) return METRICS[i];
    }
    return null;
  }

  function ensureChart(metricKey, canvas) {
    if (charts[metricKey]) return charts[metricKey];

    var metric = findMetric(metricKey);
    var suffix = metric ? (metric.suffix || "") : "";
    
    var ctx = canvas.getContext("2d");
    var c = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [{
          label: metric ? metric.label : metricKey,
          data: [],
          tension: 0.35,
          pointRadius: 0,
          borderWidth: 2,
          fill: false,
          spanGaps: true // 데이터가 비어있어도 끊기지 않고 연결
        }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { 
            legend: { display: false }, 
            tooltip: { 
              enabled: true,
              // 마우스를 올렸을 때 나오는 툴팁 단위
              callbacks: {
                label: function(context) {
                  var val = context.parsed.y;
                  if (val === null) return "데이터 없음";
                  return context.dataset.label + ": " + val + suffix;
                }
              }
            } 
          },
          scales: {
            x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } },
            y: { 
              grid: { color: "rgba(0,0,0,.08)" }, 
              ticks: { 
                maxTicksLimit: 5,
                // Y축 숫자에 단위를 붙여주는 콜백 함수
                callback: function(value) {
                  return value + suffix;
                }
              } 
            }
          }
        }
      });

    charts[metricKey] = c;
    return c;
  }

  function renderDetail(metricKey, points) {
	var metric = findMetric(metricKey);
    if (!metric) return;
    
    var suffix = metric.suffix || "";

    var body = modal.querySelector(metric.detailBodySel);
    if (!body) return;

    body.innerHTML = "";
    
    // 테이블 내역 최신순 렌더링 (가장 최근 데이터가 맨 위로)
    for (var i = points.length - 1; i >= 0; i--) { 
      var p = points[i];
      var row = document.createElement("div");
      row.className = "row"; // CSS에서 .row { display: flex; justify-content: space-between; } 등으로 제어
      
      var left = document.createElement("span");
      left.textContent = fmtTime(p.t); 

      var right = document.createElement("span");
      right.textContent = (p && p.v !== undefined && p.v !== null) ? String(p.v) + suffix : "-";

      row.appendChild(left);
      row.appendChild(right);
      body.appendChild(row);
    }
  }

  /* 서버에서 데이터 패치 */
  function loadStats(range) {
    if (!myplant_id) return;

    var base = (window.__ctx || "");
    var url = base
      + "/myplant/statistics?myplant_id=" + encodeURIComponent(myplant_id)
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
        // 에러 시 빈 차트 적용
        applyData({ series: { illumination: [], temperature: [], humidity: [], soil_moisture: [] } });
      });
  }

  /* 서버에서 온 데이터를 차트와 테이블에 적용 */
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
   * 이벤트 바인딩
   * ======================= */
  
  // 모달 열기
  for (var i = 0; i < openBtns.length; i++) {
    openBtns[i].addEventListener("click", function () {
      myplant_id = this.getAttribute("data-plant-id");
      currentRange = "HOURLY";
      setActiveTab(currentRange);
      openModal();
      loadStats(currentRange);
    });
  }

  // 닫기 버튼들
  closeBtn.addEventListener("click", function (e) {
    if (e && e.preventDefault) e.preventDefault();
    closeModal();
  });

  // 모달 배경 클릭 닫기
  if (backdrop) {
    backdrop.addEventListener("click", closeModal);
  }

  // ESC 키 닫기
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
      closeModal();
    }
  });

  // 탭 변경
  for (var t = 0; t < tabs.length; t++) {
    tabs[t].addEventListener("click", function () {
      currentRange = this.getAttribute("data-range");
      setActiveTab(currentRange);
      loadStats(currentRange);
    });
  }

  // 상세 정보 토글
  modal.addEventListener("click", function (e) {
    var target = e.target;
    while (target && target !== modal) {
      if (target.getAttribute && target.getAttribute("data-toggle-detail")) break;
      target = target.parentNode;
    }
    if (!target || target === modal) return;

    var metric = target.getAttribute("data-toggle-detail");
    var detail = document.getElementById("detail-" + metric);
    if (!detail) return;

    if (detail.hasAttribute("hidden")) {
      detail.removeAttribute("hidden");
      target.textContent = "상세 정보 닫기";
    } else {
      detail.setAttribute("hidden", "");
      target.textContent = "상세 정보 보기";
    }
  });

})();