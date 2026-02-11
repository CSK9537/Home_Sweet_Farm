/* CommunityInsert.js (ES5) */
(function () {
  var ctx = window.__CTX__ || "";

  // ===== type 자동 결정 =====
  var boardTypeEl = document.getElementById("boardType");
  var boardType = (boardTypeEl && boardTypeEl.value) ? boardTypeEl.value : "G";

  var typeSelect = document.getElementById("typeSelect");
  if (typeSelect) typeSelect.value = boardType;

  // ===== 거래 UI 토글 =====
  var tradeBox = document.getElementById("tradeBox");
  var priceInput = document.getElementById("price");
  function toggleTradeUI() {
    var isTrade = (boardType === "T" || boardType === "S");
    tradeBox.style.display = isTrade ? "" : "none";
    if (priceInput) priceInput.required = (boardType === "T");
  }
  toggleTradeUI();

  // ===== 말머리 필터링 =====
  var headSelect = document.getElementById("headSelect");
  function filterHeads() {
    if (!headSelect) return;
    var opts = headSelect.options;
    var i, df, allow;

    for (i = 0; i < opts.length; i++) {
      df = opts[i].getAttribute("data-for");
      if (!df) { opts[i].hidden = false; continue; }
      allow = (("," + df + ",").indexOf("," + boardType + ",") !== -1);
      opts[i].hidden = !allow;
    }

    if (boardType === "T" || boardType === "S") {
      if (opts.length > 0 && opts[0].value === "") opts[0].hidden = true;
      if (!headSelect.value) {
        for (i = 0; i < opts.length; i++) {
          if (!opts[i].hidden && opts[i].value) { headSelect.value = opts[i].value; break; }
        }
      }
    } else {
      if (opts.length > 0 && opts[0].value === "") opts[0].hidden = false;
    }

    if (boardType === "A") {
      for (i = 0; i < opts.length; i++) {
        if (!opts[i].hidden && opts[i].value === "501") { headSelect.value = "501"; break; }
      }
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
        });
      }
    }
  });

  // 업로드된 이미지 메타를 hidden(JSON)로 유지 (서버에서 글 저장 시 매핑용)
  var uploadedImages = [];
  var uploadedImagesJsonEl = document.getElementById("uploadedImagesJson");

  function setUploadedImagesHidden() {
    if (uploadedImagesJsonEl) {
      uploadedImagesJsonEl.value = JSON.stringify(uploadedImages);
    }
  }

  function uploadBlob(blob, done) {
    var fd = new FormData();
    fd.append("file", blob);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", ctx + "/community/upload", true);

    xhr.onload = function () {
      try {
        if (xhr.status >= 200 && xhr.status < 300) {
          var res = JSON.parse(xhr.responseText || "{}");
          if (res && res.url) {
            // 메타 저장(서버가 url만 줘도 괜찮음)
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
      alert("이미지 업로드에 실패했습니다.");
    };

    xhr.onerror = function () {
      alert("이미지 업로드에 실패했습니다.");
    };

    xhr.send(fd);
  }

  function appendImageToEditor(url) {
    var current = editor.getHTML() || "";
    var add = '<p><img src="' + url + '" alt="image" /></p>';
    editor.setHTML(current + add);
  }

  // ===== 첨부파일: 이미지 자동업로드 + "비이미지 파일만" input에 남기기 =====
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
    return String(s)
      .replace(/&/g,"&amp;").replace(/</g,"&lt;")
      .replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
  }

  function renderFileList(allFiles) {
    if (!fileListEl) return;
    if (!allFiles || allFiles.length === 0) {
      fileListEl.style.display = "none";
      fileListEl.innerHTML = "";
      return;
    }

    var html = "";
    for (var i = 0; i < allFiles.length; i++) {
      var f = allFiles[i];
      html += '<div class="file-item">';
      html += '  <div class="file-item__name">' + escapeHtml(f.name) + '</div>';
      html += '  <div class="file-item__tag">' + (isImageFile(f) ? "이미지(본문삽입)" : "첨부") + '</div>';
      html += '</div>';
    }
    fileListEl.innerHTML = html;
    fileListEl.style.display = "";
  }

  function keepOnlyNonImageFilesOnInput(files) {
    // DataTransfer로 "비이미지 파일만" 다시 세팅 (중복 업로드 방지 핵심)
    var dt;
    try {
      dt = new DataTransfer();
    } catch (e) {
      // 일부 구형 브라우저 예외(요즘 크롬/엣지는 OK)
      return;
    }

    for (var i = 0; i < files.length; i++) {
      if (!isImageFile(files[i])) {
        dt.items.add(files[i]);
      }
    }
    attachInput.files = dt.files;
  }

  if (attachInput) {
    attachInput.addEventListener("change", function () {
      var files = attachInput.files;
      if (!files || files.length === 0) {
        renderFileList([]);
        return;
      }

      // 화면 목록은 "선택한 전체 파일" 기준으로 표시
      renderFileList(files);

      // 이미지 파일만 업로드 후 본문 삽입
      for (var i = 0; i < files.length; i++) {
        (function (f) {
          if (!isImageFile(f)) return;
          uploadBlob(f, function (res) {
            appendImageToEditor(res.url);
          });
        })(files[i]);
      }

      // ★ submit 때 중복 업로드 방지: input에는 비이미지 파일만 남김
      keepOnlyNonImageFilesOnInput(files);
    });
  }

  // ===== 해시태그(추천 + 칩 + 최대 10개) =====
  var SUGGEST_POOL = [
    "플랜테리어","봄","홈가드닝","식물집사","초보식집사","다육이","분갈이",
    "중고거래","나눔","질문","답변","햇빛","물주기","병충해","영양제"
  ];
  var MAX_TAGS = 10;
  var tags = [];

  var tagInput = document.getElementById("tagInput");
  var tagChips = document.getElementById("tagChips");
  var tagSuggest = document.getElementById("tagSuggest");
  var tagsHidden = document.getElementById("tagsHidden");

  function normalizeTag(raw){
    if(!raw) return "";
    var t = raw.trim();
    if(t.charAt(0) !== "#") t = "#" + t;
    t = t.replace(/\s+/g, "");
    t = t.replace(/#+/g, "#");
    if(t === "#") return "";
    if(t.length > 20) t = t.substring(0, 20);
    return t;
  }

  function setTagsHidden(){
    if (tagsHidden) tagsHidden.value = tags.join(",");
  }

  function renderChips(){
    var html = "";
    for(var i=0;i<tags.length;i++){
      html += '<span class="tag-chip" data-idx="'+i+'">';
      html += '  <span>' + escapeHtml(tags[i]) + '</span>';
      html += '  <button type="button" class="tag-del" aria-label="delete">×</button>';
      html += '</span>';
    }
    tagChips.innerHTML = html;
    setTagsHidden();
  }

  function addTag(raw){
    if(tags.length >= MAX_TAGS){
      alert("해시태그는 최대 " + MAX_TAGS + "개까지 가능합니다.");
      return;
    }
    var t = normalizeTag(raw);
    if(!t) return;

    var lower = t.toLowerCase();
    for(var i=0;i<tags.length;i++){
      if(tags[i].toLowerCase() === lower) return;
    }
    tags.push(t);
    renderChips();
  }

  function removeTag(idx){
    tags.splice(idx, 1);
    renderChips();
  }

  function closeSuggest(){
    tagSuggest.style.display = "none";
    tagSuggest.innerHTML = "";
  }

  function openSuggest(items){
    if(!items || items.length === 0){ closeSuggest(); return; }
    var html = "";
    for(var i=0;i<items.length;i++){
      html += '<div class="tag-suggest-item" data-tag="' + escapeHtml(items[i]) + '">';
      html += '  <div>#' + escapeHtml(items[i]) + '</div>';
      html += '  <div class="muted">추천</div>';
      html += '</div>';
    }
    tagSuggest.innerHTML = html;
    tagSuggest.style.display = "";
  }

  function getQuery(){
    var v = (tagInput.value || "").trim();
    if(v.charAt(0)==="#") v = v.substring(1);
    return v.trim();
  }

  function updateSuggest(){
    var q = getQuery();
    if(!q){ closeSuggest(); return; }

    var out = [];
    var qLower = q.toLowerCase();
    for(var i=0;i<SUGGEST_POOL.length;i++){
      var cand = SUGGEST_POOL[i];
      if(cand.toLowerCase().indexOf(qLower) !== 0) continue;

      var exists = false;
      for(var j=0;j<tags.length;j++){
        if(tags[j].toLowerCase() === ("#" + cand).toLowerCase()){ exists = true; break; }
      }
      if(exists) continue;

      out.push(cand);
      if(out.length >= 10) break;
    }
    openSuggest(out);
  }

  if(tagInput){
    tagInput.addEventListener("input", function(){ updateSuggest(); });

    tagInput.addEventListener("keydown", function(e){
      var key = e.keyCode;

      if(key === 8 && !tagInput.value && tags.length > 0){
        removeTag(tags.length - 1);
        return;
      }

      if(key === 13 || key === 188 || key === 32){
        if(e.isComposing) return;
        e.preventDefault();
        var raw = tagInput.value.replace(/,/g,"").trim();
        addTag(raw);
        tagInput.value = "";
        closeSuggest();
      }

      if(key === 27) closeSuggest();
    });

    tagInput.addEventListener("blur", function(){
      setTimeout(closeSuggest, 150);
    });
  }

  if(tagSuggest){
    tagSuggest.addEventListener("mousedown", function(e){
      var target = e.target;
      while(target && target !== tagSuggest && !target.classList.contains("tag-suggest-item")){
        target = target.parentNode;
      }
      if(!target || target === tagSuggest) return;

      var tag = target.getAttribute("data-tag");
      addTag(tag);
      tagInput.value = "";
      closeSuggest();
      e.preventDefault();
    });
  }

  if(tagChips){
    tagChips.addEventListener("click", function(e){
      if(!e.target.classList.contains("tag-del")) return;
      var chip = e.target.parentNode;
      var idx = parseInt(chip.getAttribute("data-idx"), 10);
      if(!isNaN(idx)) removeTag(idx);
    });
  }

  // ===== Submit: editor HTML hidden + 타입 검증 =====
  var form = document.getElementById("writeForm");
  var contentHtmlEl = document.getElementById("contentHtml");
  var titleEl = document.getElementById("title");

  if(form){
    form.addEventListener("submit", function(e){
      if(boardType === "A"){
        var parentId = document.getElementById("parentId").value;
        if(!parentId){
          alert("답글 작성은 질문글 번호(parentId)가 필요합니다.");
          e.preventDefault();
          return;
        }
        if(titleEl && !titleEl.value) titleEl.value = "답변";
      }

      var html = editor.getHTML();
      if(!html || html.replace(/<[^>]*>/g, "").trim().length === 0){
        alert("본문을 입력해 주세요.");
        e.preventDefault();
        return;
      }
      contentHtmlEl.value = html;
    });
  }
})();
