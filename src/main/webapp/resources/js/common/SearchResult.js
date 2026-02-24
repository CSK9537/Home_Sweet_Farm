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
service.getBoardsByContent(q, jsonArray => {
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
service.getBoardsByWriter(q, jsonArray => {
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
service.getPlants(q, jsonArray => {
  jsonArray.forEach(plant => {
    let makechild = '';
    makechild += `<div>`;
    makechild += `${plant.plant_name}\n`;
    makechild += `${plant.plant_name_kor}`;
    makechild += `</div>`;

    tmp.innerHTML += makechild;
  });
});
service.getProducts(q, jsonArray => {
  jsonArray.forEach(product => {
    let makechild = '';
    makechild += `<div>`;
    makechild += `${product.product_name}\n`;
    makechild += `${product.product_price}`;
    makechild += `</div>`;

    tmp.innerHTML += makechild;
  });
});