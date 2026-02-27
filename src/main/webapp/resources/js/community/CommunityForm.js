(function () {
  var ctx = window.__CTX__ || "";
  var suggestUrl = window.__HASHTAG_SUGGEST_URL__ || (ctx + "/community/hashtag/suggest");

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
  var boardType = (boardTypeEl && boardTypeEl.value) ? boardTypeEl.value : "G";

  var typeSelect = document.getElementById("typeSelect");
  if (typeSelect) typeSelect.value = boardType;

  // ===== 게시판 선택 정책 =====
  // - 커뮤니티(insert)에서만 G/T/S 변경 가능 + Q/A 노출 X
  // - QnA(Q/A)에서는 변경 불가(기존 유지)
  // - edit에서는 변경 불가
  var isQnaContext = (boardType === "Q" || boardType === "A");
  var canChangeType = (mode === "insert" && !isQnaContext);

  if (typeSelect && canChangeType) {
    // 커뮤니티 insert: Q/A 옵션 제거
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

  //===== 거래 UI 토글 =====
  var tradeBox = document.getElementById("tradeBox");
  var priceInput = document.getElementById("price");
  var tradeStatusEl = document.getElementById("tradeStatus");

  function toggleTradeUI() {
    var isTrade = (boardType === "T" || boardType === "S");

    if (tradeBox) tradeBox.style.display = isTrade ? "" : "none";

    if (priceInput) {
      priceInput.required = (boardType === "T");
      priceInput.disabled = !isTrade;
      if (!isTrade) priceInput.value = "";
    }

    if (tradeStatusEl) {
      tradeStatusEl.disabled = !isTrade;
      if (!isTrade) tradeStatusEl.value = "";
    }
  }
  toggleTradeUI();

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
    var tradeStatusEl2 = document.getElementById("tradeStatus");
    if (tradeStatusEl2 && window.__INIT_TRADE_STATUS__) tradeStatusEl2.value = String(window.__INIT_TRADE_STATUS__);
  }

  // 업로드된 이미지 메타(JSON)
  var uploadedImages = [];
  var uploadedImagesJsonEl = document.getElementById("uploadedImagesJson");
  function setUploadedImagesHidden() {
    if (uploadedImagesJsonEl) uploadedImagesJsonEl.value = JSON.stringify(uploadedImages);
  }

  // ✅ 업로드: 컨트롤러가 요구(file,tempKey,boardType)
  function uploadBlob(blob, done) {
    var tk = getTempKey();
    if (!tk) { alert("tempKey가 없습니다. (/community/form에서 tempKey를 내려줘야 합니다)"); return; }

    var fd = new FormData();
    fd.append("file", blob);
    fd.append("tempKey", tk);
    fd.append("boardType", boardType);

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
      alert("이미지 업로드에 실패했습니다.");
    };

    xhr.onerror = function () {
      alert("이미지 업로드에 실패했습니다.");
    };

    xhr.send(fd);
  }

  // ===== 리사이즈 가능한 래퍼 삽입 =====
  function insertResizableImageAtCursor(url) {
    editor.focus();

    var initWidthPx = 480;
    var html =
      '<span class="hsf-img-wrap" data-hsf-img="1" style="width:' + initWidthPx + 'px;">' +
      '  <img class="hsf-img" src="' + url + '" alt="image" />' +
      '</span>' +
      '<p></p>';

    var cm = editor.getCurrentModeEditor && editor.getCurrentModeEditor();
    if (cm && cm.insertHTML) {
      cm.insertHTML(html);
      return;
    }

    var current = editor.getHTML() || "";
    editor.setHTML(current + "<p>" + html + "</p>");
  }

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

  // ===== 첨부파일: 이미지 자동업로드 + 비이미지 파일만 남기기 =====
  var attachInput = document.getElementById("attachFiles");
  var fileListEl = document.getElementById("fileList");

  function endsWith(str, suffix){
    return str && suffix && str.indexOf(suffix, str.length - suffix.length) !== -1;
  }

  function isImageFile(file) {
    if (!file) return false;
    var t = (file.type || "").toLowerCase();
    if (t.indexOf("image/") === 0) return true;

    var name = (file.name || "").toLowerCase();
    return (endsWith(name, ".jpg") || endsWith(name, ".jpeg") || endsWith(name, ".png") || endsWith(name, ".gif") || endsWith(name, ".webp"));
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
      if (!files || files.length === 0) {
        renderFileList([]);
        return;
      }

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

  // ===== 해시태그(띄어쓰기 비허용) =====
  var MAX_TAGS = 10;
  var tags = [];

  var tagInput = document.getElementById("tagInput");
  var tagChips = document.getElementById("tagChips");
  var tagSuggest = document.getElementById("tagSuggest");
  var tagsHidden = document.getElementById("tagsHidden");

  var SUGGEST_POOL = [
    "#플랜테리어","#봄","#홈가드닝","#식물집사","#초보식집사","#다육이","#분갈이",
    "#중고거래","#나눔","#질문","#답변","#햇빛","#물주기","#병충해","#영양제"
  ];

  function normalizeTag(raw){
    if(!raw) return "";
    // ✅ 공백 포함이면 거부
    if (/\s/.test(raw)) return "";

    var t = raw.trim();
    if(!t) return "";
    if(t.charAt(0) !== "#") t = "#" + t;
    t = t.replace(/#+/g, "#");
    if(t === "#") return "";
    if(t.length > 20) t = t.substring(0, 20);
    return t;
  }

  function setTagsHidden(){
    if (tagsHidden) tagsHidden.value = tags.join(",");
  }

  function renderChips(){
    if (!tagChips) return;
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

  if (mode === "edit" && tagsHidden && tagsHidden.value) {
    var parts = tagsHidden.value.split(",");
    for (var ti = 0; ti < parts.length; ti++) {
      var t0 = normalizeTag(parts[ti]);
      if (t0) tags.push(t0);
    }
    renderChips();
  }

  function addTag(raw){
    if(tags.length >= MAX_TAGS){
      alert("해시태그는 최대 " + MAX_TAGS + "개까지 가능합니다.");
      return;
    }

    if (/\s/.test(raw || "")) {
      alert("해시태그에는 띄어쓰기를 사용할 수 없습니다.");
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
    if (!tagSuggest) return;
    tagSuggest.style.display = "none";
    tagSuggest.innerHTML = "";
  }

  function openSuggest(items){
    if(!tagSuggest) return;

    if(!items || items.length === 0){
      tagSuggest.innerHTML = '<div class="tag-suggest-empty">추천 결과가 없습니다.</div>';
      tagSuggest.style.display = "";
      return;
    }

    var html = "";
    for(var i=0;i<items.length;i++){
      html += '<div class="tag-suggest-item" data-tag="' + escapeHtml(items[i]) + '">';
      html += '  <div>' + escapeHtml(items[i]) + '</div>';
      html += '  <div class="muted">추천</div>';
      html += '</div>';
    }
    tagSuggest.innerHTML = html;
    tagSuggest.style.display = "";
  }

  function getQuery(){
    if(!tagInput) return "";
    var v = (tagInput.value || "").trim();
    if(v.charAt(0) === "#") v = v.substring(1);
    return v.trim();
  }

  var suggestTimer = null;
  var lastReqId = 0;

  function debounceSuggest(){
    if (suggestTimer) clearTimeout(suggestTimer);
    suggestTimer = setTimeout(function(){
      updateSuggest();
    }, 180);
  }

  function filterOutExisting(items){
    var out = [];
    for(var i=0;i<items.length;i++){
      var cand = normalizeTag(items[i]);
      if(!cand) continue;

      var exists = false;
      for(var j=0;j<tags.length;j++){
        if(tags[j].toLowerCase() === cand.toLowerCase()){ exists = true; break; }
      }
      if(exists) continue;

      out.push(cand);
      if(out.length >= 10) break;
    }
    return out;
  }

  function fallbackSuggest(q){
    var qLower = q.toLowerCase();
    var out = [];
    for(var i=0;i<SUGGEST_POOL.length;i++){
      var cand = SUGGEST_POOL[i];
      var candRaw = cand.charAt(0)==="#" ? cand.substring(1) : cand;
      if(candRaw.toLowerCase().indexOf(qLower) !== 0) continue;
      out.push(cand);
      if(out.length >= 10) break;
    }
    return out;
  }

  function fetchSuggestFromServer(q, cb){
    if(!suggestUrl){ cb(fallbackSuggest(q)); return; }

    var reqId = ++lastReqId;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", suggestUrl + "?q=" + encodeURIComponent(q), true);

    xhr.onreadystatechange = function(){
      if(xhr.readyState !== 4) return;
      if(reqId !== lastReqId) return;

      if(xhr.status >= 200 && xhr.status < 300){
        try{
          var arr = JSON.parse(xhr.responseText || "[]");
          if(Object.prototype.toString.call(arr) === "[object Array]"){
            cb(arr);
            return;
          }
        }catch(e){}
      }
      cb(fallbackSuggest(q));
    };

    xhr.onerror = function(){
      if(reqId !== lastReqId) return;
      cb(fallbackSuggest(q));
    };

    xhr.send(null);
  }

  function updateSuggest(){
    var q = getQuery();
    if(!q){ closeSuggest(); return; }

    fetchSuggestFromServer(q, function(serverItems){
      if(serverItems && serverItems.length){
        openSuggest(filterOutExisting(serverItems));
      } else {
        openSuggest(filterOutExisting(fallbackSuggest(q)));
      }
    });
  }

  if(tagInput){
    tagInput.addEventListener("input", function(){ debounceSuggest(); });

    tagInput.addEventListener("keydown", function(e){
      var key = e.keyCode;

      if(key === 8 && !tagInput.value && tags.length > 0){
        removeTag(tags.length - 1);
        return;
      }

      // ✅ 스페이스 입력 자체 차단
      if (key === 32) {
        e.preventDefault();
        return;
      }

      // Enter / 콤마로 추가
      if(key === 13 || key === 188){
        if(e.isComposing) return;
        e.preventDefault();
        var raw = (tagInput.value || "").replace(/,/g,"").trim();
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
      while(target && target !== tagSuggest && !(target.className && target.className.indexOf("tag-suggest-item") !== -1)){
        target = target.parentNode;
      }
      if(!target || target === tagSuggest) return;

      var tag = target.getAttribute("data-tag");
      addTag(tag);
      if(tagInput) tagInput.value = "";
      closeSuggest();
      e.preventDefault();
    });
  }

  if(tagChips){
    tagChips.addEventListener("click", function(e){
      if(!(e.target && e.target.classList && e.target.classList.contains("tag-del"))) return;
      var chip = e.target.parentNode;
      var idx = parseInt(chip.getAttribute("data-idx"), 10);
      if(!isNaN(idx)) removeTag(idx);
    });
  }

  // ===== 저장 직전: 래퍼 제거 + img width(px) 고정 =====
  function normalizeResizableImages(html) {
    var wrapper = document.createElement("div");
    wrapper.innerHTML = html;

    var wraps = wrapper.querySelectorAll('span.hsf-img-wrap[data-hsf-img="1"]');
    for (var i = 0; i < wraps.length; i++) {
      var w = wraps[i];
      var img = w.querySelector("img");
      if (!img) continue;

      var width = 0;
      try { width = w.getBoundingClientRect().width; } catch (e) { width = 0; }
      if (width && width > 0) {
        img.style.width = Math.round(width) + "px";
        img.style.height = "auto";
      }

      w.parentNode.insertBefore(img, w);
      w.parentNode.removeChild(w);
    }

    return wrapper.innerHTML;
  }

  // ===== submit: contentHtml/tagsHidden 세팅 =====
  var form = document.getElementById("writeForm");
  var contentHtmlEl = document.getElementById("contentHtml");

  if (mode === "edit" && !isOwner && form) {
    form.addEventListener("submit", function (e) {
      alert("작성자만 수정할 수 있습니다.");
      e.preventDefault();
    });
  }

  if(form){
    form.addEventListener("submit", function(e){
      if (mode === "edit" && !isOwner) { e.preventDefault(); return; }

      var html = editor.getHTML();
      if(!html || html.replace(/<[^>]*>/g, "").trim().length === 0){
        alert("본문을 입력해 주세요.");
        e.preventDefault();
        return;
      }

      html = normalizeResizableImages(html);
      if(contentHtmlEl) contentHtmlEl.value = html;

      setTagsHidden();

      // tempKey 존재 체크(업로드 묶음)
      if (!getTempKey()) {
        alert("tempKey가 없습니다. 페이지를 새로고침 후 다시 시도해 주세요.");
        e.preventDefault();
        return;
      }

      if(headSelect && !headSelect.value && (boardType === "T" || boardType === "S")){
        alert("거래/나눔 게시판은 말머리를 선택해 주세요.");
        e.preventDefault();
        return;
      }
    });
  }
})();