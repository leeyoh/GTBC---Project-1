$( document ).ready(function() {
	console.log('ready')

	var food_key = ZOMATO_KEY
	var weather_Key = WEATHER_KEY
	var textList = []; 

	var foods = []
	var flagLoaded = false; 

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
			getLocation(response)
		})
	}


	// Get the resturant ID 
	function getLocation(data){
		var queryURL = 'https://developers.zomato.com/api/v2.1/geocode?'
		var queryParams = {};
		
		queryParams.lat = data.city.coord.lat
		queryParams.lon = data.city.coord.lat
		textList.push("Getting Menu Items") /// Interesting 
		console.log(queryURL + $.param(queryParams))
		$.ajax({
			headers: {
			'user-key':food_key,
			},
			url: queryURL + $.param(queryParams),
			method: "GET"
		}).then(function(response){
			console.log(response)
			response.nearby_restaurants.forEach(function(ele){
				getMenu(ele.restaurant.id)
			})
			flagLoaded = true; 
			placeHolder(10)
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
			if(response.featured_image != ''){
				foods.push({'photo1':response.featured_image, 
							'photo2':response.featured_image, 
							  'url':response.menu_url})			
			}
		})
	}

	var userUpdated = false; 
	var imagesLoaded; 
	var userTextCnt = 0; 
	var foodIndex = 0;

	window.onscroll = function(ev) {
		if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
			// you're at the bottom of the page
			placeHolder(10)
			console.log('bottom')
		}
	};

	function placeHolder(units){
		if(flagLoaded){
			for(let i = 0; i < units; i++){
				foods.push({'photo2':'http://place-puppy.com/300x300', 
							'photo1':'https://www.placecage.com/300/300', 
							  'url':'http://placekitten.com/g/300/500'
							  'rating': 5,
							  'name': 'Dog House'})			
			}	
		}
	}


	function updateUser(){
		var cont = $('#image-grid')

		if(userTextCnt == 2){
			userUpdated = true;


			var formCont = $('#navForm')
			var button = $('<button>')
			button.attr('id','run-random')
			button.addClass("uk-button uk-button-default")
			button.html("Random")
			formCont.append(button)
	  		
	  		userTextCnt++;
			$("#run-random").on("click", function(event) {
				
				var randInd = Math.floor(Math.random() * foodIndex) 	
				console.log(randInd)	
				$('#foodID-'+randInd).addClass('uk-animation-shake')
				
			})
		}

	

		if( textList.length != 0 && !userUpdated){
			var textStr = textList.shift();
	
			cont.empty()
	
			var card = $('<div>')
			var text = $('<p>')
			card.addClass("uk-animation-fade greeting")
			text.addClass("uk-text-center")
			text.text(textStr)

			card.append(text)
	  		cont.append(card)
	  		userTextCnt++;
		}

		if(foods.length != 0 && userUpdated){
			$('.greeting').remove()
			var foodObj = foods.shift();
			var card = $('<div>')
			var link = $('<a>')
			var img1 = $('<img>')
			var img2 = $('<img>')

			card.addClass("uk-animation-fade uk-card uk-card-default uk-flex uk-flex-center uk-flex-middle")
			link.attr("href", foodObj.url)
			link.addClass("uk-inline-clip uk-transition-toggle ")
			img1.attr('src', foodObj.photo2)
			img2.attr('src', foodObj.photo1)
			img2.addClass("uk-transition-scale-up uk-position-cover")
			img2.css('filter', 'grayscale(100%)')


			link.append(img1)
			link.append(img2)
			card.attr('id','foodID-'+ foodIndex)
			card.append(link)
			cont.append(card)

			foodIndex++;
		}

		if(!userUpdated ){
			setTimeout(updateUser,2000);
		} else {
			setTimeout(updateUser,50);
		}
		
	}	

	function appendImage(){
		var cont = $('#image-grid')
		cont.empty()
	}



	function buildQueryURLs() {
		getGeoCode()		
	}


	$("#run-search").on("click", function(event) {
		console.log('click')
		$('#run-random').remove()
		foods = []
		textList = []
		userUpdated = false;
		userTextCnt = 0;
		foodIndex = 0;
		event.preventDefault();
		textList.push("Finding Nearby Resturants")
		buildQueryURLs();
		updateUser();

	});




});