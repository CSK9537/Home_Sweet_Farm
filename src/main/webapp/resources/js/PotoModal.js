(function () {
  var modal = document.getElementById("photoModal");
  if (!modal) return;

  var openBtns = document.querySelectorAll("[data-open-photo-modal]");
  var closeBtns = modal.querySelectorAll("[data-close-photo-modal]");
  var plantIdInput = document.getElementById("photoPlantId");

  var fileInput = document.getElementById("photoInput");
  var grid = document.getElementById("photoGrid");
  var resetBtn = document.getElementById("photoResetBtn");

  var progressBar = document.getElementById("photoProgressBar");
  var progressTxt = document.getElementById("photoProgressTxt");

  // 미리보기로 추가된 파일들을 관리: { file, id, url }
  var selectedFiles = [];

  function uid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return String(Date.now()) + "-" + String(Math.random()).slice(2);
  }

  function openModal(plantId) {
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (plantIdInput && plantId !== null && plantId !== undefined) {
      plantIdInput.value = String(plantId);
    }
  }

  function closeModal() {
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function setProgress(pct) {
    var v = Math.max(0, Math.min(100, pct));
    if (progressBar) progressBar.style.width = v + "%";
    if (progressTxt) progressTxt.textContent = v + "%";
  }

  function addPreview(file) {
    if (!grid) return;

    var id = uid();
    var url = URL.createObjectURL(file);
    selectedFiles.push({ file: file, id: id, url: url });

    var card = document.createElement("div");
    card.className = "photo-card";
    card.setAttribute("data-id", id);

    var img = document.createElement("img");
    img.className = "photo-card__img";
    img.src = url;
    img.alt = "업로드 미리보기";

    var remove = document.createElement("button");
    remove.type = "button";
    remove.className = "photo-card__remove";
    remove.textContent = "×";
    remove.addEventListener("click", function () { removePreview(id); });

    card.appendChild(img);
    card.appendChild(remove);

    // “추가 타일(label.photo-add)” 앞에 삽입 (없으면 맨 뒤에)
    var addTile = grid.querySelector(".photo-add");
    if (addTile) grid.insertBefore(card, addTile);
    else grid.appendChild(card);
  }

  function removePreview(id) {
    if (!grid) return;

    // selectedFiles에서 제거 + url revoke
    var idx = -1;
    for (var i = 0; i < selectedFiles.length; i++) {
      if (selectedFiles[i].id === id) { idx = i; break; }
    }
    if (idx === -1) return;

    try { URL.revokeObjectURL(selectedFiles[idx].url); } catch (e) {}
    selectedFiles.splice(idx, 1);

    // DOM에서 제거 (CSS.escape 없이 dataset 비교)
    var cards = grid.querySelectorAll(".photo-card");
    for (var j = 0; j < cards.length; j++) {
      if (cards[j].getAttribute("data-id") === id) {
        cards[j].parentNode.removeChild(cards[j]);
        break;
      }
    }
  }

  function resetAll() {
    if (!grid) return;

    // 미리보기 url revoke
    for (var i = 0; i < selectedFiles.length; i++) {
      try { URL.revokeObjectURL(selectedFiles[i].url); } catch (e) {}
    }
    selectedFiles = [];

    // 카드 제거
    var cards = grid.querySelectorAll(".photo-card");
    for (var j = cards.length - 1; j >= 0; j--) {
      cards[j].parentNode.removeChild(cards[j]);
    }

    // input 초기화
    if (fileInput) fileInput.value = "";

    setProgress(0);
  }

  // 열기 버튼들 연결
  for (var i = 0; i < openBtns.length; i++) {
    (function (btn) {
      btn.addEventListener("click", function () {
        var plantId = btn.getAttribute("data-plant-id");
        openModal(plantId);
      });
    })(openBtns[i]);
  }

  // 닫기 버튼들 연결
  for (var c = 0; c < closeBtns.length; c++) {
    closeBtns[c].addEventListener("click", closeModal);
  }

  // ESC 닫기
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
      closeModal();
    }
  });

  // 파일 선택
  if (fileInput) {
    fileInput.addEventListener("change", function () {
      var files = fileInput.files ? Array.prototype.slice.call(fileInput.files) : [];
      if (files.length === 0) return;

      // 용량 제한(예: 10MB)
      var MAX = 10 * 1024 * 1024;

      for (var i = 0; i < files.length; i++) {
        var f = files[i];
        if (!f) continue;
        if (f.size > MAX) continue; // 너무 크면 스킵(원하면 alert 추가)
        addPreview(f);
      }

      // 진행률은 “선택됨” 느낌만(실제 업로드 진행률 아님)
      setProgress(65);
    });
  }

  // 초기화
  if (resetBtn) {
    resetBtn.addEventListener("click", resetAll);
  }
})();
