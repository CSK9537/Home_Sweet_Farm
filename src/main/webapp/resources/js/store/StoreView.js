// StoreView.js
(function () {
  function qs(id) { return document.getElementById(id); }

  function addClass(el, c){
    if(!el) return;
    if(el.className.indexOf(c) === -1){
      el.className = (el.className + " " + c).replace(/\s+/g," ").trim();
    }
  }
  function removeClass(el, c){
    if(!el) return;
    el.className = el.className.replace(new RegExp("\\b"+c+"\\b","g"), "").replace(/\s+/g," ").trim();
  }

  // -----------------------------
  // 갤러리
  // -----------------------------
  function getThumbButtons() {
    var wrap = qs("thumbs");
    if (!wrap) return [];
    var buttons = wrap.getElementsByTagName("button");
    return buttons || [];
  }

  function setActiveThumb(buttons, idx) {
    for (var i = 0; i < buttons.length; i++) {
      if (i === idx) addClass(buttons[i], "thumb--active");
      else removeClass(buttons[i], "thumb--active");
    }
  }

  function setMainImage(src) {
    var img = qs("mainImage");
    var dummy = qs("mainDummy");
    if (!img) return;

    if (src && src !== "") {
      img.src = src;
      img.style.display = "block";
      if (dummy) dummy.style.display = "none";
    } else {
      img.removeAttribute("src");
      img.style.display = "none";
      if (dummy) dummy.style.display = "flex";
    }
  }

  function bindGallery() {
    var buttons = getThumbButtons();
    var prev = qs("btnPrev");
    var next = qs("btnNext");

    if (!buttons || buttons.length === 0) return;

    var idx = 0;

    for (var i = 0; i < buttons.length; i++) {
      (function (i2) {
        buttons[i2].onclick = function () {
          idx = i2;
          setActiveThumb(buttons, idx);
          setMainImage(buttons[idx].getAttribute("data-src") || "");
        };
      })(i);
    }

    if (prev) {
      prev.onclick = function () {
        idx = (idx - 1 + buttons.length) % buttons.length;
        setActiveThumb(buttons, idx);
        setMainImage(buttons[idx].getAttribute("data-src") || "");
      };
    }
    if (next) {
      next.onclick = function () {
        idx = (idx + 1) % buttons.length;
        setActiveThumb(buttons, idx);
        setMainImage(buttons[idx].getAttribute("data-src") || "");
      };
    }
  }

  // -----------------------------
  // 카드 클릭
  // -----------------------------
  function bindCardClicks() {
    var cards = document.querySelectorAll(".js-card");
    if (!cards || cards.length === 0) return;
    for (var i = 0; i < cards.length; i++) {
      cards[i].onclick = function () {
        var href = this.getAttribute("data-href");
        if (href) location.href = href;
      };
    }
  }

  // -----------------------------
  // 모달 공통
  // -----------------------------
  function openModal(modalId){
    var m = qs(modalId);
    if(!m) return;
    addClass(m, "is-open");
    m.setAttribute("aria-hidden", "false");
    addClass(document.body, "modal-open");
  }
  function closeModal(modalId){
    var m = qs(modalId);
    if(!m) return;
    removeClass(m, "is-open");
    m.setAttribute("aria-hidden", "true");

    var anyOpen =
      (qs("descModal") && qs("descModal").className.indexOf("is-open") !== -1) ||
      (qs("reviewModal") && qs("reviewModal").className.indexOf("is-open") !== -1) ||
      (qs("writeReviewModal") && qs("writeReviewModal").className.indexOf("is-open") !== -1);

    if(!anyOpen) removeClass(document.body, "modal-open");
  }

  // 제품설명 모달
  function bindDescModal() {
    var openBtn = qs("btnOpenDesc");
    var dim = qs("modalDim");
    var closeBtn = qs("btnCloseModal");

    if (openBtn) openBtn.onclick = function(){ openModal("descModal"); };
    if (dim) dim.onclick = function(){ closeModal("descModal"); };
    if (closeBtn) closeBtn.onclick = function(){ closeModal("descModal"); };
  }

  // -----------------------------
  // 리뷰 모달: 무한스크롤 + 필터/정렬(select)
  // -----------------------------
  var allReviews = [];
  var viewReviews = []; // 필터/정렬 적용된 배열
  var cursor = 0;
  var PAGE_SIZE = 4;

  function safeParseJson(text){
    try { return JSON.parse(text); } catch(e){ return []; }
  }

  function starText(rate){
    var r = parseFloat(rate || 0);
    var full = Math.round(r);
    var s = "";
    for(var i=1;i<=5;i++) s += (i<=full ? "★" : "☆");
    return s;
  }

  function escHtml(str){
    str = (str === null || str === undefined) ? "" : String(str);
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderReviewCard(r){
    var verified = r.verified ? '<span class="badge-verified">인증된 구매자</span>' : '';
    var imgsHtml = '';
    if(r.images && r.images.length){
      var hasAny = false;
      for(var k=0;k<r.images.length;k++){ if(r.images[k]){ hasAny = true; break; } }
      if(hasAny){
        imgsHtml += '<div class="review-card__imgs">';
        for(var i=0;i<r.images.length;i++){
          if(!r.images[i]) continue;
          imgsHtml += '<img class="review-img" src="'+ escHtml(r.images[i]) +'" alt="리뷰 이미지" />';
        }
        imgsHtml += '</div>';
      }
    }

    return ''
      + '<article class="review-card">'
      +   '<div class="review-card__head">'
      +     '<div>'
      +       '<div class="review-card__title">'+ escHtml(r.title || '리뷰') +'</div>'
      +       '<div class="review-card__meta">'
      +         '<span>'+ escHtml(r.nickname || '') +'</span>'
      +         '<span>'+ escHtml(r.date || '') +'</span>'
      +         verified
      +       '</div>'
      +     '</div>'
      +     '<div class="review-card__rate">'+ starText(r.rate) +' <span style="margin-left:6px;">★ '+ escHtml(r.rate || '0.0') +'</span></div>'
      +   '</div>'
      +   '<div class="review-card__body">'+ escHtml(r.content || '') +'</div>'
      +   imgsHtml
      +   '<div class="review-card__helpful">'
      +     '<span>도움이 되었나요?</span>'
      +     '<button type="button" class="help-btn">네 ('+ escHtml(r.helpful || 0) +')</button>'
      +   '</div>'
      + '</article>';
  }

  function parseDateNum(yyyyMMdd){
    // "2026-02-12" -> 20260212
    if(!yyyyMMdd) return 0;
    return parseInt(String(yyyyMMdd).replace(/-/g,""), 10) || 0;
  }

  function applyFilterSort(){
    var ratingSel = qs("filterRating");
    var imgSel = qs("filterImage");
    var sortSel = qs("sortSelect");

    var minRate = (ratingSel && ratingSel.value !== "all") ? parseInt(ratingSel.value, 10) : 0;
    var imgOnly = (imgSel && imgSel.value === "only");
    var sort = (sortSel ? sortSel.value : "latest");

    // 필터
    var tmp = [];
    for(var i=0;i<allReviews.length;i++){
      var r = allReviews[i];
      var rateNum = parseFloat(r.rate || 0);

      if(minRate && rateNum < minRate) continue;

      if(imgOnly){
        var ok = false;
        if(r.images && r.images.length){
          for(var k=0;k<r.images.length;k++){
            if(r.images[k]) { ok = true; break; }
          }
        }
        if(!ok) continue;
      }

      tmp.push(r);
    }

    // 정렬
    tmp.sort(function(a,b){
      var da = parseDateNum(a.date);
      var db = parseDateNum(b.date);
      if(sort === "oldest") return da - db;
      return db - da; // latest
    });

    viewReviews = tmp;
  }

  function appendNext(){
    var list = qs("reviewFeedList");
    if(!list) return;

    var end = Math.min(cursor + PAGE_SIZE, viewReviews.length);
    var html = "";
    for(var i=cursor; i<end; i++){
      html += renderReviewCard(viewReviews[i]);
    }
    list.insertAdjacentHTML("beforeend", html);
    cursor = end;

    // 더 이상 없으면 스크롤로 추가 없음(버튼도 없음)
  }

  function resetAndRender(){
    var list = qs("reviewFeedList");
    if(list) list.innerHTML = "";

    cursor = 0;
    applyFilterSort();
    appendNext();
  }

  function bindInfiniteScroll(){
    var feed = qs("reviewFeedList");
    if(!feed) return;

    feed.addEventListener("scroll", function(){
      if(feed.scrollTop + feed.clientHeight >= feed.scrollHeight - 60){
        if(cursor < viewReviews.length) appendNext();
      }
    });
  }

  function bindFilterSortEvents(){
    var ratingSel = qs("filterRating");
    var imgSel = qs("filterImage");
    var sortSel = qs("sortSelect");

    function onChange(){
      resetAndRender();
    }

    if(ratingSel) ratingSel.onchange = onChange;
    if(imgSel) imgSel.onchange = onChange;
    if(sortSel) sortSel.onchange = onChange;
  }

  function bindReviewModal(){
    var openBtn = qs("btnOpenReviews");
    var dim = qs("reviewModalDim");
    var closeBtn = qs("btnCloseReviewModal");

    var jsonEl = qs("reviewJson");
    if(jsonEl){
      allReviews = safeParseJson(jsonEl.text || jsonEl.innerText || "[]");
    }

    if(openBtn){
      openBtn.onclick = function(){
        openModal("reviewModal");
        resetAndRender();
      };
    }
    if(dim) dim.onclick = function(){ closeModal("reviewModal"); };
    if(closeBtn) closeBtn.onclick = function(){ closeModal("reviewModal"); };

    bindInfiniteScroll();
    bindFilterSortEvents();
  }

  // -----------------------------
  // 상품평 쓰기 모달
  // -----------------------------
  function setStar(val){
    var box = qs("starInput");
    var txt = qs("starValueText");
    if(!box) return;

    box.setAttribute("data-value", String(val));
    if(txt) txt.innerText = (parseFloat(val)||0).toFixed(1);

    var stars = box.getElementsByClassName("star");
    for(var i=0;i<stars.length;i++){
      var v = parseInt(stars[i].getAttribute("data-v"), 10);
      if(v <= val) addClass(stars[i], "is-on");
      else removeClass(stars[i], "is-on");
    }
  }

  function bindWriteModal(){
    var openBtn = qs("btnOpenWriteReview");
    var dim = qs("writeReviewModalDim");
    var closeBtn = qs("btnCloseWriteReview");
    var cancelBtn = qs("btnCancelWriteReview");
    var submitBtn = qs("btnSubmitReview");

    if(openBtn){
      openBtn.onclick = function(){
        closeModal("reviewModal");
        openModal("writeReviewModal");
      };
    }
    if(dim) dim.onclick = function(){ closeModal("writeReviewModal"); };
    if(closeBtn) closeBtn.onclick = function(){ closeModal("writeReviewModal"); };
    if(cancelBtn) cancelBtn.onclick = function(){ closeModal("writeReviewModal"); };

    // 별점 클릭
    var starBox = qs("starInput");
    if(starBox){
      starBox.onclick = function(e){
        e = e || window.event;
        var t = e.target || e.srcElement;
        if(t && t.className.indexOf("star") !== -1){
          var v = parseInt(t.getAttribute("data-v"), 10);
          setStar(v);
        }
      };
      setStar(0);
    }

    // 이미지 미리보기
    var file = qs("reviewImages");
    var preview = qs("imgPreview");
    if(file && preview){
      file.onchange = function(){
        preview.innerHTML = "";
        var files = file.files;
        if(!files || !files.length) return;
        for(var i=0;i<files.length;i++){
          (function(f){
            var reader = new FileReader();
            reader.onload = function(ev){
              var img = document.createElement("img");
              img.src = ev.target.result;
              preview.appendChild(img);
            };
            reader.readAsDataURL(f);
          })(files[i]);
        }
      };
    }

    // 등록(뷰단용 검증만)
    if(submitBtn){
      submitBtn.onclick = function(){
        var box = qs("starInput");
        var starVal = box ? (parseInt(box.getAttribute("data-value"), 10) || 0) : 0;
        var terms = qs("chkTerms") && qs("chkTerms").checked;

        if(starVal <= 0){ alert("평점은 필수입니다."); return; }
        if(!terms){ alert("리뷰 작성 조항에 동의해주세요."); return; }

        alert("뷰단 확인용: 등록 완료(서버 연동 전)");
        closeModal("writeReviewModal");
      };
    }
  }

  // ESC 닫기
  function bindEsc(){
    document.onkeydown = function (e) {
      e = e || window.event;
      var key = e.keyCode || e.which;
      if (key === 27) {
        closeModal("writeReviewModal");
        closeModal("reviewModal");
        closeModal("descModal");
      }
    };
  }

  function init(){
    bindGallery();
    bindCardClicks();
    bindDescModal();
    bindReviewModal();
    bindWriteModal();
    bindEsc();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

// -----------------------------
// 장바구니/찜 (기존 기능 유지, ES5)
// -----------------------------
(function(){
  function safeOn(el, evt, fn){
    if(el && el.addEventListener) el.addEventListener(evt, fn);
  }

  function getVal(sel){
    var el = document.querySelector(sel);
    return el ? el.getAttribute("value") : null;
  }

  safeOn(document, "DOMContentLoaded", function(){
    var addCartBtn = document.querySelector("#addCart");
    var addWishBtn = document.querySelector("#addWish");

    safeOn(addCartBtn, "click", function(){
      var product_id = getVal("#product_id");
      if(!product_id) return;

      fetch("/store/cart/modifyCart/product/" + product_id + "?type=plus", {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      })
      .then(function(response){
        if(response.ok){
          if(confirm("장바구니에 담았습니다. 장바구니로 이동하시겠습니까?")) location.href="/store/cartPage";
        }else{
          alert("장바구니에 담지 못했습니다.");
        }
      })
      .catch(function(err){
        console.error(err);
      });
    });

    safeOn(addWishBtn, "click", function(){
      var product_id = getVal("#product_id");
      if(!product_id) return;

      fetch("/store/cart/addWish/product/" + product_id, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      })
      .then(function(response){
        if(response.ok){
          if(confirm("찜목록에 추가했습니다. 찜목록으로 이동하시겠습니까?")) location.href="/store/wishPage";
        }else{
          response.text().then(function(data){
            alert(data);
          });
        }
      })
      .catch(function(err){
        console.error(err);
      });
    });
  });
})();
