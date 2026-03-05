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

  // [최적화] ES5 호환 및 속도가 더 빠른 네이티브 slice 문자열 처리
  function pad2(n) { 
    return ("0" + n).slice(-2); 
  }

  function setActiveTab(range) {
    for (var i = 0, len = tabs.length; i < len; i++) {
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

  // [최적화] 데이터 순회 병합: 라벨 추출과 데이터 추출을 한 번의 루프에서 해결 (O(2N) -> O(N))
  function updateChartData(chart, points, range) {
    var labels = [];
    var data = [];

    for (var i = 0, len = points.length; i < len; i++) {
      var p = points[i];
      var d = new Date(p.t);

      // 1. 라벨 생성 로직
      if (range === "HOURLY") {
        labels.push(pad2(d.getHours()) + ":00"); 
      } else if (range === "DAILY") {
        labels.push((d.getMonth() + 1) + "/" + pad2(d.getDate()));
      } else {
        labels.push(d.getFullYear() + "-" + pad2(d.getMonth() + 1));
      }

      // 2. 데이터 추출 로직
      data.push((p && p.v !== undefined && p.v !== null) ? p.v : null);
    }

    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
  }

  // [최적화] findMetric 함수 제거 -> 순회 시 metric 객체 자체를 파라미터로 넘겨 탐색 비용 소거
  function ensureChart(metric, canvas) {
    if (charts[metric.key]) return charts[metric.key];

    var suffix = metric.suffix || "";
    
    var ctx = canvas.getContext("2d");
    var c = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [{
          label: metric.label,
          data: [],
          tension: 0.35,
          pointRadius: 0,
          borderWidth: 2,
          fill: false,
          spanGaps: true
        }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { 
            legend: { display: false }, 
            tooltip: { 
              enabled: true,
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
                callback: function(value) {
                  return value + suffix;
                }
              } 
            }
          }
        }
      });

    charts[metric.key] = c;
    return c;
  }

  function renderDetail(metric, points) {
    var body = modal.querySelector(metric.detailBodySel);
    if (!body) return;

    body.innerHTML = "";
    
    var suffix = metric.suffix || "";
    // [최적화] DocumentFragment를 사용해 DOM 리플로우를 단 1회로 최소화
    var docFrag = document.createDocumentFragment();
    
    for (var i = points.length - 1; i >= 0; i--) { 
      var p = points[i];
      var row = document.createElement("div");
      row.className = "row";
      
      var left = document.createElement("span");
      left.textContent = fmtTime(p.t); 

      var right = document.createElement("span");
      right.textContent = (p && p.v !== undefined && p.v !== null) ? String(p.v) + suffix : "-";

      row.appendChild(left);
      row.appendChild(right);
      docFrag.appendChild(row);
    }
    
    // 조립된 내용을 단 한 번 실제 DOM에 부착
    body.appendChild(docFrag);
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
        applyData({ series: { illumination: [], temperature: [], humidity: [], soil_moisture: [] } });
      });
  }

  /* 서버에서 온 데이터를 차트와 테이블에 적용 */
  function applyData(data) {
    for (var i = 0, len = METRICS.length; i < len; i++) {
      var m = METRICS[i];
      var points = (data && data.series && data.series[m.key]) ? data.series[m.key] : [];

      var canvas = document.getElementById(m.canvasId);
      if (!canvas) continue;

      // [최적화] 객체 자체를 전달하고, 라벨과 데이터를 한 번에 업데이트
      var chart = ensureChart(m, canvas);
      updateChartData(chart, points, currentRange);
      chart.update();

      renderDetail(m, points);
    }
  }

  /* =======================
   * 이벤트 바인딩
   * ======================= */
  
  // [최적화] 이벤트 핸들러를 외부 함수로 분리하여 다중 생성 방지
  function handleOpenBtnClick() {
    myplant_id = this.getAttribute("data-plant-id");
    currentRange = "HOURLY";
    setActiveTab(currentRange);
    openModal();
    loadStats(currentRange);
  }

  function handleTabClick() {
    currentRange = this.getAttribute("data-range");
    setActiveTab(currentRange);
    loadStats(currentRange);
  }

  for (var i = 0, openLen = openBtns.length; i < openLen; i++) {
    openBtns[i].addEventListener("click", handleOpenBtnClick);
  }

  for (var t = 0, tabLen = tabs.length; t < tabLen; t++) {
    tabs[t].addEventListener("click", handleTabClick);
  }

  closeBtn.addEventListener("click", function (e) {
    if (e && e.preventDefault) e.preventDefault();
    closeModal();
  });

  if (backdrop) {
    backdrop.addEventListener("click", closeModal);
  }

  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
      closeModal();
    }
  });

  // 상세 정보 토글 (이벤트 위임 유지)
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