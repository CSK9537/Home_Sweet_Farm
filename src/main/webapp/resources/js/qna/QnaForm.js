(function () {
  var ctx = window.__CTX__ || "";
  var suggestUrl = ctx + "/qna/hashtag/suggest";

  // ===== mode / owner =====
  var modeEl = document.getElementById("mode");
  var mode = modeEl ? modeEl.value : "insert";
  var isOwner = (window.__IS_OWNER__ !== undefined) ? !!window.__IS_OWNER__ : true;

  // ===== tempKey (업로드 필수) =====
  var tempKeyEl = document.getElementById("tempKey");
  function getTempKey() {
    return tempKeyEl ? (tempKeyEl.value || "") : "";
  }

  // ===== type =====
  var boardTypeEl = document.getElementById("boardType");
  var boardType = (boardTypeEl && boardTypeEl.value) ? boardTypeEl.value : "Q";

  var typeSelect = document.getElementById("typeSelect");
  if (typeSelect) typeSelect.value = boardType;

  // QnA 폼에서는 타입 변경 불가 (Q/A 고정)
  if (typeSelect) {
    typeSelect.disabled = true;
  }

  // ===== 말머리 필터링 =====
  var headSelect = document.getElementById("headSelect");
  function filterHeads() {
    if (!headSelect) return;

    var opts = headSelect.options;
    for (var i = 0; i < opts.length; i++) {
        var df = opts[i].getAttribute("data-for");
        if (!df) { opts[i].hidden = false; continue; }
        var allow = (("," + df + ",").indexOf("," + boardType + ",") !== -1);
        opts[i].hidden = !allow;
    }
  }
  filterHeads();

  // ===== Toast UI Editor =====
  var editor = new toastui.Editor({
    el: document.querySelector("#editor"),
    height: "520px",
    initialEditType: "wysiwyg",
    previewStyle: "vertical",
    placeholder: "내용을 입력하세요.",
    hooks: {
      addImageBlobHook: function (blob, callback) {
        uploadBlob(blob, function (res) {
          callback(res.url, "image");
          setTimeout(function () {
            wrapNewestInsertedImage(res.url);
          }, 0);
        });
      }
    }
  });

  // ===== edit 초기 본문/값 =====
  if (mode === "edit") {
    var initContentEl = document.getElementById("initContent");
    if (initContentEl) {
      var htmlInit = initContentEl.value || "";
      if (htmlInit) editor.setHTML(htmlInit);
    }
    if (headSelect && window.__INIT_CATEGORY__) headSelect.value = String(window.__INIT_CATEGORY__);
  }

  // 업로드된 이미지 메타(JSON)
  var uploadedImages = [];

  // ✅ 업로드: QNA 전용 (/qna/upload)
  function uploadBlob(blob, done) {
    var tk = getTempKey();
    if (!tk) { alert("연결이 올바르지 않습니다. 다시 시도해 주세요."); return; }

    var fd = new FormData();
    fd.append("file", blob);
    fd.append("tempKey", tk);
    fd.append("boardType", boardType);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", ctx + "/qna/upload", true);

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
            done(res);
            return;
          }
        }
      } catch (e) {}
      alert("이미지 업로드에 실패했습니다.");
    };

    xhr.onerror = function () {
      alert("이미지 업로드에 실패했습니다.");
    };

    xhr.send(fd);
  }

  // ===== 이미지 래퍼 가공 (CommunityForm.js와 동일한 유틸) =====
  function wrapNewestInsertedImage(url) {
    try {
      var root = editor.getRootElement ? editor.getRootElement() : document.querySelector("#editor");
      if (!root) return;

      var imgs = root.querySelectorAll('img[src="' + cssEscape(url) + '"]');
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

      target.classList.add("hsf-img");
      var parent = target.parentNode;
      parent.insertBefore(wrap, target);
      wrap.appendChild(target);

      if (wrap.nextSibling && wrap.nextSibling.nodeName !== "P") {
        var p = document.createElement("p");
        p.innerHTML = "<br/>";
        parent.insertBefore(p, wrap.nextSibling);
      }
    } catch (e) {}
  }

  function cssEscape(s){
    return String(s).replace(/"/g, '\\"');
  }

  // ===== 첨부파일 가공 (비이미지만 남김) =====
  var attachInput = document.getElementById("attachFiles");
  var fileListEl = document.getElementById("fileList");

  function isImageFile(file) {
    if (!file) return false;
    var t = (file.type || "").toLowerCase();
    if (t.indexOf("image/") === 0) return true;
    var name = (file.name || "").toLowerCase();
    return (name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png") || name.endsWith(".gif") || name.endsWith(".webp"));
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
  }

  function renderFileList(allFiles) {
    if (!fileListEl) return;
    if (!allFiles || allFiles.length === 0) {
      fileListEl.style.display = "none";
      return;
    }
    var html = "";
    for (var i = 0; i < allFiles.length; i++) {
        var f = allFiles[i];
        html += '<div class="file-item">' + escapeHtml(f.name) + ' (' + (isImageFile(f) ? "본문 삽입" : "첨부") + ')</div>';
    }
    fileListEl.innerHTML = html;
    fileListEl.style.display = "";
  }

  function keepOnlyNonImageFilesOnInput(files) {
    var dt;
    try { dt = new DataTransfer(); } catch (e) { return; }
    for (var i = 0; i < files.length; i++) {
      if (!isImageFile(files[i])) dt.items.add(files[i]);
    }
    attachInput.files = dt.files;
  }

  if (attachInput) {
    attachInput.addEventListener("change", function () {
      var files = attachInput.files;
      if (!files) return;
      renderFileList(files);
      for (var i = 0; i < files.length; i++) {
        (function (f) {
          if (!isImageFile(f)) return;
          uploadBlob(f, function (res) {
            insertResizableImageAtCursor(res.url);
          });
        })(files[i]);
      }
      keepOnlyNonImageFilesOnInput(files);
    });
  }

  function insertResizableImageAtCursor(url) {
    editor.focus();
    var html = '<span class="hsf-img-wrap" data-hsf-img="1" style="width:480px;"><img class="hsf-img" src="' + url + '" alt="image" /></span><p></p>';
    var cm = editor.getCurrentModeEditor && editor.getCurrentModeEditor();
    if (cm && cm.insertHTML) { cm.insertHTML(html); return; }
    editor.setHTML(editor.getHTML() + "<p>" + html + "</p>");
  }

  // ===== 해시태그 =====
  var MAX_TAGS = 10;
  var tags = [];
  var tagInput = document.getElementById("tagInput");
  var tagChips = document.getElementById("tagChips");
  var tagSuggest = document.getElementById("tagSuggest");
  var tagsHidden = document.getElementById("tagsHidden");

  function setTagsHidden(){
    if (tagsHidden) tagsHidden.value = tags.join(",");
  }

  function renderChips(){
    if (!tagChips) return;
    var html = "";
    for(var i=0;i<tags.length;i++){
      html += '<span class="tag-chip" data-idx="'+i+'"><span>' + escapeHtml(tags[i]) + '</span><button type="button" class="tag-del">×</button></span>';
    }
    tagChips.innerHTML = html;
    setTagsHidden();
  }

  if (mode === "edit" && tagsHidden && tagsHidden.value) {
    tags = tagsHidden.value.split(",").filter(function(t){ return t.trim().length > 0; });
    renderChips();
  }

  function addTag(raw){
    if(tags.length >= MAX_TAGS) { alert("최대 " + MAX_TAGS + "개까지만 가능합니다."); return; }
    var t = raw.trim();
    if(!t) return;
    if(t.charAt(0) !== "#") t = "#" + t;
    if(tags.indexOf(t) !== -1) return;
    tags.push(t);
    renderChips();
  }

  function removeTag(idx){
    tags.splice(idx, 1);
    renderChips();
  }

  if (tagInput) {
    tagInput.addEventListener("keydown", function (e) {
      if (e.keyCode === 13 || e.keyCode === 188) {
        e.preventDefault();
        addTag(tagInput.value);
        tagInput.value = "";
        tagSuggest.style.display = "none";
      } else if (e.keyCode === 8 && !tagInput.value && tags.length > 0) {
        removeTag(tags.length - 1);
      }
    });

    tagInput.addEventListener("input", function() {
        var q = tagInput.value.trim().replace("#", "");
        if(!q) { tagSuggest.style.display = "none"; return; }
        
        var xhr = new XMLHttpRequest();
        xhr.open("GET", suggestUrl + "?q=" + encodeURIComponent(q), true);
        xhr.onload = function() {
            if(xhr.status === 200) {
                var items = JSON.parse(xhr.responseText || "[]");
                if(items.length > 0) {
                    var html = "";
                    items.forEach(function(it){
                        html += '<div class="tag-suggest-item" data-tag="'+it+'">'+escapeHtml(it)+'</div>';
                    });
                    tagSuggest.innerHTML = html;
                    tagSuggest.style.display = "block";
                } else {
                    tagSuggest.style.display = "none";
                }
            }
        };
        xhr.send();
    });
  }

  if (tagSuggest) {
    tagSuggest.addEventListener("mousedown", function(e) {
        if(e.target.classList.contains("tag-suggest-item")) {
            addTag(e.target.getAttribute("data-tag"));
            tagInput.value = "";
            tagSuggest.style.display = "none";
            e.preventDefault();
        }
    });
  }

  if (tagChips) {
    tagChips.addEventListener("click", function(e) {
        if(e.target.classList.contains("tag-del")) {
            var idx = e.target.parentNode.getAttribute("data-idx");
            removeTag(idx);
        }
    });
  }

  // ===== 제출 시 데이터 정리 =====
  var form = document.getElementById("writeForm");
  var contentHtmlEl = document.getElementById("contentHtml");

  if(form){
    form.addEventListener("submit", function(e){
      if (mode === "edit" && !isOwner) { alert("권한이 없습니다."); e.preventDefault(); return; }

      var html = editor.getHTML();
      if(!html || html.replace(/<[^>]*>/g, "").trim().length === 0){
        alert("내용을 입력해 주세요.");
        e.preventDefault();
        return;
      }

      // 이미지 래퍼 정규화 (서버 저장 전 래퍼 제거 및 스타일 고정)
      var wrapper = document.createElement("div");
      wrapper.innerHTML = html;
      var wraps = wrapper.querySelectorAll('.hsf-img-wrap');
      wraps.forEach(function(w){
          var img = w.querySelector("img");
          if(img) {
              img.style.width = w.style.width || "480px";
              w.parentNode.insertBefore(img, w);
          }
          w.parentNode.removeChild(w);
      });
      
      if(contentHtmlEl) contentHtmlEl.value = wrapper.innerHTML;
      setTagsHidden();

      if (!getTempKey()) {
        alert("오류가 발생했습니다. 다시 시도해 주세요.");
        e.preventDefault();
      }
    });
  }
})();
