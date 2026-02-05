/* schedule-modal.js (완성본 / ES5 호환)
 * 요구사항 반영:
 * - 날짜칸 일정: 이모지 요약(+N)
 * - 하단 footer 버튼 제거(취소/저장은 MEMO 옆)
 * - 취소: 모달 오픈 시점(snapshot)으로 원복 후 닫기
 * - 저장: (TODO 서버 저장) 성공 시 snapshot 갱신 후 닫기
 * - 닫기(X), ESC: 취소와 동일 동작(저장 안 하면 DB 반영 X)
 */

var MONTH_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];

var TYPE_EMOJI = {
  water: "💧",
  nutri: "🧪",
  repot: "🪴"
};

var MAX_CELL_MARKS = 4;

var calState = {
  plantId: null,
  viewDate: new Date(),
  selected: null,
  events: [],     // {id, plantId, date(yyyy-mm-dd), type, title}
  snapshot: []    // 현재 plant의 오픈 시점 스냅샷(취소 기준)
};

var dragPayload = null;

function pad2(n){ return String(n).padStart(2,"0"); }
function toYMD(d){ return d.getFullYear() + "-" + pad2(d.getMonth()+1) + "-" + pad2(d.getDate()); }
function deepCopy(obj){ return JSON.parse(JSON.stringify(obj)); }

function uid(){
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return String(Date.now()) + Math.random();
}

/* ===== open/close ===== */
function openScheduleModal(plantId){
  calState.plantId = plantId;

  var modal = document.getElementById("calModal");
  modal.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";

  initMemoPalette();

  // ✅ 취소 기준 스냅샷 저장(해당 plant만)
  var plantEvents = calState.events.filter(function(e){ return e.plantId === calState.plantId; });
  calState.snapshot = deepCopy(plantEvents);

  // 선택 날짜가 없으면 오늘로(원치 않으면 제거 가능)
  if(!calState.selected){
    calState.selected = toYMD(new Date());
  }
  var memoDateEl = document.getElementById("memoDate");
  if(memoDateEl){
    memoDateEl.textContent = calState.selected ? calState.selected : "날짜를 선택하세요";
  }

  renderCalendar();
  renderScheduleList();
}

function closeScheduleModal(){
  var modal = document.getElementById("calModal");
  modal.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
  dragPayload = null;
  clearDropHighlight();
}

/* ===== top nav ===== */
function calPrev(){
  calState.viewDate = new Date(calState.viewDate.getFullYear(), calState.viewDate.getMonth()-1, 1);
  renderCalendar();
}
function calNext(){
  calState.viewDate = new Date(calState.viewDate.getFullYear(), calState.viewDate.getMonth()+1, 1);
  renderCalendar();
}
function calToday(){
	  var today = new Date();

	  // 1️⃣ 월 이동
	  calState.viewDate = new Date(today.getFullYear(), today.getMonth(), 1);

	  // 2️⃣ 오늘 날짜 선택
	  var todayYmd = toYMD(today);
	  calState.selected = todayYmd;

	  // 3️⃣ 오른쪽 MEMO 날짜 표시 변경
	  var memoDateEl = document.getElementById("memoDate");
	  if(memoDateEl){
	    memoDateEl.textContent = todayYmd;
	  }

	  // 4️⃣ 다시 렌더링
	  renderCalendar();
	  renderScheduleList();
	}


/* ===== cancel/save ===== */

// 내부 원복(스냅샷 기준) - 기존 calReset을 “내부용”으로 의미 명확화
function restoreFromSnapshot(){
  // 다른 plant 이벤트는 유지, 현재 plant 이벤트만 snapshot으로 되돌림
  calState.events = calState.events
    .filter(function(e){ return e.plantId !== calState.plantId; })
    .concat(deepCopy(calState.snapshot));

  renderCalendar();
  renderScheduleList();
}

// ✅ 취소 버튼: 원복 후 닫기
function calCancel(){
  restoreFromSnapshot();
  closeScheduleModal();
}

// ✅ 저장 버튼: (TODO 서버 저장) 성공 시 snapshot 갱신 후 닫기
function calSave(){
  // 1) 저장할 데이터(현재 plant)
  var plantEvents = calState.events.filter(function(e){ return e.plantId === calState.plantId; });

  // 2) TODO: 서버 저장(fetch/AJAX)
  // 성공했다고 가정하고 snapshot 갱신
  calState.snapshot = deepCopy(plantEvents);

  closeScheduleModal();
}

/* ===== memo palette ===== */
function initMemoPalette(){
  var palette = document.getElementById("memoPalette");
  if(!palette || palette.dataset.inited === "1") return;
  palette.dataset.inited = "1";

  var btns = palette.querySelectorAll(".memo-item");
  Array.prototype.forEach.call(btns, function(btn){
    // click => add to selected date
    btn.addEventListener("click", function(){
      if(!calState.selected){
        alert("먼저 캘린더에서 날짜를 선택하세요.");
        return;
      }
      addQuickSchedule(calState.selected, btn.dataset.type, btn.dataset.title);
    });

    // drag start
    btn.addEventListener("dragstart", function(e){
      dragPayload = { type: btn.dataset.type, title: btn.dataset.title };
      e.dataTransfer.effectAllowed = "copy";
      e.dataTransfer.setData("text/plain", JSON.stringify(dragPayload));
    });

    btn.addEventListener("dragend", function(){
      dragPayload = null;
      clearDropHighlight();
    });
  });
}

/* ===== add/delete event ===== */
function addQuickSchedule(dateYmd, type, title){
  calState.events.push({
    id: uid(),
    plantId: calState.plantId,
    date: dateYmd,
    type: type,
    title: title
  });

  calState.selected = dateYmd;

  var memoDateEl = document.getElementById("memoDate");
  if(memoDateEl) memoDateEl.textContent = dateYmd;

  renderCalendar();
  renderScheduleList();
}

function deleteEvent(id){
  calState.events = calState.events.filter(function(e){ return e.id !== id; });
  renderCalendar();
  renderScheduleList();
}

/* ===== calendar ===== */
function clearDropHighlight(){
  var els = document.querySelectorAll(".cal-cell--droppable");
  Array.prototype.forEach.call(els, function(el){
    el.classList.remove("cal-cell--droppable");
  });
}

function renderCalendar(){
	var y = calState.viewDate.getFullYear();
	var m = calState.viewDate.getMonth();
	
	var mk = document.getElementById("calMonthKr");
	var me = document.getElementById("calMonthEn");
	
	if(mk) mk.textContent = y + "년 " + (m+1) + "월";

  var grid = document.getElementById("calGrid");
  if(!grid) return;
  grid.innerHTML = "";

  var first = new Date(y, m, 1);
  var startDow = first.getDay();
  var start = new Date(y, m, 1 - startDow);
  var total = 42;

  for(var i=0;i<total;i++){
    (function(i){
      var d = new Date(start);
      d.setDate(start.getDate()+i);

      var ymd = toYMD(d);
      var dow = d.getDay();

      var cell = document.createElement("div");
      cell.className = "cal-cell";
      if(d.getMonth() !== m) cell.classList.add("cal-cell--muted");
      if(dow===0) cell.classList.add("cal-cell--sun");
      if(dow===6) cell.classList.add("cal-cell--sat");
      if(calState.selected === ymd) cell.classList.add("cal-cell--selected");

      // day label
      var day = document.createElement("div");
      day.className = "cal-cell__day";
      day.textContent = d.getDate();
      cell.appendChild(day);

      // events of the day
      var todays = calState.events.filter(function(e){
        return e.plantId === calState.plantId && e.date === ymd;
      });

      // ✅ 이모지 요약(+N)
      if(todays.length > 0){
        var marks = document.createElement("div");
        marks.className = "cal-marks";

        var shown = todays.slice(0, MAX_CELL_MARKS);
        shown.forEach(function(ev){
          var s = document.createElement("span");
          s.className = "cal-mark";
          s.textContent = TYPE_EMOJI[ev.type] || "🗓️";
          s.title = ev.title;
          marks.appendChild(s);
        });

        if(todays.length > MAX_CELL_MARKS){
          var more = document.createElement("span");
          more.className = "cal-mark cal-mark--more";
          more.textContent = "+" + (todays.length - MAX_CELL_MARKS);
          marks.appendChild(more);
        }

        cell.appendChild(marks);
      }

      // click select
      cell.addEventListener("click", function(){
        calState.selected = ymd;
        var memoDateEl = document.getElementById("memoDate");
        if(memoDateEl) memoDateEl.textContent = ymd;

        renderCalendar();
        renderScheduleList();
      });

      // drag over / drop => add schedule to that day
      cell.addEventListener("dragover", function(e){
        e.preventDefault();
        cell.classList.add("cal-cell--droppable");
      });
      cell.addEventListener("dragleave", function(){
        cell.classList.remove("cal-cell--droppable");
      });
      cell.addEventListener("drop", function(e){
        e.preventDefault();
        cell.classList.remove("cal-cell--droppable");

        var payload = dragPayload;
        if(!payload){
          try{ payload = JSON.parse(e.dataTransfer.getData("text/plain")); }catch(_){}
        }
        if(!payload || !payload.type || !payload.title) return;

        addQuickSchedule(ymd, payload.type, payload.title);
        clearDropHighlight();
      });

      grid.appendChild(cell);
    })(i);
  }
}

/* ===== right list ===== */
function renderScheduleList(){
  var ul = document.getElementById("scheduleList");
  if(!ul) return;

  ul.innerHTML = "";

  if(!calState.selected){
    ul.innerHTML = '<li><div><div class="cal-list__title">일정 없음</div></div></li>';
    return;
  }

  var list = calState.events.filter(function(e){
    return e.plantId === calState.plantId && e.date === calState.selected;
  });

  if(list.length === 0){
    ul.innerHTML = '<li><div><div class="cal-list__title">일정 없음</div></div></li>';
    return;
  }

  list.forEach(function(ev){
    var li = document.createElement("li");
    var emoji = TYPE_EMOJI[ev.type] || "🗓️";

    li.innerHTML =
      '<div><div class="cal-list__title">' + emoji + ' [' + ev.type + '] ' + ev.title + '</div></div>' +
      '<button class="cal-list__del" type="button">삭제</button>';

    li.querySelector(".cal-list__del").addEventListener("click", function(){
      deleteEvent(ev.id);
    });

    ul.appendChild(li);
  });
}

/* ===== ESC = cancel ===== */
document.addEventListener("keydown", function(e){
  if(e.key === "Escape"){
    var modal = document.getElementById("calModal");
    if(modal && modal.getAttribute("aria-hidden") === "false"){
      calCancel(); // ✅ 저장 안 했으면 변경 취소하고 닫기
    }
  }
});
