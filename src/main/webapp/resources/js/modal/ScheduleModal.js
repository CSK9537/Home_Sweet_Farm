/* schedule-modal.js (실시간 서버 연동 버전 / 타입 안정성 강화 / 중복 방지 추가 / ES5 호환)
 * 요구사항 반영:
 * - 날짜칸 일정: 이모지 요약(+N)
 * - 취소/저장 스냅샷 로직 제거 (실시간 DB 반영)
 * - 추가/삭제 시 즉시 서버 통신 (fetch)
 * - 닫기(X), ESC: 모달 닫기
 * - 서버 응답 데이터 타입 명시적 변환 적용
 * - 동일 날짜 동일 타입(물주기 등) 중복 추가 방지
 */

var ctx = window.ctx || ""; // JSP에서 선언된 Context Path

var MONTH_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];

var TYPE_EMOJI = {
  water: "💧",
  nutri: "🧪",
  repot: "🪴"
};

var MAX_CELL_MARKS = 4;

var calState = {
  myplant_id: null, // Number
  viewDate: new Date(),
  selected: null, // String "YYYY-MM-DD"
  events: []      // {id: Number, myplant_id: Number, date: String, type: String, title: String}
};

var dragPayload = null;

function pad2(n){ return String(n).padStart(2,"0"); }
function toYMD(d){ return d.getFullYear() + "-" + pad2(d.getMonth()+1) + "-" + pad2(d.getDate()); }

/* ===== open/close ===== */
function openScheduleModal(myplant_id){
  calState.myplant_id = Number(myplant_id);

  var modal = document.getElementById("calModal");
  modal.setAttribute("aria-hidden","false");

  initMemoPalette();

  fetch(ctx + "/myplant/schedule/" + calState.myplant_id)
    .then(function(res) {
      if (!res.ok) throw new Error("네트워크 응답이 올바르지 않습니다.");
      return res.json();
    })
    .then(function(data) {
      var formattedData = data.map(function(item) {
        return {
          id: Number(item.id),
          myplant_id: Number(item.myplant_id),
          date: String(item.date),
          type: String(item.type),
          title: String(item.title)
        };
      });

      var otherEvents = calState.events.filter(function(e){ return e.myplant_id !== calState.myplant_id; });
      calState.events = otherEvents.concat(formattedData);

      if(!calState.selected){
        calState.selected = toYMD(new Date());
      }
      var memoDateEl = document.getElementById("memoDate");
      if(memoDateEl){
        memoDateEl.textContent = calState.selected;
      }

      renderCalendar();
      renderScheduleList();
    })
    .catch(function(err) {
      console.error("일정 불러오기 에러:", err);
      showCustomToast("일정을 불러오는데 실패했습니다.", "error");
    });
}

function closeScheduleModal(){
  var modal = document.getElementById("calModal");
  modal.setAttribute("aria-hidden","true");
  dragPayload = null;
  clearDropHighlight();
  // 모달이 닫힐 때 전역 객체(window)에 커스텀 이벤트 발생시키기
  if (calState.myplant_id) {
    var event = new CustomEvent("scheduleUpdated", {
      detail: { myplant_id: calState.myplant_id } // 전달할 데이터
    });
    window.dispatchEvent(event);
  }
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

  calState.viewDate = new Date(today.getFullYear(), today.getMonth(), 1);

  var todayYmd = toYMD(today);
  calState.selected = todayYmd;

  var memoDateEl = document.getElementById("memoDate");
  if(memoDateEl){
    memoDateEl.textContent = todayYmd;
  }

  renderCalendar();
  renderScheduleList();
}

/* ===== cancel/save (실시간 처리로 인한 대체) ===== */
function calCancel(){
  closeScheduleModal();
}

function calSave(){
  closeScheduleModal();
}

/* ===== memo palette ===== */
function initMemoPalette(){
  var palette = document.getElementById("memoPalette");
  if(!palette || palette.dataset.inited === "1") return;
  palette.dataset.inited = "1";

  var btns = palette.querySelectorAll(".memo-item");
  Array.prototype.forEach.call(btns, function(btn){
    btn.addEventListener("click", function(){
      if(!calState.selected){
    	showCustomToast("먼저 캘린더에서 날짜를 선택하세요.", "warning");
        return;
      }
      addQuickSchedule(calState.selected, btn.dataset.type, btn.dataset.title);
    });

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

/* ===== add/delete event (서버 실시간 연동) ===== */
function addQuickSchedule(dateYmd, type, title){
  // 💡 [추가된 부분] 해당 날짜에 같은 타입(물주기, 영양제 등)이 이미 존재하는지 검사
  var isDuplicate = calState.events.some(function(e) {
    return e.myplant_id === calState.myplant_id && 
           e.date === String(dateYmd) && 
           e.type === String(type);
  });

  if (isDuplicate) {
	showCustomToast("이미 해당 날짜에 [" + title + "] 일정이 등록되어 있습니다.", "warning");
    return; // 중복이면 함수 실행을 중단하고 서버 요청을 보내지 않음
  }

  var payload = {
    myplant_id: Number(calState.myplant_id),
    date: String(dateYmd),
    type: String(type),
    title: String(title)
  };

  fetch(ctx + "/myplant/schedule", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(function(res) {
    if(!res.ok) throw new Error("서버 저장 실패");
    return res.json(); 
  })
  .then(function(savedEvent) {
    var formattedEvent = {
      id: Number(savedEvent.id),
      myplant_id: Number(savedEvent.myplant_id),
      date: String(savedEvent.date),
      type: String(savedEvent.type),
      title: String(savedEvent.title)
    };

    calState.events.push(formattedEvent);
    calState.selected = String(dateYmd);

    var memoDateEl = document.getElementById("memoDate");
    if(memoDateEl) memoDateEl.textContent = calState.selected;

    renderCalendar();
    renderScheduleList();
  })
  .catch(function(err) {
    console.error("일정 추가 에러:", err);
    showCustomToast("일정 추가에 실패했습니다.", "error");
  });
}

function deleteEvent(id) {
  showCustomToast("해당 일정을 삭제하시겠습니까?", "warning", true)
    .then(function(result) {
      if (result.isConfirmed) {
        var targetId = Number(id);

        fetch(ctx + "/myplant/schedule/" + targetId, {
          method: "DELETE"
        })
        .then(function(res) {
          if(!res.ok) throw new Error("서버 삭제 실패");
          return res.text();
        })
        .then(function(text) {
          if(text === "success") {
            // 삭제 성공 시 로컬 배열 제거 후 화면 갱신
            calState.events = calState.events.filter(function(e){ return e.id !== targetId; });
            renderCalendar();
            renderScheduleList();
          }
        })
        .catch(function(err) {
          console.error("일정 삭제 에러:", err);
          showCustomToast("일정 삭제에 실패했습니다.", "error");
        });
      }
    });
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

      var day = document.createElement("div");
      day.className = "cal-cell__day";
      day.textContent = d.getDate();
      cell.appendChild(day);

      var todays = calState.events.filter(function(e){
        return e.myplant_id === calState.myplant_id && e.date === ymd;
      });

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

      cell.addEventListener("click", function(){
        calState.selected = String(ymd);
        var memoDateEl = document.getElementById("memoDate");
        if(memoDateEl) memoDateEl.textContent = ymd;

        renderCalendar();
        renderScheduleList();
      });

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
    return e.myplant_id === calState.myplant_id && e.date === calState.selected;
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
      closeScheduleModal(); 
    }
  }
});