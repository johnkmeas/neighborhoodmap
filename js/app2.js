var locationData = [
  {
    locationName: 'Tynehead Regional Park',
    latLng: {lat: 49.181365, lng: -122.757452},
    lat: 49.181365, lng: -122.757452
  },

  {
    locationName: 'Green Timbers Lake',
    latLng: {lat: 49.179204, lng: -122.821221},
    lat: 49.179204, lng: -122.821221
  },

  {
    locationName: 'Capilano River Regional Park',
    latLng: {lat: 49.352239, lng: -123.114227},
    lat: 49.352239, lng: -123.114227
  },

  {
    locationName: 'Burnaby Fraser Foreshore Park',
    latLng: {lat: 49.194429, lng: -122.999024},
    lat: 49.194429, lng: -122.999024
  },
  {
    locationName: 'Campbell Valley Regional Park',
    latLng: {lat: 49.030394, lng: -122.669163},
    lat: 49.030394, lng: -122.669163
  }

];

// Here is the function that loads the map.
// It is intended to load asynchronisly
function initMap(){
    // Create a google map with id, center position and zoom level
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: locationData[3].lat, lng: locationData[3].lng},
    zoom: 9
  });
}

var KoViewModel = function() {
  var self = this;
  self.googleMap = map;

  // An empty array to store a Place.
  self.allPlaces = [];

  // For each object in locationData
  locationData.forEach(function(place) {
    self.allPlaces.push(new Place(place));
  });

  // Some variables to be used for the Foursuare api
  var latlng = '',
    client_id = 'K1GIWTMS14PAA20PHUZXAFQMGJRIXM0FYTXUIC3AEEEF3QXT',
    client_secret = 'GB3U3CIDFVZRDOFR1SU5AY3KYYYLAGC2WI1QMUZNS5AU0PEU',
    fUrl = 'https://api.foursquare.com/v2/venues/search?ll='+ latlng +'&client_id='+ client_id +'&client_secret='+ client_secret +'&v=20151259&m=foursquare&links',
    fquery = 'coffee',
    infowindow = new google.maps.InfoWindow();

  // For each object in allPlace create map markers
  // and create content for each infowindow with
  // the data recieved from foursquare.
  self.allPlaces.forEach(function(place, i) {
    var drop = google.maps.Animation.DROP,
      markerOptions = {
      map: self.googleMap,
      position: place.latLng
    },
    lat = place.lat,
    lng = place.lng;

    var contentin = '';

    // Sends a request to foursquare api
    $.getJSON('https://api.foursquare.com/v2/venues/search?ll='+ lat+','+lng +'&query='+ fquery +'&limit=1&client_id='+ client_id +'&client_secret='+ client_secret +'&v=20151259&m=foursquare',

    // This function takes the foursquare data and processes it.
    function(data) {
      $.each(data.response.venues, function(i,venues){
          content = '<hr></h5><p><sup>nearest coffee spot</sup></p>' +
          '<h5>'+ venues.name + '</h5>' +
          '<p>'+ venues.location.formattedAddress[0] +'<br>' + 
          venues.location.formattedAddress[1] +'</p>';
          contentin = content;
      });
    }).fail(function(){
        content = 'There was an error loading foursquare';
        contentin = content;
    });

    var contentName = '<h4>'+locationData[i].locationName+'</h4>';
    place.marker = new google.maps.Marker(markerOptions);
    var marker = place.marker;
    var poweredBy = '<img class="powered" src="img/powered.png">';

    // This adds an Listener for a click function to the marker.
    // It returns an infowindow with content we create for each marker,
    // and the marker will bounce when clicked
    google.maps.event.addListener(marker, 'click', (function(marker) {
      return function() {
        infowindow.setContent(contentName + contentin + poweredBy);
        infowindow.open(self.googleMap, marker);
        // Animation
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
          } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          }
          setTimeout(function(){ marker.setAnimation(null); }, 800);
      };
    })(marker));
  });

  // The click function triggers map markers
  // and clicks the toggle that shows the
  // list itemsd.
  clicker = function(){
    google.maps.event.trigger(this.marker, 'click');
    $('#menu-toggle').trigger('click');
  };

  // Toggle visibility of list view in mobile view
  self.Show = ko.observable(false);
  self.toggleVisibility = function() {
    self.Show(!self.Show());
  };
  self.Show = ko.observable(true);

  //This is where the visible markers will be stored
  self.visiblePlaces = ko.observableArray();

  // All markers will start out visible
  self.allPlaces.forEach(function(place) {
    self.visiblePlaces.push(place);
  });

  // This binds to the userInput and keeps track of its contents
  // and is accessed by the filter.
  self.userInput = ko.observable('');

  // This is the filter function for the Markers.
  // It takes the user input and if it matches
  // part of any name, then that name's content will be visible,
  // Otherwise it will be hidden.
  self.filterMarkers = function() {
    var searchInput = self.userInput().toLowerCase();
    self.visiblePlaces.removeAll();

    self.allPlaces.forEach(function(place) {

      place.marker.setVisible(false);
      if (place.locationName.toLowerCase().indexOf(searchInput) !== -1) {
        self.visiblePlaces.push(place);
      }
    });

    self.visiblePlaces().forEach(function(place) {
      place.marker.setVisible(true);
    });
  };

  //This creates object Place with data
  function Place(data) {
    this.locationName = data.locationName;
    this.latLng = data.latLng;
    this.lat = data.lat;
    this.lng = data.lng;
    this.marker = null;
  }
};

function loadAll(){
  initMap();
  ko.applyBindings(new KoViewModel());
}