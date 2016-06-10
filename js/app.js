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


var ViewModel = function() {
  var self = this;
  
  // Create a google map with id, center position and zoom level
  self.googleMap = new google.maps.Map(document.getElementById('map'), {
    center: {lat: locationData[1].lat, lng: locationData[1].lng},
    zoom: 10
  });
  
  // Array to store all date
  self.allPlaces = [];

  // For each index of locationData array push a 
  // new Place object with the contents of the array
  locationData.forEach(function(place) {
    self.allPlaces.push(new Place(place));
  });
  
  // Toggle visibility of list view in mobile view
  self.showRow = ko.observable(false);
  
  // Makes the list disappear to make room for viewing
  self.toggleVisibility = function() {
    self.showRow(!self.showRow());
  };
  self.showRow = ko.observable(true);



  // Some variables to be used for the Foursuare api
  var latlng = '';
  var client_id = 'K1GIWTMS14PAA20PHUZXAFQMGJRIXM0FYTXUIC3AEEEF3QXT';
  var client_secret = 'GB3U3CIDFVZRDOFR1SU5AY3KYYYLAGC2WI1QMUZNS5AU0PEU';
  var fUrl = 'https://api.foursquare.com/v2/venues/search?ll='+ latlng +'&client_id='+ client_id +'&client_secret='+ client_secret +'&v=20151259&m=foursquare&links';
  var fquery = 'coffee';
  var lat;
  var lng;
  var infowindow = new google.maps.InfoWindow();
  
  // This goes through each object in allPlaces and does

  self.allPlaces.forEach(function(place, i) {
    lat = place.lat;
    lng = place.lng;
    var drop = google.maps.Animation.DROP;
    var markerOptions = {
      map: self.googleMap,
      position: place.latLng
    };
    var contentin = '';

    // Send request to foursquare 
    $.getJSON('https://api.foursquare.com/v2/venues/search?ll='+ lat+','+lng +'&query='+ fquery +'&limit=1&client_id='+ client_id +'&client_secret='+ client_secret +'&v=20151259&m=foursquare',
    
    // Function to process data
    function(data) {
      $.each(data.response.venues, function(i,venues){
        if(venues.name.length == 0){
          content = '<p>' + 'Error loading foursquare' + '</p>';
        }else
        content = '</h5><br><p><sup>nearest coffee spot</sup></p><br>' +
        '<h5>'+ venues.name + '</h5>' +
        '<p>'+ venues.location.formattedAddress[0] +'<br>'
        + venues.location.formattedAddress[1] +'</p>';
        contentin = content;
      });
    });

    var contentName = '<h4>'+locationData[i].locationName+'</h4><br>';
    
    place.marker = new google.maps.Marker(markerOptions);
    var marker = place.marker;

    // Visual attribution
    var poweredBy = '<img class="powered" src="img/powered.png">';
    
    // Add click listener and pass in 
    // some content prepared earlier.
    // returns infowindow containing content
    // and animates the marker.
    google.maps.event.addListener(marker, 'click', (function(marker) {
    
      return function() {

        infowindow.setContent(contentName + contentin + poweredBy);
        infowindow.open(self.googleMap, marker);
        
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
          } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          }
          setTimeout(function(){ marker.setAnimation(null); }, 800);
      }
    })(marker));

    // You might also add listeners onto the marker, such as "click" listeners.
    clicker = function(){
      google.maps.event.trigger(this.marker, 'click');
      $('.toggle').trigger('click');
    }
  });
 

  // This array will contain what its name implies: only the markers that should
  // be visible based on user input. My solution does not need to use an 
  // observableArray for this purpose, but other solutions may require that.
  self.visiblePlaces = ko.observableArray();

  // All places should be visible at first. We only want to remove them if the
  // user enters some input which would filter some of them out.
  self.allPlaces.forEach(function(place) {
    self.visiblePlaces.push(place);
  });
  
  
  // This, along with the data-bind on the <input> element, lets KO keep 
  // constant awareness of what the user has entered. It stores the user's 
  // input at all times.
  self.userInput = ko.observable('');
  
  
  // The filter will look at the names of the places the Markers are standing
  // for, and look at the user input in the search box. If the user input string
  // can be found in the place name, then the place is allowed to remain 
  // visible. All other markers are removed.
  self.filterMarkers = function() {
    var searchInput = self.userInput().toLowerCase();
    
    self.visiblePlaces.removeAll();
    
    // Looks at each name and checks if user input is true
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

  // Objects to be references by map markers
  function Place(dataObj) {
    this.locationName = dataObj.locationName;
    this.latLng = dataObj.latLng;
    this.lat = dataObj.lat;
    this.lng = dataObj.lng;
    this.marker = null;
  }
};


ko.applyBindings(new ViewModel());