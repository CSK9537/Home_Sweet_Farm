// MyPlantRecommend.js

document.addEventListener("DOMContentLoaded", function() {
  
  // 1. 질문 데이터
  const questions = [
    {
      q: "우리 집의 햇빛 조건은 어떤가요?",
      options: [
        { text: "햇빛이 아주 잘 드는 창가예요 ☀️", val: "H" },
        { text: "햇빛이 적당히 드는 반양지예요 ⛅", val: "M" },
        { text: "햇빛이 거의 들지 않아요 ☁️", val: "L" }
      ]
    },
    {
      q: "당신의 물주기 성향은?",
      options: [
        { text: "매일 확인하고 챙겨주는 부지런한 타입 💧", val: "H" },
        { text: "가끔 생각날 때 듬뿍 주는 느긋한 타입 🌵", val: "L" }
      ]
    },
    {
      q: "식물을 키우고 싶은 가장 큰 이유는?",
      options: [
        { text: "감성적인 플랜테리어를 위해서 🏡", val: "interior" },
        { text: "상쾌한 공기 정화를 위해서 🍃", val: "air" }
      ]
    }
  ];

//2. 결과 식물 데이터베이스
  const plantResults = {
    "monstera": {
      name: "몬스테라",
      img: "/plant/image/Monstera deliciosa.jpeg",
      tags: ["#플랜테리어_끝판왕", "#멋진잎", "#초보자환영"],
      desc: "크고 이국적인 잎이 매력적인 몬스테라는 집안 분위기를 단숨에 트로피컬하게 바꿔줍니다. 성장이 빠르고 생명력이 강해 초보 식집사에게도 적극 추천하는 식물이에요!",
      link: "/plant/info/Monstera deliciosa" // 👈 이동할 식물 상세 페이지 주소 추가
    },
    "scindapsus": {
      name: "스킨답서스",
      img: "/plant/image/Epipremnum aureum.jpeg", 
      tags: ["#생명력_갑", "#공기정화", "#음지식물"],
      desc: "어디에 두어도 묵묵히 잘 자라는 최고의 순둥이 식물입니다. 일산화탄소 제거 능력이 탁월해 주방이나 화장실에 두기 좋고, 덩굴성으로 늘어져서 자라는 모습이 매우 우아해요.",
      link: "/plant/info/Epipremnum aureum" // 👈 추가
    },
    "rosemary": {
      name: "로즈메리",
      img: "/plant/image/Salvia rosmarinus.jpeg",
      tags: ["#요리활용", "#햇빛과바람", "#천연방향제"],
      desc: "풍부한 햇빛과 시원한 통풍, 그리고 때맞춘 물주기가 필요한 '부지런한 식집사'용 식물이에요. 손끝을 스칠 때마다 나는 상쾌한 향기가 매력적이며, 스테이크나 파스타 등 요리에도 유용하게 쓰입니다.",
      link: "/plant/info/Salvia rosmarinus" // 👈 추가
    },
    "sansevieria": {
      name: "산세베리아",
      img: "/plant/image/Sansevieria trifasciata.jpeg",
      tags: ["#천연공기청정기", "#침실추천", "#생명력최강"],
      desc: "길쭉하게 뻗은 호랑이 무늬 잎이 시원시원한 매력을 주는 식물입니다. 밤에 산소를 듬뿍 내뿜어 침실에 두기 아주 좋으며, 건조함에 매우 강해 한 달에 한 번 정도만 물을 주며 무심하게 키워도 튼튼하게 자라납니다.",
      link: "/plant/info/Sansevieria trifasciata" // 👈 추가
    }
  };

  // 상태 변수
  let currentStep = 0;
  let userAnswers = [];

  // DOM 요소
  const stepIntro = document.getElementById("mprIntro");
  const stepQuestion = document.getElementById("mprQuestion");
  const stepResult = document.getElementById("mprResult");
  
  const progressBar = document.getElementById("progressBar");
  const qNum = document.getElementById("qNum");
  const qTitle = document.getElementById("qTitle");
  const qOptions = document.getElementById("qOptions");

  const resName = document.getElementById("resName");
  const resImg = document.getElementById("resImg");
  const resTags = document.getElementById("resTags");
  const resDesc = document.getElementById("resDesc");

  // 이벤트 리스너
  document.getElementById("btnStart").addEventListener("click", startTest);
  document.getElementById("btnRetry").addEventListener("click", resetTest);

  function switchStep(hideEl, showEl) {
    hideEl.classList.remove("is-active");
    // 약간의 딜레이 후 보여주기 (페이드 효과를 위해)
    setTimeout(() => {
      showEl.classList.add("is-active");
    }, 50);
  }

  function startTest() {
    currentStep = 0;
    userAnswers = [];
    renderQuestion();
    switchStep(stepIntro, stepQuestion);
  }

  function renderQuestion() {
    const qData = questions[currentStep];
    
    // 프로그레스 바
    const progress = ((currentStep) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;

    qNum.textContent = `Q${currentStep + 1}.`;
    qTitle.textContent = qData.q;
    
    qOptions.innerHTML = "";
    qData.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "mpr-option-btn";
      btn.textContent = opt.text;
      btn.onclick = () => handleAnswer(opt.val);
      qOptions.appendChild(btn);
    });
  }

  function handleAnswer(val) {
    userAnswers.push(val);
    currentStep++;

    if (currentStep < questions.length) {
      renderQuestion();
    } else {
      progressBar.style.width = "100%";
      setTimeout(showResult, 300); // 100% 차는 거 보여주고 결과로
    }
  }

  function showResult() {
    const resultKey = calculateResult(userAnswers);
    const plant = plantResults[resultKey];

    resName.textContent = plant.name;
    resImg.src = plant.img;
    resDesc.textContent = plant.desc;
    
    resTags.innerHTML = plant.tags.map(tag => `<span class="mpr-result__tag">${tag}</span>`).join("");
    
    btnGoStore.href = plant.link;

    switchStep(stepQuestion, stepResult);
  }

  // 간단한 추천 알고리즘 로직
  function calculateResult(answers) {
    const [light, water, purpose] = answers; // Q1: light, Q2: water, Q3: purpose

    // 햇빛 H, 물 H -> 로즈메리
    if (light === "H" && water === "H") return "rosemary";
    
    // 햇빛 L, 물 L -> 스킨답서스 (음지+건조 최강)
    if (light === "L" && water === "L") return "scindapsus";

    // 물 L, 인테리어 목적 -> 몬스테라 or 산세베리아
    if (water === "L") {
      if (purpose === "interior" && light !== "L") return "monstera";
      return "sansevieria";
    }

    // 공기정화 목적이면서 음지 가능 -> 스킨답서스
    if (purpose === "air") return "scindapsus";

    // 그 외 무난한 환경 (M, L) -> 몬스테라 기본 배정
    return "monstera";
  }

  function resetTest() {
    switchStep(stepResult, stepIntro);
  }
});