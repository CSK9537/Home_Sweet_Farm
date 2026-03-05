(function () {
  var modal = document.getElementById("photoModal");
  if (!modal) return;

  var openBtns = document.querySelectorAll("[data-open-photo-modal]");
  var closeBtn = modal.querySelector(".photo-modal__close");
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
    if (plantIdInput && plantId !== null && plantId !== undefined) {
      plantIdInput.value = String(plantId);
    }
  }

  function closeModal() {
    modal.setAttribute("aria-hidden", "true");
  }

  function setProgress(pct) {
    var v = Math.max(0, Math.min(100, pct));
    if (progressBar) progressBar.style.width = v + "%";
    if (progressTxt) progressTxt.textContent = v + "%";
  }
  
  //1. 사진 미리보기가 추가될 때 '사진 추가' 버튼 숨기기
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

    var addTile = grid.querySelector(".photo-add");
    if (addTile) {
      grid.insertBefore(card, addTile);
      // 👉 여기서 추가 타일을 숨깁니다!
      addTile.style.display = "none"; 
    } else {
      grid.appendChild(card);
    }
  }

  // 2. 사진 미리보기를 (x) 눌러서 지웠을 때 '사진 추가' 버튼 다시 보이기
  function removePreview(id) {
    if (!grid) return;

    var idx = -1;
    for (var i = 0; i < selectedFiles.length; i++) {
      if (selectedFiles[i].id === id) { idx = i; break; }
    }
    if (idx === -1) return;

    try { URL.revokeObjectURL(selectedFiles[idx].url); } catch (e) {}
    selectedFiles.splice(idx, 1);

    var cards = grid.querySelectorAll(".photo-card");
    for (var j = 0; j < cards.length; j++) {
      if (cards[j].getAttribute("data-id") === id) {
        cards[j].parentNode.removeChild(cards[j]);
        break;
      }
    }

    // 배열이 비었으니(0장) 추가 타일을 다시 보여줍니다!
    var addTile = grid.querySelector(".photo-add");
    if (addTile && selectedFiles.length === 0) {
      addTile.style.display = ""; 
    }
    
    // 센스있는 처리: 지우고 나서 방금 올렸던 똑같은 사진을 다시 올릴 수 있도록 input 값 초기화
    if (fileInput) fileInput.value = ""; 
  }

  // 3. 모달을 닫거나 초기화 버튼을 눌렀을 때 '사진 추가' 버튼 원래대로 복구
  function resetAll() {
    if (!grid) return;

    for (var i = 0; i < selectedFiles.length; i++) {
      try { URL.revokeObjectURL(selectedFiles[i].url); } catch (e) {}
    }
    selectedFiles = [];

    var cards = grid.querySelectorAll(".photo-card");
    for (var j = cards.length - 1; j >= 0; j--) {
      cards[j].parentNode.removeChild(cards[j]);
    }

    if (fileInput) fileInput.value = "";

    // 👉 초기화 시 추가 타일 무조건 다시 보이기!
    var addTile = grid.querySelector(".photo-add");
    if (addTile) {
      addTile.style.display = ""; 
    }

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

  // 닫기 버튼
  closeBtn.addEventListener("click", closeModal);

  // ESC 닫기
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
      closeModal();
    }
  });

//--- 파일 선택  ---
  if (fileInput) {
    fileInput.addEventListener("change", function () {
      var files = fileInput.files ? Array.prototype.slice.call(fileInput.files) : [];
      if (files.length === 0) return;

      var f = files[0]; // 무조건 첫 번째 파일 하나만!
      var MAX = 10 * 1024 * 1024; // 10MB

      if (f.size > MAX) {
        alert("10MB 이하의 사진만 업로드 가능합니다.");
        fileInput.value = ""; 
        return;
      }

      // 기존 미리보기 화면과 배열 싹 비우기 (1장만 유지하기 위함)
      for (var i = 0; i < selectedFiles.length; i++) {
        try { URL.revokeObjectURL(selectedFiles[i].url); } catch (e) {}
      }
      selectedFiles = [];
      
      var cards = grid.querySelectorAll(".photo-card");
      for (var j = 0; j < cards.length; j++) {
        cards[j].parentNode.removeChild(cards[j]);
      }

      // 새로운 파일 1개만 미리보기에 추가
      addPreview(f);
    });
  }

  // 초기화
  if (resetBtn) {
    resetBtn.addEventListener("click", resetAll);
  }
  
  // 사진 업로드
  var photoForm = document.getElementById("photoForm");
  var progressContainer = document.querySelector(".photo-progress"); // 진행률 UI 영역

  if (photoForm) {
    photoForm.addEventListener("submit", function (e) {
      e.preventDefault();

      if (selectedFiles.length === 0) {
    	showCustomToast("업로드할 사진을 선택해주세요.", "warning");
        return;
      }

      var formData = new FormData();
      
      if (plantIdInput) {
        formData.append("myplant_id", plantIdInput.value); 
      }

      // 전송
      formData.append("file", selectedFiles[0].file);

      // 진행률 UI 노출
      if (progressContainer) {
        progressContainer.setAttribute("aria-hidden", "false");
      }

      // 서버로 전송 (form의 action URL을 그대로 사용)
      var xhr = new XMLHttpRequest();
      xhr.open("POST", photoForm.action, true);
      xhr.setRequestHeader("Accept", "application/json");

      // 진행률 업데이트
      xhr.upload.addEventListener("progress", function (e) {
        if (e.lengthComputable) {
          var pct = Math.round((e.loaded / e.total) * 100);
          setProgress(pct);
        }
      });

      // 전송 완료 시
      xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        var response = JSON.parse(xhr.responseText);
        
        // 💡 백엔드에서 fileUrl (단수)로 보내고 있으므로 수정
        console.log("업로드된 파일 경로:", response.fileUrl); 
        
        showCustomToast("사진이 성공적으로 등록되었습니다.", "success");
        
        // 이미지 변경
        var newFileName = response.fileUrl; // 서버에서 받아온 새 파일명 (예: uuid.jpg)
        
        // 메인 화면에 있는 식물 이미지 태그를 클래스명으로 찾습니다.
        var targetImg = document.querySelector(".plant-detail__img");
        
        if (targetImg) {
          // 방금 새로 만든 이미지 출력 컨트롤러(/show)의 주소로 src를 변경합니다.
          // ?t= 뒤에 현재 시간을 붙이는 이유는 브라우저 캐시를 무시하고 무조건 새 사진을 불러오기 위함입니다.
          targetImg.src = "/myplant/image/show?fileName=" + newFileName + "&t=" + new Date().getTime();
        }

        resetAll();
        closeModal();
        
      } else {
        showCustomToast("업로드에 실패했습니다. (상태 코드: " + xhr.status + ")", "error");
        setProgress(0);
      }
    };

      xhr.onerror = function () {
    	showCustomToast("네트워크 오류가 발생했습니다.", "error");
        setProgress(0);
      };

      xhr.send(formData);
    });
  }
})();
