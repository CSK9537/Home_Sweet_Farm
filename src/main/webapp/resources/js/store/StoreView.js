// storeDetail.js (ES5)
(function () {
  function qs(id) { return document.getElementById(id); }

  function getThumbButtons() {
    var wrap = qs("thumbs");
    if (!wrap) return [];
    var buttons = wrap.getElementsByTagName("button");
    return buttons || [];
  }

  function setActiveThumb(buttons, idx) {
    for (var i = 0; i < buttons.length; i++) {
      if (i === idx) {
        if (buttons[i].className.indexOf("thumb--active") === -1) {
          buttons[i].className = (buttons[i].className + " thumb--active").replace(/\s+/g, " ").trim();
        }
      } else {
        buttons[i].className = buttons[i].className.replace("thumb--active", "").replace(/\s+/g, " ").trim();
      }
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
      // 더미
      img.removeAttribute("src");
      img.style.display = "none";
      if (dummy) dummy.style.display = "flex";
    }
  }

  function bindGallery() {
    var buttons = getThumbButtons();
    if (!buttons.length) return;

    var idx = 0;

    // 초기 메인 이미지 결정(첫 썸네일 기준)
    if (buttons[0].getAttribute("data-src")) {
      setMainImage(buttons[0].getAttribute("data-src"));
    }

    for (var i = 0; i < buttons.length; i++) {
      (function (k) {
        buttons[k].onclick = function () {
          idx = k;
          setActiveThumb(buttons, idx);
          setMainImage(buttons[idx].getAttribute("data-src"));
        };
      })(i);
    }

    var prev = qs("btnPrev");
    var next = qs("btnNext");

    if (prev) {
      prev.onclick = function () {
        idx = (idx - 1 + buttons.length) % buttons.length;
        setActiveThumb(buttons, idx);
        setMainImage(buttons[idx].getAttribute("data-src"));
      };
    }
    if (next) {
      next.onclick = function () {
        idx = (idx + 1) % buttons.length;
        setActiveThumb(buttons, idx);
        setMainImage(buttons[idx].getAttribute("data-src"));
      };
    }
  }

  function bindCardClicks() {
    var cards = document.getElementsByClassName("js-card");
    for (var i = 0; i < cards.length; i++) {
      (function (el) {
        el.onclick = function () {
          var href = el.getAttribute("data-href");
          if (href) window.location.href = href;
        };
      })(cards[i]);
    }
  }

  // 모달
  function openModal() {
    var modal = qs("descModal");
    if (!modal) return;
    modal.className = (modal.className + " is-open").replace(/\s+/g, " ").trim();
    modal.setAttribute("aria-hidden", "false");
    document.body.className = (document.body.className + " modal-open").replace(/\s+/g, " ").trim();
  }

  function closeModal() {
    var modal = qs("descModal");
    if (!modal) return;
    modal.className = modal.className.replace("is-open", "").replace(/\s+/g, " ").trim();
    modal.setAttribute("aria-hidden", "true");
    document.body.className = document.body.className.replace("modal-open", "").replace(/\s+/g, " ").trim();
  }

  function bindModal() {
    var openBtn = qs("btnOpenDesc");
    var dim = qs("modalDim");
    var closeBtn = qs("btnCloseModal");

    if (openBtn) openBtn.onclick = openModal;
    if (dim) dim.onclick = closeModal;
    if (closeBtn) closeBtn.onclick = closeModal;

    document.onkeydown = function (e) {
      e = e || window.event;
      var key = e.keyCode || e.which;
      if (key === 27) { // ESC
        closeModal();
      }
    };
  }

  function init() {
    bindGallery();
    bindCardClicks();
    bindModal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

// 장바구니 추가
document.querySelector("#addCart").addEventListener("click", function () {
  const product_id = document.querySelector("#product_id").getAttribute("value");
  fetch(`/store/cart/addCart/user/2/product/${product_id}?type=plus`, {
    method: "PUT",
  })
    .then((response) => {
      if (response.ok) {
        alert("장바구니에 담았습니다.");
      } else {
        alert("장바구니에 담지 못했습니다.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

// 찜목록 추가
document.querySelector("#addWish").addEventListener("click", function() {
  const product_id = document.querySelector("#product_id").getAttribute("value");
  fetch(`/store/cart/addWish/user/2/product/${product_id}`, {
    method: "POST",
  })
    .then((response) => {
      if (response.ok) {
        alert("찜목록에 추가했습니다.");
      } else {
        response.text().then((data) => {
          alert(data);
        }); 
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});