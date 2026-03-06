(function () {
  var modal = document.getElementById("photoModal");
  if (!modal) return;

  var openBtns = document.querySelectorAll("[data-open-photo-modal]");
  var closeBtn = modal.querySelector(".photo-modal__close");
  var plantIdInput = document.getElementById("photoPlantId");

  var fileInput = document.getElementById("photoInput");
  var grid = document.getElementById("photoGrid");
  var resetBtn = document.getElementById("photoResetBtn");
  var photoForm = document.getElementById("photoForm");
  var submitBtn = document.getElementById("photoSubmitBtn");

  var currentFileState = null; // 형태: { file: File 객체, url: 미리보기 URL }

  function openModal(plantId) {
    modal.setAttribute("aria-hidden", "false");
    if (plantIdInput && plantId != null) {
      plantIdInput.value = String(plantId);
    }
  }

  function closeModal() {
    modal.setAttribute("aria-hidden", "true");
    resetAll();
  }

  // --- 미리보기 추가 ---
  function addPreview(file) {
    if (!grid) return;

    if (currentFileState) {
      removePreview();
    }

    var url = URL.createObjectURL(file);
    currentFileState = { file: file, url: url };

    // DOM 요소 생성
    var card = document.createElement("div");
    card.className = "photo-card";

    var img = document.createElement("img");
    img.className = "photo-card__img";
    img.src = url;
    img.alt = "업로드 미리보기";

    var removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "photo-card__remove";
    removeBtn.textContent = "×";
    removeBtn.addEventListener("click", removePreview);

    card.appendChild(img);
    card.appendChild(removeBtn);

    var addTile = grid.querySelector(".photo-add");
    if (addTile) {
      grid.insertBefore(card, addTile);
      addTile.style.display = "none"; // 추가 버튼 숨김
    } else {
      grid.appendChild(card);
    }
  }

  // --- 미리보기 제거 ---
  function removePreview() {
    if (!currentFileState) return;

    URL.revokeObjectURL(currentFileState.url);
    currentFileState = null;

    // DOM에서 미리보기 카드 제거
    var card = grid.querySelector(".photo-card");
    if (card) {
      card.parentNode.removeChild(card);
    }

    // 사진 추가 영역 다시 표시
    var addTile = grid.querySelector(".photo-add");
    if (addTile) {
      addTile.style.display = ""; 
    }
    
    // 같은 사진을 다시 올릴 수 있도록 input 비우기
    if (fileInput) fileInput.value = ""; 
  }

  // --- 전체 초기화 (removePreview 재사용) ---
  function resetAll() {
    removePreview();
  }

  // --- 파일 검증 및 처리 ---
  function handleFiles(files) {
    if (!files || files.length === 0) return;

    var f = files[0];
    var MAX_SIZE = 10 * 1024 * 1024; // 10MB

    if (!f.type.match("image.*")) {
      showCustomToast("이미지 파일만 업로드 가능합니다.", "warning");
      if (fileInput) fileInput.value = ""; 
      return;
    }

    if (f.size > MAX_SIZE) {
      showCustomToast("10MB 이하의 사진만 업로드 가능합니다.", "warning");
      if (fileInput) fileInput.value = ""; 
      return;
    }

    addPreview(f);
  }

  // ==========================================
  // 이벤트 리스너 바인딩
  // ==========================================

  // 열기 / 닫기 / 초기화
  openBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      openModal(btn.getAttribute("data-plant-id"));
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (resetBtn) resetBtn.addEventListener("click", resetAll);

  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
      closeModal();
    }
  });

  // 파일 선택기(input) 이벤트
  if (fileInput) {
    fileInput.addEventListener("change", function () {
      handleFiles(fileInput.files);
    });
  }

  // 드래그 앤 드롭 이벤트
  var dropZone = document.getElementById("photoGrid"); 
  if (dropZone) {
    var preventDefaults = function (e) {
      e.preventDefault();
      e.stopPropagation();
    };

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function(eventName) {
      dropZone.addEventListener(eventName, preventDefaults, false);
    });

    var dragCounter = 0;

    dropZone.addEventListener('dragenter', function() {
      dragCounter++;
      dropZone.classList.add("is-dragover");
    }, false);

    dropZone.addEventListener('dragleave', function() {
      dragCounter--;
      if (dragCounter === 0) {
        dropZone.classList.remove("is-dragover"); 
      }
    }, false);

    dropZone.addEventListener('drop', function(e) {
      dragCounter = 0;
      dropZone.classList.remove("is-dragover");

      var dt = e.dataTransfer;
      if (dt && dt.files && dt.files.length > 0) {
        if (fileInput) fileInput.files = dt.files;
        handleFiles(dt.files);
      }
    }, false);
  }

  // 폼 전송 (Ajax 업로드)
  if (photoForm) {
    photoForm.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!currentFileState) {
        showCustomToast("업로드할 사진을 선택해주세요.", "warning");
        return;
      }

      // 다중 클릭(서버 과부하/에러) 방지를 위해 업로드 중 버튼 비활성화
      if (submitBtn) submitBtn.disabled = true;

      var formData = new FormData();
      if (plantIdInput) {
        formData.append("myplant_id", plantIdInput.value); 
      }
      formData.append("file", currentFileState.file);

      var xhr = new XMLHttpRequest();
      xhr.open("POST", photoForm.action, true);
      xhr.setRequestHeader("Accept", "application/json");

      xhr.onload = function () {
        if (submitBtn) submitBtn.disabled = false; // 완료 후 버튼 원상복구

        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            var response = JSON.parse(xhr.responseText);
            showCustomToast("사진이 성공적으로 등록되었습니다.", "success");
            
            // 화면 이미지 갱신
            var targetImg = document.querySelector(".plant-detail__img");
            if (targetImg && response.fileUrl) {
              targetImg.src = "/myplant/image/show?fileName=" + response.fileUrl + "&t=" + new Date().getTime();
            }

            closeModal(); // 닫기만 해도 초기화(resetAll)가 자동으로 호출됨
          } catch (err) {
            showCustomToast("서버 응답 처리 중 오류가 발생했습니다.", "error");
          }
        } else {
          showCustomToast("업로드에 실패했습니다. (상태 코드: " + xhr.status + ")", "error");
        }
      };

      xhr.onerror = function () {
        if (submitBtn) submitBtn.disabled = false;
        showCustomToast("네트워크 오류가 발생했습니다.", "error");
      };

      xhr.send(formData);
    });
  }
})();