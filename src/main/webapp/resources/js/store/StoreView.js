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

  function starText(review_rate){
    var r = parseFloat(review_rate || 0);
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
    
    var images = r.images;
    if(typeof images === 'string'){
      images = images ? images.split(',') : [];
    } else if (Array.isArray(images) && images.length === 1 && images[0] && images[0].indexOf(',') !== -1) {
      // JSP에서 ["path1,path2"] 형태로 넘어오는 경우 대응
      images = images[0].split(',');
    }
    
    if(images && images.length){
      var hasAny = false;
      for(var k=0;k<images.length;k++){ if(images[k]){ hasAny = true; break; } }
      if(hasAny){
        imgsHtml += '<div class="review-card__imgs">';
        for(var i=0;i<images.length;i++){
          var src = images[i];
          if(!src) continue;
          
          // 이미 절대 경로(http)가 아니면 display 엔드포인트 사용
          if(src.indexOf('http') === -1){
            src = "/store/review/display?imgName=" + encodeURIComponent(src);
          }
          
          imgsHtml += '<img class="review-img" src="'+ escHtml(src) +'" alt="리뷰 이미지" />';
        }
        imgsHtml += '</div>';
      }
    }

    return ''
      + '<article class="review-card">'
      +   '<div class="review-card__head">'
      +     '<div>'
      +       '<div class="review-card__title">'+ escHtml(r.review_title || '리뷰') +'</div>'
      +       '<div class="review-card__meta">'
      +         '<span>'+ escHtml(r.nickname || '') +'</span>'
      +         '<span>'+ escHtml(r.review_date || '') +'</span>'
      +         verified
      +       '</div>'
      +     '</div>'
      +     '<div class="review-card__rate">'+ starText(r.review_rate) +' <span style="margin-left:6px;">★ '+ escHtml(r.review_rate || '0.0') +'</span></div>'
      +   '</div>'
      +   '<div class="review-card__body">'+ escHtml(r.review_content || '') +'</div>'
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

  function fetchAndRenderReviews(){
    var ratingSel = qs("filterRating");
    var imgSel = qs("filterImage");
    var sortSel = qs("sortBy"); // JSP ID와 일치시킴

    var rating = ratingSel ? ratingSel.value : "all";
    var img = imgSel ? imgSel.value : "all";
    var sort = sortSel ? sortSel.value : "latest";
    var productId = qs("reviewTitle").getAttribute("product_id");

    var url = "/store/review/get/product/" + productId 
            + "?sortBy=" + sort 
            + "&filterRating=" + rating 
            + "&filterImage=" + img;

    fetch(url)
      .then(function(res){ return res.json(); })
      .then(function(data){
        allReviews = data;
        viewReviews = data; // 서버에서 정렬/필터링 완료됨
        
        updateReviewStats(allReviews); // 통계 수치 업데이트

        var list = qs("reviewFeedList");
        if(list) list.innerHTML = "";
        cursor = 0;
        appendNext();
      })
      .catch(function(err){
        console.error("Failed to fetch reviews:", err);
      });
  }

  function updateReviewStats(reviews){
    var counts = { 1:0, 2:0, 3:0, 4:0, 5:0 };
    var total = reviews.length;
    
    for(var i=0; i<reviews.length; i++){
      var r = parseInt(reviews[i].review_rate || 0, 10);
      if(counts[r] !== undefined) counts[r]++;
    }

    var rows = document.querySelectorAll(".review-dist__row");
    // rows[0] = 5 star, rows[1] = 4 star ...
    for(var star=5; star>=1; star--){
      var idx = 5 - star;
      if(!rows[idx]) continue;
      
      var count = counts[star];
      var percent = total > 0 ? (count / total * 100) : 0;
      
      var numLabel = rows[idx].querySelector(".review-dist__num");
      var fillBar = rows[idx].querySelector(".review-dist__fill");
      
      if(numLabel) numLabel.innerText = count;
      if(fillBar) fillBar.style.width = percent + "%";
    }
    
    // 평균 평점 및 개수 텍스트 업데이트 (Aside 영역)
    var asideRate = qs(".review-aside__rate-num");
    var asideCount = qs(".review-aside__count");
    if(asideRate || asideCount){
        var sum = 0;
        for(var i=0; i<reviews.length; i++) sum += parseFloat(reviews[i].review_rate || 0);
        var avg = total > 0 ? (sum / total).toFixed(1) : "0.0";
        if(asideRate) asideRate.innerText = avg;
        if(asideCount) asideCount.innerText = total + "개의 리뷰";
    }
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
    fetchAndRenderReviews();
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
    var sortSel = qs("sortBy");

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
      // 초기 데이터 로딩 (전체보기 시 새로고침하므로 비워두거나 서버에서 가져옴)
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
    
    var reviewTempKey = "";

    function generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    if(openBtn){
      openBtn.onclick = function(){
        closeModal("reviewModal");
        openModal("writeReviewModal");
        reviewTempKey = generateUUID(); // 모달 열릴 때마다 새로운 키 생성
        qs("imgPreview").innerHTML = ""; // 프리뷰 초기화
        qs("reviewImages").value = ""; // 파일 선택기 초기화
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

    // 이미지 미리보기 및 즉시 업로드
    var file = qs("reviewImages");
    var preview = qs("imgPreview");
    if(file && preview){
      file.onchange = function(){
        var files = file.files;
        if(!files || !files.length) return;
        
        for(var i=0;i<files.length;i++){
          (function(f){
            // 1. 미리보기 표시
            var reader = new FileReader();
            reader.onload = function(ev){
              var img = document.createElement("img");
              img.src = ev.target.result;
              preview.appendChild(img);
            };
            reader.readAsDataURL(f);
            
            // 2. 서버에 즉시 전송 (Ajax 선업로드)
            var formData = new FormData();
            formData.append("file", f);
            formData.append("tempKey", reviewTempKey);
            
            fetch("/store/review/uploadTemp", {
              method: "POST",
              body: formData
            })
            .then(function(res){ return res.json(); })
            .then(function(data){
              console.log("Upload success:", data);
            })
            .catch(function(err){
              console.error("Upload failed:", err);
            });
          })(files[i]);
        }
      };
    }

    // 등록
    if(submitBtn){
      submitBtn.onclick = function(){
        var box = qs("starInput");
        var starVal = box ? (parseInt(box.getAttribute("data-value"), 10) || 0) : 0;
        var terms = qs("chkTerms") && qs("chkTerms").checked;

        if(starVal <= 0){ alert("평점은 필수입니다."); return; }
        if(!terms){ alert("리뷰 작성 조항에 동의해주세요."); return; }

        var productId = qs("reviewTitle").getAttribute("product_id");
        var reviewTitle = qs("reviewTitle").value;
        var reviewContent = qs("reviewContent").value;

        fetch("/store/review/add/product/" + productId, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            review_title: reviewTitle,
            review_content: reviewContent,
            review_rate: starVal,
            tempKey: reviewTempKey
          })
        })
        .then(function(response){
          if(response.ok){
            showCustomToast("리뷰가 등록되었습니다.", "success");
            closeModal("writeReviewModal");
          } else {
            response.text().then(function(data){
              showCustomToast(`리뷰 등록에 실패했습니다. : ${data}`, "error");
              if(data === "403"){
                closeModal("writeReviewModal");
                location.href = `/user/login`;
              }
            });
          }
        })
        .catch(function(err){
          console.error(err);
          showCustomToast("리뷰 등록에 실패했습니다.", "error");
          closeModal("writeReviewModal");
        });
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
        if(response.ok) showCustomToast("장바구니에 담겼습니다.","success");
        else{
          response.text().then(function(data){
            // 403 에러는 로그인 페이지로 이동(임시, 시큐리티 추가 전)
            if(data === "403"){
              location.href = `/user/login`;
              return;
            }
            showCustomToast(`장바구니에 추가하지 못했습니다. : ${data}`, "error");
          });
        }
      })
      .catch(function(err){
        console.error(err);
        showCustomToast("장바구니에 담지 못했습니다.","error");

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
          showCustomToast("찜목록에 추가했습니다." , "success");
        }
        response.text().then(function(data){
          // 403 에러는 로그인 페이지로 이동(임시, 시큐리티 추가 전)
          showCustomToast(`찜목록에 추가하지 못했습니다. : ${data}`, "error");
          if(data === "403"){
            location.href = `/user/login`;
            return;
          }
        });
      })
      .catch(function(err){
        console.error(err);
        showCustomToast("찜목록에 추가하지 못했습니다.", "error");
      });
    });
  });
})();
