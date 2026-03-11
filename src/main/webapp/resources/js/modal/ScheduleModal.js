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

// [최적화] padStart 대신 구형 브라우저(ES5)에서도 완벽히 동작하고 더 빠른 slice 활용
function pad2(n){ return ("0" + n).slice(-2); }
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
function calCancel(){ closeScheduleModal(); }
function calSave(){ closeScheduleModal(); }

/* ===== memo palette ===== */
function initMemoPalette(){
  var palette = document.getElementById("memoPalette");
  if(!palette || palette.dataset.inited === "1") return;
  palette.dataset.inited = "1";

  var btns = palette.querySelectorAll(".memo-item");
  // [최적화] Array.prototype.forEach.call 대신 네이티브 for 루프 사용 (속도 향상)
  for(var i = 0; i < btns.length; i++){
    (function(btn){
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
    })(btns[i]);
  }
}

/* ===== add/delete event (서버 실시간 연동) ===== */
function addQuickSchedule(dateYmd, type, title){
  var isDuplicate = calState.events.some(function(e) {
    return e.myplant_id === calState.myplant_id && 
           e.date === String(dateYmd) && 
           e.type === String(type);
  });

  if (isDuplicate) {
    showCustomToast("이미 해당 날짜에 [" + title + "] 일정이 등록되어 있습니다.", "warning");
    return;
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
  // [최적화] 네이티브 for문으로 성능 개선
  for(var i = 0; i < els.length; i++){
    els[i].classList.remove("cal-cell--droppable");
  }
}

// [최적화] 이벤트 핸들러를 밖으로 빼서 42번씩 함수가 재생성되는 메모리 낭비 제거
function handleCellClick() {
  var ymd = this.getAttribute("data-ymd");
  calState.selected = String(ymd);
  var memoDateEl = document.getElementById("memoDate");
  if(memoDateEl) memoDateEl.textContent = ymd;
  renderCalendar();
  renderScheduleList();
}
function handleCellDragOver(e) {
  e.preventDefault();
  this.classList.add("cal-cell--droppable");
}
function handleCellDragLeave() {
  this.classList.remove("cal-cell--droppable");
}
function handleCellDrop(e) {
  e.preventDefault();
  this.classList.remove("cal-cell--droppable");
  var ymd = this.getAttribute("data-ymd");

  var payload = dragPayload;
  if(!payload){
    try{ payload = JSON.parse(e.dataTransfer.getData("text/plain")); }catch(_){}
  }
  if(!payload || !payload.type || !payload.title) return;

  addQuickSchedule(ymd, payload.type, payload.title);
  clearDropHighlight();
}

function renderCalendar(){
  var y = calState.viewDate.getFullYear();
  var m = calState.viewDate.getMonth();
  
  var mk = document.getElementById("calMonthKr");
  if(mk) mk.textContent = y + "년 " + (m+1) + "월";

  var grid = document.getElementById("calGrid");
  if(!grid) return;
  grid.innerHTML = "";

  var first = new Date(y, m, 1);
  var startDow = first.getDay();
  var start = new Date(y, m, 1 - startDow);
  var total = 42;
  
  // [최적화] DocumentFragment 사용 (렌더링을 1회로 압축)
  var docFrag = document.createDocumentFragment();
  
  // [최적화] 루프 전 현재 식물의 이벤트만 필터링하여 루프 내 탐색 비용 단축
  var plantEvents = calState.events.filter(function(e){
    return e.myplant_id === calState.myplant_id;
  });

  for(var i=0; i<total; i++){
    var d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    var ymd = toYMD(d);
    var dow = d.getDay();

    var cell = document.createElement("div");
    cell.className = "cal-cell";
    cell.setAttribute("data-ymd", ymd); // [최적화] 클로저 대신 속성에 데이터 저장

    if(d.getMonth() !== m) cell.classList.add("cal-cell--muted");
    if(dow===0) cell.classList.add("cal-cell--sun");
    if(dow===6) cell.classList.add("cal-cell--sat");
    if(calState.selected === ymd) cell.classList.add("cal-cell--selected");

    var day = document.createElement("div");
    day.className = "cal-cell__day";
    day.textContent = d.getDate();
    cell.appendChild(day);

    var todays = plantEvents.filter(function(e){
      return e.date === ymd;
    });

    if(todays.length > 0){
      var marks = document.createElement("div");
      marks.className = "cal-marks";

      var shownLen = Math.min(todays.length, MAX_CELL_MARKS);
      for(var j=0; j<shownLen; j++){
        var ev = todays[j];
        var s = document.createElement("span");
        s.className = "cal-mark";
        s.textContent = TYPE_EMOJI[ev.type] || "🗓️";
        s.title = ev.title;
        marks.appendChild(s);
      }

      if(todays.length > MAX_CELL_MARKS){
        var more = document.createElement("span");
        more.className = "cal-mark cal-mark--more";
        more.textContent = "+" + (todays.length - MAX_CELL_MARKS);
        marks.appendChild(more);
      }

      cell.appendChild(marks);
    }

    // [최적화] 미리 선언된 단일 핸들러를 참조하여 메모리 낭비 제거
    cell.addEventListener("click", handleCellClick);
    cell.addEventListener("dragover", handleCellDragOver);
    cell.addEventListener("dragleave", handleCellDragLeave);
    cell.addEventListener("drop", handleCellDrop);

    docFrag.appendChild(cell);
  }
  
  // 화면 리플로우(Reflow)를 한 번만 발생시킴
  grid.appendChild(docFrag); 
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

  // [최적화] 리스트 렌더링 시에도 DocumentFragment 적용
  var docFrag = document.createDocumentFragment();

  list.forEach(function(ev){
    var li = document.createElement("li");
    var emoji = TYPE_EMOJI[ev.type] || "🗓️";

    li.innerHTML =
      '<div><div class="cal-list__title">' + emoji + ev.title + '</div></div>' +
      '<button class="cal-list__del" type="button">삭제</button>';

    li.querySelector(".cal-list__del").addEventListener("click", function(){
      deleteEvent(ev.id);
    });

    docFrag.appendChild(li);
  });
  
  ul.appendChild(docFrag);
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