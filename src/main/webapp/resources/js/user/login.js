(function () {
  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }
  function qsa(sel, root) {
    return (root || document).querySelectorAll(sel);
  }

  function setActiveTab(targetId) {
    var tabs = qsa('.tab-btn');
    var panels = qsa('.tab-panel');

    for (var i = 0; i < tabs.length; i++) {
      var t = tabs[i];
      var isOn = (t.getAttribute('data-target') === targetId);
      if (isOn) {
        t.className = 'tab-btn is-active';
        t.setAttribute('aria-selected', 'true');
      } else {
        t.className = 'tab-btn';
        t.setAttribute('aria-selected', 'false');
      }
    }

    for (var j = 0; j < panels.length; j++) {
      var p = panels[j];
      if (p.id === targetId) {
        p.className = 'tab-panel is-show';
      } else {
        p.className = 'tab-panel';
      }
    }
  }

  function wireTabs() {
    var tabs = qsa('.tab-btn');
    for (var i = 0; i < tabs.length; i++) {
      (function (btn) {
        btn.onclick = function () {
          var target = btn.getAttribute('data-target');
          if (target) setActiveTab(target);
        };
      })(tabs[i]);
    }

    // 내부 "바로가기" 버튼(아이디찾기/비번찾기/로그인)도 동일하게 처리
    var gos = qsa('.js-go');
    for (var k = 0; k < gos.length; k++) {
      (function (b) {
        b.onclick = function () {
          var target = b.getAttribute('data-target');
          if (target) setActiveTab(target);
        };
      })(gos[k]);
    }
  }

  function wireCodeInputs() {
    var groups = qsa('.code-boxes');
    for (var g = 0; g < groups.length; g++) {
      (function (wrap) {
        var inputs = qsa('.code-input', wrap);
        for (var i = 0; i < inputs.length; i++) {
          (function (idx) {
            inputs[idx].oninput = function () {
              // 숫자만
              this.value = (this.value || '').replace(/[^0-9]/g, '');
              if (this.value && idx < inputs.length - 1) {
                inputs[idx + 1].focus();
              }
            };
            inputs[idx].onkeydown = function (e) {
              e = e || window.event;
              var key = e.keyCode;

              // Backspace: 비어있으면 이전 칸으로
              if (key === 8) {
                if (!this.value && idx > 0) {
                  inputs[idx - 1].focus();
                }
              }
            };
          })(i);
        }
      })(groups[g]);
    }
  }

  function init() {
    wireTabs();
    wireCodeInputs();

    // 기본 탭: 로그인
    setActiveTab('panel-login');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
