

viewmodel.pin = function(name, place) {
	this.name = observable();
	this.place = observable();

	marker = new google.maps.Marker({
	    position: new google.maps.LatLng(lat, lon),
	    animation: google.maps.Animation.DROP
	});
	this.isVisible = ko.observable(false);

  	this.isVisible.subscribe(function(currentState) {
   		if (currentState) {
      		marker.setMap(map);
    	} else {
      		marker.setMap(null);
    	}
  	});

  this.isVisible(true);
}
