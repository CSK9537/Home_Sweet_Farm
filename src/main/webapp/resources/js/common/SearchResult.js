const service = SearchService;
let q = document.getElementById('q').innerHTML;
let tmp = document.querySelector('.tmp');
service.getBoardsByTitle(q, jsonArray => {
  jsonArray.forEach(board => {
    let makechild = '';
    makechild += `<div>`;
    makechild += `${board.title}\n`;
    makechild += `${board.content}\n`;
    makechild += `${board.user_id}`;
    makechild += `</div>`;

    tmp.innerHTML += makechild;
  });
});