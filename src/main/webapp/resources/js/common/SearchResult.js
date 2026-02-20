let q = document.getElementById('q').innerHTML;
let slist = document.querySelector('.slist');

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