(function () {
  var ctx = window.__CTX__ || "";
  var suggestUrl = window.__HASHTAG_SUGGEST_URL__ || (ctx + "/community/hashtag/suggest");

  var modeEl = document.getElementById("mode");
  var mode = modeEl ? modeEl.value : "insert";
  var isOwner = (window.__IS_OWNER__ !== undefined) ? !!window.__IS_OWNER__ : true;

  var tempKeyEl = document.getElementById("tempKey");

  function makeTempKey() {
    if (window.crypto && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return "tk_" + Date.now() + "_" + Math.random().toString(36).substring(2, 12);
  }

  function ensureTempKey() {
    if (!tempKeyEl) return "";
    var v = (tempKeyEl.value || "").trim();
    if (!v) {
      v = makeTempKey();
      tempKeyEl.value = v;
    }
    return v;
  }

  function getTempKey() {
    return ensureTempKey();
  }

  ensureTempKey();

  var boardTypeEl = document.getElementById("boardType");
  var boardType = (boardTypeEl && boardTypeEl.value) ? boardTypeEl.value : "G";

  var typeSelect = document.getElementById("typeSelect");
  if (typeSelect) typeSelect.value = boardType;

  var isQnaContext = (boardType === "Q" || boardType === "A");
  var canChangeType = (mode === "insert" && !isQnaContext);

  if (typeSelect && canChangeType) {
    for (var i = typeSelect.options.length - 1; i >= 0; i--) {
      var v = typeSelect.options[i].value;
      if (v === "Q" || v === "A") typeSelect.options[i].remove();
    }
    typeSelect.disabled = false;

    typeSelect.addEventListener("change", function () {
      boardType = typeSelect.value || "G";
      if (boardTypeEl) boardTypeEl.value = boardType;
      toggleTradeUI();
      filterHeads();
    });
  }

  var tradeBox = document.getElementById("tradeBox");
  var priceInput = document.getElementById("price");
  var tradeStatusEl = document.getElementById("tradeStatus");
  var priceTextDisplay = document.getElementById("priceTextDisplay");
  var priceHint = document.getElementById("priceHint");

  if (priceInput && !priceTextDisplay) {
    priceTextDisplay = document.createElement("div");
    priceTextDisplay.id = "priceTextDisplay";
    priceTextDisplay.className = "input input--readonly";
    priceTextDisplay.style.display = "none";
    priceTextDisplay.style.lineHeight = "44px";
    priceTextDisplay.style.boxSizing = "border-box";
    priceInput.parentNode.insertBefore(priceTextDisplay, priceInput.nextSibling);
  }

  if (priceInput && !priceHint) {
    priceHint = document.createElement("div");
    priceHint.id = "priceHint";
    priceHint.className = "hint";
    priceInput.parentNode.appendChild(priceHint);
  }

  var headSelect = document.getElementById("headSelect");

  function getSelectedCategoryId() {
    if (!headSelect) return "";
    return String(headSelect.value || "").trim();
  }

  function isSellCategory() {
    return getSelectedCategoryId() === "160";
  }

  function isBuyCategory() {
    return getSelectedCategoryId() === "170";
  }

  function isShareCategory() {
    return boardType === "S" || getSelectedCategoryId() === "180";
  }

  function syncMarketPriceUi() {
    var isTrade = (boardType === "T" || boardType === "S");
    var isSell = isSellCategory();
    var isBuy = isBuyCategory();
    var isShare = isShareCategory();

    if (tradeBox) tradeBox.style.display = isTrade ? "" : "none";

    if (priceInput) {
      priceInput.readOnly = false;
      priceInput.disabled = false;
      priceInput.required = false;
      priceInput.style.display = "";

      if (!isTrade) {
        priceInput.disabled = true;
        priceInput.value = "";
        priceInput.placeholder = "가격을 입력해 주세요.";
      } else if (isShare) {
        priceInput.value = "";
        priceInput.disabled = true;
        priceInput.placeholder = "나눔";
        priceInput.style.display = "none";
      } else if (isSell) {
        priceInput.required = true;
        priceInput.placeholder = "판매 가격을 입력해 주세요.";
      } else if (isBuy) {
        priceInput.placeholder = "희망 가격(선택)";
      } else {
        priceInput.placeholder = "가격을 입력해 주세요.";
      }
    }

    if (priceTextDisplay) {
      priceTextDisplay.style.display = (isTrade && isShare) ? "block" : "none";
      priceTextDisplay.textContent = "나눔";
    }

    if (priceHint) {
      if (!isTrade) {
        priceHint.textContent = "";
      } else if (isShare) {
        priceHint.textContent = "나눔글은 가격 입력이 차단되며 저장 시 '나눔'으로 처리됩니다.";
      } else if (isSell) {
        priceHint.textContent = "판매글은 가격 입력이 필수입니다.";
      } else if (isBuy) {
        priceHint.textContent = "구매글은 가격 입력이 선택사항입니다.";
      } else {
        priceHint.textContent = "판매글은 가격 필수, 구매글은 선택사항입니다.";
      }
    }

    if (tradeStatusEl) {
      tradeStatusEl.disabled = !isTrade;
      if (!isTrade) {
        tradeStatusEl.value = "";
      } else if (!tradeStatusEl.value) {
        tradeStatusEl.value = "P";
      }
    }
  }

  function toggleTradeUI() {
    syncMarketPriceUi();
  }
  toggleTradeUI();
  function filterHeads() {
    if (!headSelect) return;

    var opts = headSelect.options;
    for (var i = 0; i < opts.length; i++) {
      var df = opts[i].getAttribute("data-for");
      if (!df) {
        opts[i].hidden = false;
        continue;
      }
      var allow = (("," + df + ",").indexOf("," + boardType + ",") !== -1);
      opts[i].hidden = !allow;
    }

    if (boardType === "T" || boardType === "S") {
      if (opts.length > 0 && opts[0].value === "") opts[0].hidden = true;
      if (!headSelect.value) {
        for (i = 0; i < opts.length; i++) {
          if (!opts[i].hidden && opts[i].value) {
            headSelect.value = opts[i].value;
            break;
          }
        }
      }
    } else {
      if (opts.length > 0 && opts[0].value === "") opts[0].hidden = false;
    }
  }
  filterHeads();

  if (headSelect) {
    headSelect.addEventListener("change", function () {
      syncMarketPriceUi();
    });
  }

  var uploadedImages = [];
  var uploadedImagesJsonEl = document.getElementById("uploadedImagesJson");
  function setUploadedImagesHidden() {
    if (uploadedImagesJsonEl) uploadedImagesJsonEl.value = JSON.stringify(uploadedImages);
  }

  function formatFileSize(bytes) {
    var n = Number(bytes || 0);
    if (n < 1024) return n + " B";
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
    return (n / (1024 * 1024)).toFixed(1) + " MB";
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function isImageType(contentType) {
    if (!contentType) return false;
    var ct = String(contentType).toLowerCase();
    return ct === "image" || ct.indexOf("image/") === 0;
  }

  function isImageFile(file) {
    return !!(file && file.type && file.type.toLowerCase().indexOf("image/") === 0);
  }

  function cssEscapeForSelector(s) {
    return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  }

  function uploadBlob(blob, purpose, done) {
    var tk = getTempKey();
    if (!tk) {
      alert("tempKey가 없습니다. 페이지를 새로고침 후 다시 시도해 주세요.");
      return;
    }

    var fd = new FormData();
    fd.append("file", blob);
    fd.append("tempKey", tk);
    fd.append("boardType", boardType);
    fd.append("purpose", purpose || "EDITOR");

    var xhr = new XMLHttpRequest();
    xhr.open("POST", ctx + "/community/upload", true);

    xhr.onload = function () {
      try {
        if (xhr.status >= 200 && xhr.status < 300) {
          var res = JSON.parse(xhr.responseText || "{}");
          if (res && res.url) {
            uploadedImages.push({
              url: res.url,
              savedName: res.savedName || "",
              subDir: res.subDir || ""
            });
            setUploadedImagesHidden();
            done(res);
            return;
          }
        }
      } catch (e) {}
      alert("업로드에 실패했습니다.");
    };

    xhr.onerror = function () {
      alert("업로드에 실패했습니다.");
    };

    xhr.send(fd);
  }

  var editor = new toastui.Editor({
    el: document.querySelector("#editor"),
    height: "520px",
    initialEditType: "wysiwyg",
    previewStyle: "vertical",
    placeholder: "내용을 입력하세요.",
    hooks: {
      addImageBlobHook: function (blob, callback) {
        uploadBlob(blob, "EDITOR", function (res) {
          callback(res.url, "image");
          setTimeout(function () {
            wrapNewestInsertedImage(res.url);
          }, 0);
        });
      }
    }
  });

  if (mode === "edit") {
    var initContentEl = document.getElementById("initContent");
    if (initContentEl) {
      var htmlInit = initContentEl.value || "";
      if (htmlInit) editor.setHTML(htmlInit);
    }
    if (headSelect && window.__INIT_CATEGORY__) headSelect.value = String(window.__INIT_CATEGORY__);
    var tradeStatusEl2 = document.getElementById("tradeStatus");
    if (tradeStatusEl2 && window.__INIT_TRADE_STATUS__) tradeStatusEl2.value = String(window.__INIT_TRADE_STATUS__);
    syncMarketPriceUi();
  }

  function wrapNewestInsertedImage(url) {
    try {
      var root = editor.getRootElement ? editor.getRootElement() : document.querySelector("#editor");
      if (!root) return;

      var imgs = root.querySelectorAll('img[src="' + cssEscapeForSelector(url) + '"]');
      if (!imgs || imgs.length === 0) return;

      var target = null;
      for (var i = imgs.length - 1; i >= 0; i--) {
        var img = imgs[i];
        if (img.classList && img.classList.contains("hsf-img")) continue;
        if (img.closest && img.closest(".hsf-img-wrap")) continue;
        target = img;
        break;
      }
      if (!target) return;

      var wrap = document.createElement("span");
      wrap.className = "hsf-img-wrap";
      wrap.setAttribute("data-hsf-img", "1");
      wrap.style.width = "480px";

      target.parentNode.insertBefore(wrap, target);
      wrap.appendChild(target);
      target.classList.add("hsf-img");
    } catch (e) {}
  }

  function normalizeResizableImages(html) {
    return html || "";
  }

  var tags = [];
  var tagsHiddenEl = document.getElementById("tagsHidden");
  var tagInput = document.getElementById("tagInput");
  var tagChips = document.getElementById("tagChips");
  var tagSuggest = document.getElementById("tagSuggest");

  function setTagsHidden() {
    if (tagsHiddenEl) {
      tagsHiddenEl.value = tags.join(",");
    }
  }

  function renderTags() {
    if (!tagChips) return;
    tagChips.innerHTML = "";

    tags.forEach(function (tag, idx) {
      var chip = document.createElement("span");
      chip.className = "tag-chip";
      chip.textContent = "#" + tag;

      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = "×";
      btn.addEventListener("click", function () {
        tags.splice(idx, 1);
        renderTags();
      });

      chip.appendChild(btn);
      tagChips.appendChild(chip);
    });

    setTagsHidden();
  }

  if (tagsHiddenEl && tagsHiddenEl.value) {
    tags = tagsHiddenEl.value.split(",").map(function (v) { return v.trim(); }).filter(Boolean);
    renderTags();
  }

  function addTag(v) {
    v = String(v || "").replace(/^#/, "").trim();
    if (!v) return;
    if (v.indexOf(" ") !== -1) return;
    if (tags.indexOf(v) !== -1) return;
    if (tags.length >= 10) return;
    tags.push(v);
    renderTags();
  }

  if (tagInput) {
    tagInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addTag(tagInput.value);
        tagInput.value = "";
        if (tagSuggest) {
          tagSuggest.innerHTML = "";
          tagSuggest.style.display = "none";
        }
      } else if (e.key === "Backspace" && !tagInput.value && tags.length) {
        tags.pop();
        renderTags();
      }
    });

    tagInput.addEventListener("blur", function () {
      var pending = (tagInput.value || "").trim();
      if (!pending) return;

      addTag(pending);
      tagInput.value = "";

      if (tagSuggest) {
        tagSuggest.innerHTML = "";
        tagSuggest.style.display = "none";
      }
    });

    tagInput.addEventListener("input", function () {
      var q = (tagInput.value || "").replace(/^#/, "").trim();
      if (!q) {
        if (tagSuggest) {
          tagSuggest.innerHTML = "";
          tagSuggest.style.display = "none";
        }
        return;
      }

      var xhr = new XMLHttpRequest();
      xhr.open("GET", suggestUrl + "?q=" + encodeURIComponent(q) + "&limit=10", true);
      xhr.onload = function () {
        if (!tagSuggest) return;
        if (xhr.status < 200 || xhr.status >= 300) {
          tagSuggest.innerHTML = "";
          tagSuggest.style.display = "none";
          return;
        }

        var arr = [];
        try {
          arr = JSON.parse(xhr.responseText || "[]");
        } catch (e) {
          arr = [];
        }

        if (!arr || !arr.length) {
          tagSuggest.innerHTML = "";
          tagSuggest.style.display = "none";
          return;
        }

        tagSuggest.innerHTML = "";
        arr.forEach(function (item) {
          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "tag-suggest__item";
          btn.textContent = "#" + item;
          btn.addEventListener("click", function () {
            addTag(item);
            tagInput.value = "";
            tagSuggest.innerHTML = "";
            tagSuggest.style.display = "none";
            tagInput.focus();
          });
          tagSuggest.appendChild(btn);
        });
        tagSuggest.style.display = "";
      };
      xhr.onerror = function () {
        if (tagSuggest) {
          tagSuggest.innerHTML = "";
          tagSuggest.style.display = "none";
        }
      };
      xhr.send();
    });
  }

  var attachFilesEl = document.getElementById("attachFiles");
  var filePreviewEl = document.getElementById("filePreview");
  var uploadedAttachFilesJsonEl = document.getElementById("uploadedAttachFilesJson");
  var existingDeletedFileIdsEl = document.getElementById("existingDeletedFileIds");
  var thumbnailTargetEl = document.getElementById("thumbnailTarget");

  var existingFiles = Array.isArray(window.__EXISTING_FILES__) ? window.__EXISTING_FILES__.slice() : [];
  var deletedExistingFileIds = [];
  var uploadedAttachFiles = [];

  function setUploadedAttachFilesHidden() {
    if (uploadedAttachFilesJsonEl) uploadedAttachFilesJsonEl.value = JSON.stringify(uploadedAttachFiles);
  }

  function setDeletedExistingFileIdsHidden() {
    if (existingDeletedFileIdsEl) existingDeletedFileIdsEl.value = deletedExistingFileIds.join(",");
  }

  function getThumbnailTarget() {
    return thumbnailTargetEl ? (thumbnailTargetEl.value || "") : "";
  }

  function setThumbnailTarget(v) {
    if (thumbnailTargetEl) thumbnailTargetEl.value = v || "";
  }

  function currentVisibleFiles() {
    return existingFiles.filter(function (f) { return !f._deleted; }).concat(uploadedAttachFiles);
  }
  
  function hasVisibleImageAttachment() {
	    var files = currentVisibleFiles();
	    for (var i = 0; i < files.length; i++) {
	      var f = files[i];
	      if (f && isImageType(f.contentType)) {
	        return true;
	      }
	    }
	    return false;
	  }

	  function isMarketBoardWriteMode() {
	    return mode === "insert" && (boardType === "T" || boardType === "S");
	  }

  function firstImageTarget(files) {
    files = files || currentVisibleFiles();
    for (var i = 0; i < files.length; i++) {
      if (isImageType(files[i].contentType)) {
        if (files[i].isExisting) return "existing:" + files[i].fileId;
        return "temp:" + files[i].savedName;
      }
    }
    return "";
  }

  function ensureThumbnailTargetValid() {
    var visible = currentVisibleFiles();
    var target = getThumbnailTarget();
    var valid = false;

    if (target) {
      for (var i = 0; i < visible.length; i++) {
        var f = visible[i];
        if (!isImageType(f.contentType)) continue;

        if (f.isExisting && target === ("existing:" + f.fileId)) {
          valid = true;
          break;
        }
        if (!f.isExisting && target === ("temp:" + f.savedName)) {
          valid = true;
          break;
        }
      }
    }

    if (!valid) {
      setThumbnailTarget(firstImageTarget(visible));
    }
  }

  function insertAttachmentHtmlAtCursor(fileInfo) {
    editor.focus();

    var html = "";

    if (fileInfo.isImage) {
      html =
        '<p>' +
        '  <span class="hsf-img-wrap" data-hsf-img="1" style="width:480px;">' +
        '    <img class="hsf-img" src="' + fileInfo.url + '" alt="' + escapeHtml(fileInfo.originalName) + '" />' +
        '  </span>' +
        '</p><p></p>';
    } else {
      html =
        '<p>' +
        '  <span class="hsf-attach-file" data-temp-file="1">' +
        '    <a href="' + fileInfo.url + '" target="_blank" ' +
        '       data-saved-name="' + escapeHtml(fileInfo.savedName) + '" ' +
        '       data-sub-dir="' + escapeHtml(fileInfo.subDir) + '">' +
                 escapeHtml(fileInfo.originalName) +
        '    </a>' +
        '    <span class="file-size"> (' + formatFileSize(fileInfo.size) + ')</span>' +
        '  </span>' +
        '</p><p></p>';
    }

    var cm = editor.getCurrentModeEditor && editor.getCurrentModeEditor();
    if (cm && cm.insertHTML) {
      cm.insertHTML(html);
      return;
    }

    var current = editor.getHTML() || "";
    editor.setHTML(current + html);
  }

  function removeFileFromEditor(fileInfo) {
    var html = editor.getHTML() || "";
    if (!html) return;

    var url = fileInfo.url;
    if (!url) return;

    var escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    if (isImageType(fileInfo.contentType) || fileInfo.isImage) {
      html = html.replace(
        new RegExp("<p>\\s*<span[^>]*data-hsf-img=\"1\"[^>]*>\\s*<img[^>]*src=\"" + escapedUrl + "\"[^>]*>\\s*</span>\\s*</p>\\s*<p></p>", "gi"),
        ""
      );
      html = html.replace(
        new RegExp("<span[^>]*data-hsf-img=\"1\"[^>]*>\\s*<img[^>]*src=\"" + escapedUrl + "\"[^>]*>\\s*</span>", "gi"),
        ""
      );
      html = html.replace(
        new RegExp("<img[^>]*src=\"" + escapedUrl + "\"[^>]*>", "gi"),
        ""
      );
    } else {
      html = html.replace(
        new RegExp("<p>\\s*<span[^>]*data-temp-file=\"1\"[^>]*>.*?<a[^>]*href=\"" + escapedUrl + "\"[^>]*>.*?</a>.*?</span>\\s*</p>\\s*<p></p>", "gi"),
        ""
      );
      html = html.replace(
        new RegExp("<span[^>]*data-temp-file=\"1\"[^>]*>.*?<a[^>]*href=\"" + escapedUrl + "\"[^>]*>.*?</a>.*?</span>", "gi"),
        ""
      );
      html = html.replace(
        new RegExp("<a[^>]*href=\"" + escapedUrl + "\"[^>]*>.*?</a>", "gi"),
        ""
      );
    }

    editor.setHTML(html);
  }

  function renderFileList() {
    if (!filePreviewEl) return;
    filePreviewEl.innerHTML = "";

    var files = currentVisibleFiles();
    if (!files.length) return;

    ensureThumbnailTargetValid();
    var currentTarget = getThumbnailTarget();

    files.forEach(function (fileInfo) {
      var row = document.createElement("div");
      row.className = "file-preview-item";

      var left = document.createElement("div");
      left.className = "file-preview-item__left";

      if (isImageType(fileInfo.contentType)) {
        var thumbWrap = document.createElement("label");
        thumbWrap.className = "thumb-picker";

        var radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "thumbnailPick";
        radio.checked =
          (fileInfo.isExisting && currentTarget === ("existing:" + fileInfo.fileId)) ||
          (!fileInfo.isExisting && currentTarget === ("temp:" + fileInfo.savedName));

        radio.addEventListener("change", function () {
          if (fileInfo.isExisting) {
            setThumbnailTarget("existing:" + fileInfo.fileId);
          } else {
            setThumbnailTarget("temp:" + fileInfo.savedName);
          }
        });

        var span = document.createElement("span");
        span.textContent = "썸네일";

        thumbWrap.appendChild(radio);
        thumbWrap.appendChild(span);
        left.appendChild(thumbWrap);
      } else {
        var badge = document.createElement("span");
        badge.className = "thumb-picker thumb-picker--empty";
        badge.textContent = "파일";
        left.appendChild(badge);
      }

      var text = document.createElement("span");
      text.className = "file-preview-item__name";
      text.textContent = fileInfo.originalName + " (" + formatFileSize(fileInfo.size) + ")";
      left.appendChild(text);

      var right = document.createElement("div");
      right.className = "file-preview-item__right";

      var typeBadge = document.createElement("span");
      typeBadge.className = "file-kind-badge";
      typeBadge.textContent = fileInfo.isExisting ? "기존파일" : "새파일";
      right.appendChild(typeBadge);

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "file-delete-btn";
      btn.textContent = "삭제";
      btn.addEventListener("click", function () {
        if (fileInfo.isExisting) {
          fileInfo._deleted = true;
          if (deletedExistingFileIds.indexOf(String(fileInfo.fileId)) === -1) {
            deletedExistingFileIds.push(String(fileInfo.fileId));
            setDeletedExistingFileIdsHidden();
          }
        } else {
          uploadedAttachFiles = uploadedAttachFiles.filter(function (f) {
            return !(f.savedName === fileInfo.savedName && f.subDir === fileInfo.subDir);
          });
          setUploadedAttachFilesHidden();
        }

        removeFileFromEditor(fileInfo);
        ensureThumbnailTargetValid();
        renderFileList();
      });
      right.appendChild(btn);

      row.appendChild(left);
      row.appendChild(right);
      filePreviewEl.appendChild(row);
    });
  }

  function uploadAttachFileTemp(file, done) {
    uploadBlob(file, "ATTACH", function (res) {
      done({
        isExisting: false,
        fileId: 0,
        url: res.url,
        savedName: res.savedName || "",
        subDir: res.subDir || "",
        originalName: file.name || "",
        size: file.size || 0,
        contentType: file.type || "",
        isImage: isImageFile(file)
      });
    });
  }

  existingFiles = existingFiles.map(function (f) {
    return {
      isExisting: true,
      fileId: Number(f.fileId || 0),
      url: f.url || "",
      savedName: f.savedName || "",
      subDir: f.subDir || "",
      originalName: f.originalName || "",
      size: Number(f.size || 0),
      contentType: f.contentType || "",
      fileKind: f.fileKind || "",
      isImage: isImageType(f.contentType),
      _deleted: false
    };
  });

  for (var exIdx = 0; exIdx < existingFiles.length; exIdx++) {
    if (existingFiles[exIdx].isImage && String(window.__EXISTING_FILES__[exIdx].isThumbnail || "N") === "Y") {
      setThumbnailTarget("existing:" + existingFiles[exIdx].fileId);
      break;
    }
  }

  renderFileList();

  if (attachFilesEl) {
    attachFilesEl.addEventListener("change", function () {
      var files = attachFilesEl.files;
      if (!files || !files.length) return;

      Array.prototype.forEach.call(files, function (file) {
        uploadAttachFileTemp(file, function (fileInfo) {
          uploadedAttachFiles.push(fileInfo);
          setUploadedAttachFilesHidden();

          if (!getThumbnailTarget() && fileInfo.isImage) {
            setThumbnailTarget("temp:" + fileInfo.savedName);
          }

          renderFileList();
          insertAttachmentHtmlAtCursor(fileInfo);
        });
      });

      attachFilesEl.value = "";
    });
  }

  var form = document.getElementById("writeForm");
  var contentHtmlEl = document.getElementById("contentHtml");

  if (mode === "edit" && !isOwner && form) {
    form.addEventListener("submit", function (e) {
      alert("작성자만 수정할 수 있습니다.");
      e.preventDefault();
    });
  }

  if (form) {
	    form.addEventListener("submit", function (e) {
	      if (mode === "edit" && !isOwner) {
	        e.preventDefault();
	        return;
	      }

	      if (tagInput) {
	        var pendingTag = (tagInput.value || "").trim();
	        if (pendingTag) {
	          addTag(pendingTag);
	          tagInput.value = "";
	          if (tagSuggest) {
	            tagSuggest.innerHTML = "";
	            tagSuggest.style.display = "none";
	          }
	        }
	      }

	      var html = editor.getHTML();
	      if (!html || html.replace(/<[^>]*>/g, "").trim().length === 0) {
	        alert("본문을 입력해 주세요.");
	        e.preventDefault();
	        return;
	      }

	      html = normalizeResizableImages(html);
	      if (contentHtmlEl) contentHtmlEl.value = html;

	      setTagsHidden();
	      setUploadedAttachFilesHidden();
	      setDeletedExistingFileIdsHidden();
	      ensureThumbnailTargetValid();

	      if (!getTempKey()) {
	        alert("tempKey가 없습니다. 페이지를 새로고침 후 다시 시도해 주세요.");
	        e.preventDefault();
	        return;
	      }

	      if (headSelect && !headSelect.value && (boardType === "T" || boardType === "S")) {
	        alert("거래/나눔 게시판은 말머리를 선택해 주세요.");
	        e.preventDefault();
	        return;
	      }

	      if (boardType === "T" || boardType === "S") {
	        var categoryId = getSelectedCategoryId();
	        var rawPrice = priceInput ? String(priceInput.value || "").trim() : "";

	        if (!categoryId) {
	          alert("거래/나눔 게시판은 말머리를 선택해 주세요.");
	          e.preventDefault();
	          return;
	        }

	        if (isMarketBoardWriteMode() && !hasVisibleImageAttachment()) {
	          alert("벼룩시장 게시글은 이미지 첨부파일을 1개 이상 등록해야 합니다.");
	          e.preventDefault();
	          if (attachFilesEl) attachFilesEl.focus();
	          return;
	        }

	        if (categoryId === "160" && !rawPrice) {
	          alert("판매글은 가격 입력이 필수입니다.");
	          e.preventDefault();
	          if (priceInput) priceInput.focus();
	          return;
	        }

	        if (categoryId === "180" || boardType === "S") {
	          if (priceInput) priceInput.value = "";
	        }
	      }
	    });
	  }
})();