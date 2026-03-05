document.addEventListener("DOMContentLoaded", function () {

    fetch("/myplant/recommend/list")
        .then(res => res.json())
        .then(data => {

            const container = document.getElementById("plantContainer");
            container.innerHTML = "";

            if (!data || data.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        추천 식물이 없습니다.
                    </div>
                `;
                return;
            }

            data.forEach(plant => {

                const card = document.createElement("a");
                card.className = "plant-card";
                card.href = "#"; // 나중에 상세페이지 연결 가능

                card.innerHTML = `
                    <div class="plant-card__thumb">
                        <img src="/resources/upload/${plant.imageUrl}" 
                             alt="${plant.koreanName}">
                    </div>

                    <div class="plant-card__body">
                        <div class="plant-card__name">
                            ${plant.koreanName}
                        </div>

                        <div class="plant-card__sci">
                            ${plant.englishName}
                        </div>

                        <div class="meta-row">
                            <span class="meta">
                                <span class="meta__label">습도</span>
                                <span class="meta__value">${plant.humidityLevel}</span>
                            </span>

                            <span class="meta-row__sep">|</span>

                            <span class="meta">
                                <span class="meta__label">햇빛</span>
                                <span class="meta__value">${plant.sunlightTolerance}</span>
                            </span>
                        </div>

                        <div class="meta-row meta-row--between">
                            <span class="meta">
                                <span class="meta__label">온도</span>
                                <span class="meta__value">
                                    ${plant.tempMin} ~ ${plant.tempMax}℃
                                </span>
                            </span>
                        </div>
                    </div>
                `;

                container.appendChild(card);
            });

        })
        .catch(error => {
            console.error("데이터 로딩 실패:", error);
        });
});