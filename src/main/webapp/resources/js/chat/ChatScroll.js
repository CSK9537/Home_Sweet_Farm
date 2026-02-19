export function isScrollBottom() {
    const container = document.getElementById("messages");
    if (!container) return false;
    return container.scrollHeight - container.scrollTop - container.clientHeight < 50;
}

export function handleNewMessageButton() {
  const newMsgBtn = document.getElementById("new-msg-btn"); // 새로운 메세지 버튼

      // 새로운 메세지 버튼 클릭 시 맨 아래로 이동
    newMsgBtn.addEventListener("click", () => {
        const container = document.getElementById("messages");
        container.scrollTop = container.scrollHeight;
        newMsgBtn.style.display = "none";
    });

    //맨 아래로 스크롤 시 새로운 메세지 버튼 사라짐
    document.getElementById("messages").addEventListener("scroll", () => {
        const container = document.getElementById("messages");

        const isBottom =
            container.scrollHeight - container.scrollTop - container.clientHeight < 5;

        if (isBottom) {
            newMsgBtn.style.display = "none";
        }
    });

}
