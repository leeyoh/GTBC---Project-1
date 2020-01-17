$( document ).ready(function() {
	console.log('ready')

	var location = {
		long:0,
		lat:0,
	}
	var food_key = ""
	var weather_Key = ""
	
	if (!navigator.geolocation) {
		status.textContent = 'Geolocation is not supported by your browser';
	} else {
		navigator.geolocation.getCurrentPosition(success, error);
	}

	function success(position) {
		location.lat  = position.coords.latitude;
		location.long = position.coords.longitude;
		console.log(location)
		buildQueryURLs(false)
	}

	function error() {
		console.log(error)
	}

	function getGeoCode(){
		var queryURL = 'https://api.openweathermap.org/data/2.5/forecast?'
		var queryParams = {'appid': weather_Key } ;
		queryParams.q = $("#search-term").val().trim();

		$.ajax({
			url: queryURL + $.param(queryParams),
			method: "GET"
		}).then(function(response){
			console.log(response)
			location.lat = response.city.coord.lat
			location.long = response.city.coord.lat
			getLocation()
		})
	}

	function getLocation(){
		var queryURL = 'https://developers.zomato.com/api/v2.1/geocode?'
		var queryParams = {};
	
		queryParams.lat = location.lat
		queryParams.lon = location.long
		console.log(queryParams)

		$.ajax({
			headers: {
			'user-key':food_key,
			},
			url: queryURL + $.param(queryParams),
			method: "GET"
		}).then(function(response){
			console.log(response.nearby_restaurants[0].restaurant.id)


			
			response.nearby_restaurants.forEach(function(ele){

					getMenu(ele.restaurant.id)

			})
		})
	}

	function getMenu(res_id){
		var queryURL = 'https://developers.zomato.com/api/v2.1/restaurant?'
		var queryParams = {'res_id': res_id} ;
		
		$.ajax({
			headers: {
			'user-key':food_key,
			},
			url: queryURL + $.param(queryParams),
			method: "GET"
		}).then(function(response){
			console.log(response)
		})
	}



	function buildQueryURLs() {
		getGeoCode()		

	}



	$("#run-search").on("click", function(event) {
		console.log('click')
		event.preventDefault();	
		buildQueryURLs();
	});




});