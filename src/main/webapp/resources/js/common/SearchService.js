const SearchService = (function(){
	function getBoardsByTitle(q, callback){
		fetch('/search/community/title?q=' + q)
			.then(response => response.json())
			.then(data => {
				callback(data);
			})
			.catch(err => console.log(err));
	}
	
	function getBoardsByContent(q, callback){
		fetch('/search/community/content?q=' + q)
			.then(response => response.json())
			.then(data => {
				callback(data);
			})
			.catch(err => console.log(err));
	}
	
	function getBoardsByWriter(q, callback){
		fetch('/search/community/writer?q=' + q)
			.then(response => response.json())
			.then(data => {
				callback(data);
			})
			.catch(err => console.log(err));
	}
	
	function getPlants(q, callback){
		fetch('/search/plant?q=' + q)
			.then(response => response.json())
			.then(data => {
				callback(data);
			})
			.catch(err => console.log(err));
	}
	
	function getProducts(q, callback){
		fetch('/search/store?q=' + q)
			.then(response => response.json())
			.then(data => {
				callback(data);
			})
			.catch(err => console.log(err));
	}
	
	return {
		getBoardsByTitle,
		getBoardsByContent,
		getBoardsByWriter,
		getPlants,
		getProducts,
	};
})();