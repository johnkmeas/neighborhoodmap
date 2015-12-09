
var map;
var geoJSON;
  var request;
  var gettingData = false;
  var openWeatherMapKey = "c07a5d60b1db3e4a8d99b1d10a9fd2f6";
var markerd;
var $wikiElem = $('#wikipedia-links');
$wikiElem.text("");

var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + 'Vancouver' +'&format=json&callback=wikiCallback';
    
    //var wikRequestTimeout = setTimeout(function(){
      //  $wikiElem.text("failed to get wikipedia resources");
   // }, 5000);

$.ajax({
  url: wikiUrl,
  dataType: "jsonp",
  // jsonp: "callback",
  success: function( response ){
    console.log(response)
    var articleList = response[1];

    for (var i = 0; i < 4; i++){
      articleStr = articleList[i];
      var url = 'http://en.wikipedia.org/wiki/' + articleStr;
      $wikiElem.append('<li><a href="'+ url +'">' + articleStr + '</a></li>');
    };

    clearTimeout(wikiRequestTimeout);
  }
});

ko.utils.stringStartsWith = function(string, startsWith) {
    string = string || "";
    if (startsWith.length > string.length) return false;
    return string.substring(0, startsWith.length) === startsWith;
};

ko.utils.forEachArray = function(r){
  if(r === 0){
    markerd[r].setVisible(false);
  }
}
var Record = function(name, place) {
    //this.id = id;
    this.name = name;
    this.place = place;
    //this.homeTown = homeTown;
};

var anyString = 'Mozilla';

// Displays 'Moz'
console.log(anyString.substring(0, 3));
console.log(anyString.substring(3, 0));

// Displays 'lla'
console.log(anyString.substring(4, 7));
console.log(anyString.substring(7, 4));

var viewModel = {
    park : [
  {name: "Tynehead Regional Park", place: {lat: 49.181365, lng: -122.757452},
    content: 'tynehead'},
  {name: "Green Timbers Lake", place: {lat: 49.179204, lng: -122.821221},
    content: 'my'},
  {name: "Capilano River Regional Park", place: {lat: 49.352239, lng: -123.114227},
    content: 'name'},
  {name: "Burnaby Fraser Foreshore Park", place: {lat: 49.194429, lng: -122.999024},
    content: 'is'},
  {name: "Campbell Valley Regional Park", place: {lat: 49.030394, lng: -122.669163},
    content: 'John'},
  {name: "Some house", place: {lat: 49.056469, lng: -122.775932},
    content: '<iframe src="https://player.vimeo.com/video/71590595?title=0&portrait=0" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> <p><a href="https://vimeo.com/71590595">16155, 30th avenue | South Surrey BC</a> from <a href="https://vimeo.com/liftmarketing">Lift Marketing</a> on <a href="https://vimeo.com">Vimeo</a>.</p>'}
  ]
};
var parks = viewModel.park;

  function initialize() {
    var mapOptions = {
      zoom: 10,
      center: new google.maps.LatLng(49.179282, -122.820615)
    };
    map = new google.maps.Map(document.getElementById('map'),
        mapOptions);

  

    // Add interaction listeners to make weather requests
    google.maps.event.addListener(map, 'idle', checkIfDataRequested);
    // Sets up and populates the info window with details
    map.data.addListener('click', function(event) {
      infowindow.setContent(
       "<img src=" + event.feature.getProperty("icon") + ">"
       + "<br /><strong>" + event.feature.getProperty("city") + "</strong>"
       + "<br />" + event.feature.getProperty("temperature") + "&deg;C"
       + "<br />" + event.feature.getProperty("weather")
       );
      infowindow.setOptions({
          position:{
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          },
          pixelOffset: {
            width: 0,
            height: -15
          }
        });
      infowindow.open(map);
    });

    function markers() {
    for(var i = 0; i < 6; i++){
      var place = parks[i].place;
      var drop = google.maps.Animation.DROP;
      var name = parks[i].name; 
      marker = new google.maps.Marker({
        position: place,
        map: map,
        animation: drop,
        title: name
      });
      markerd[i] = marker;

    // clickresponse(marker, parks[i].name);

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(parks[i].content);
          infowindow.open(map, marker);
          
          if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
          } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          }
          setTimeout(function(){ marker.setAnimation(null); }, 750);
        }
      })(marker, i));

    }};
  markers();
}//end initMap

var checkIfDataRequested = function() {
    // Stop extra requests being sent
    while (gettingData === true) {
      request.abort();
      gettingData = false;
    }
    getCoords();
  };
  // Get the coordinates from the Map bounds
  var getCoords = function() {
    var bounds = map.getBounds();
    var NE = bounds.getNorthEast();
    var SW = bounds.getSouthWest();
    getWeather(NE.lat(), NE.lng(), SW.lat(), SW.lng());
  };
  // Make the weather request
  var getWeather = function(northLat, eastLng, southLat, westLng) {
    gettingData = true;
    var requestString = "http://api.openweathermap.org/data/2.5/box/city?bbox="
                        + westLng + "," + northLat + "," //left top
                        + eastLng + "," + southLat + "," //right bottom
                        + map.getZoom()
                        + "&cluster=yes&format=json"
                        + "&APPID=" + openWeatherMapKey;
    request = new XMLHttpRequest();
    request.onload = proccessResults;
    request.open("get", requestString, true);
    request.send();
  };
  // Take the JSON results and proccess them
  var proccessResults = function() {
    console.log(this);
    var results = JSON.parse(this.responseText);
    if (results.list.length > 0) {
        resetData();
        for (var i = 0; i < results.list.length; i++) {
          geoJSON.features.push(jsonToGeoJson(results.list[i]));
        }
        drawIcons(geoJSON);
    }
  };
  var infowindow = new google.maps.InfoWindow();
  // For each result that comes back, convert the data to geoJSON
  var jsonToGeoJson = function (weatherItem) {
    var feature = {
      type: "Feature",
      properties: {
        city: weatherItem.name,
        weather: weatherItem.weather[0].main,
        temperature: weatherItem.main.temp,
        min: weatherItem.main.temp_min,
        max: weatherItem.main.temp_max,
        humidity: weatherItem.main.humidity,
        pressure: weatherItem.main.pressure,
        windSpeed: weatherItem.wind.speed,
        windDegrees: weatherItem.wind.deg,
        windGust: weatherItem.wind.gust,
        icon: "http://openweathermap.org/img/w/"
              + weatherItem.weather[0].icon  + ".png",
        coordinates: [weatherItem.coord.lon, weatherItem.coord.lat]
      },
      geometry: {
        type: "Point",
        coordinates: [weatherItem.coord.lon, weatherItem.coord.lat]
      }
    };
    // Set the custom marker icon
    map.data.setStyle(function(feature) {
      return {
        icon: {
          url: feature.getProperty('icon'),
          anchor: new google.maps.Point(25, 25)
        }
      };
    });
    // returns object
    return feature;
  };
  // Add the markers to the map
  var drawIcons = function (weather) {
     map.data.addGeoJson(geoJSON);
     // Set the flag to finished
     gettingData = false;
  };
  // Clear data layer and geoJSON
  var resetData = function () {
    geoJSON = {
      type: "FeatureCollection",
      features: []
    };
    map.data.forEach(function(feature) {
      map.data.remove(feature);
    });
  };
  google.maps.event.addDomListener(window, 'load', initialize);
var ViewModel = function(records) {
    markerd = ko.observableArray([]);
   //marker  -122.757452, 49.181154, -122.757398, 49.179204, -122.821221, 49.352239, -123.114227, 49.194429, -122.999024, 49.030394, -122.669163

    var self = this;
    
    //self.homeTowns = ko.observableArray(homeTowns);
    self.records = ko.observableArray(
    ko.utils.arrayMap(records, function(i) {
        return new Record(i.name, i.place);
    }));

    //self.idSearch = ko.observable('');
    self.nameSearch = ko.observable('');
    //self.townSearch = ko.observable('');

    self.parks = ko.computed(function() {
        return ko.utils.arrayFilter(self.records(), function(r) {
            return (self.nameSearch().length == 0 || ko.utils.stringStartsWith(r.name.toLowerCase(), self.nameSearch().toLowerCase())) 
           
        });
      

         //ko.utils.stringStartsWith(r.id, self.idSearch())) 
       // && (self.nameSearch().length == 0 || ko.utils.stringStartsWith(r.name.toLowerCase(), self.nameSearch().toLowerCase())) 
      //&& (self.townSearch().length == 0 || r.homeTown == self.townSearch())
    });
    clicker = function(){

        if(this.name === parks[0].name){
          google.maps.event.trigger(markerd[0], 'click');
        }if(this.name === parks[1].name){
          google.maps.event.trigger(markerd[1], 'click');
        }if(this.name === parks[2].name){
          google.maps.event.trigger(markerd[2], 'click');
        }if(this.name === parks[3].name){
          google.maps.event.trigger(markerd[3], 'click');
        }if(this.name === parks[4].name){
          google.maps.event.trigger(markerd[4], 'click');
        }if(this.name === parks[5].name){
          google.maps.event.trigger(markerd[5], 'click');
        }    
    }; 
    // we have to give it access to the map object, so that
// it can register and de-register itself
/*var Pin = function Pin(map, name, lat, lon, text) {
  var marker;

  this.name = ko.observable(name);
  this.lat  = ko.observable(lat);
  this.lon  = ko.observable(lon);
  this.text = ko.observable(text);

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
} */  

};



ko.applyBindings(new ViewModel(parks));

