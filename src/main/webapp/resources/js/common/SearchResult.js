let q = document.getElementById('q').innerHTML;
let slist = document.querySelector('.slist');

(function getBoardsByTitle(q){
	fetch('/search/community/title?q=' + q)
		.then(response => response.json())
		.then(data => {
			data.forEach(element => {
				console.log(element);
			});
		})
		.catch(err => console.log(err));
})(q);
(function getBoardsByContent(q){
	fetch('/search/community/content?q=' + q)
		.then(response => response.json())
		.then(data => {
			data.forEach(element => {
				console.log(element);
			});
		})
		.catch(err => console.log(err));
})(q);
(function getBoardsByWriter(q){
	fetch('/search/community/writer?q=' + q)
		.then(response => response.json())
		.then(data => {
			data.forEach(element => {
				console.log(element);
			});
		})
		.catch(err => console.log(err));
})(q);
(function getPlants(q){
	fetch('/search/plant?q=' + q)
		.then(response => response.json())
		.then(data => {
			data.forEach(element => {
				console.log(element);
			});
		})
		.catch(err => console.log(err));
})(q);
(function getProducts(q){
	fetch('/search/store?q=' + q)
		.then(response => response.json())
		.then(data => {
			data.forEach(element => {
				console.log(element);
			});
		})
		.catch(err => console.log(err));
})(q);