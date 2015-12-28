// I've declared the global variables above everything
var map, markerd,

  viewModel = {
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
  },
  // Assigned var parks to viewModel.park to make it easier to read
  parks = viewModel.park;

  // Initializes the map
  function initialize() {
    // Set the zoom level and center position of map
    var mapOptions = {
      zoom: 10,
      center: new google.maps.LatLng(49.179282, -122.820615)
    };
    // Assign var map to a new google map and assigned to id 'map'
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  // Call markers function to load the map markers
  markers();
};
// Load the Map
google.maps.event.addDomListener(window, 'load', initialize);

// Function to return string if it starts
// with what has been entered by the user
ko.utils.stringStartsWith = function(string, startsWith) {
    string = string || "";
    if (startsWith.length > string.length) return false;
    return string.substring(0, startsWith.length) === startsWith;
};

// Stores the data of name and place.
var Record = function(name, place) {
    this.name = name;
    this.place = place;
};

// Function that implements map markers.
var markers = function() {
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
      // Assign each marker to as markerd array for 
      // later access.
      markerd[i] = marker;

    // Behaviours when clicked
    var infowindow = new google.maps.InfoWindow();
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
      })(marker, i)); // IIFE

    }};

// Function that contains Knockout code
var ViewModel = function(records) {
  // Turns markerd to an observable array
  markerd = ko.observableArray([]);

  // 
  var self = this;
    
  // records is an observable array that creates a new Record object
  self.records = ko.observableArray(
  ko.utils.arrayMap(records, function(i) {
    return new Record(i.name, i.place);
  }));

  // nameSearch aka filter is observable
  self.nameSearch = ko.observable('');
 
  // Computes the contents of foreach: parks in the html
  // based on what is observed within nameSearch,
  // it will call the ko.utils.stringStartsWith function
  // pass in the records name and the observed nameSearch,
  // both in lowerCase.
  self.parks = ko.computed(function() {
    return ko.utils.arrayFilter(self.records(), function(r) {
    return (self.nameSearch().length == 0 || ko.utils.stringStartsWith(r.name.toLowerCase(), self.nameSearch().toLowerCase()))      
    });
  });

  // Click function that triggers the map marker
  // from the list of names.



  clicker = function(){
    for(var i = 0; i < 6; i++){
      if(this.name === parks[i].name){
        google.maps.event.trigger(markerd[i], 'click');
        $( ".navbar-toggle" ).trigger( "click" );
        
      }
    }        
  };

  // Flickr api 
  var flickrkey = '29e62f8cfc70c951fad22716511f1002',
    flickrUrl = 'https://api.flickr.com/services',
    flickrSecret = 'cee13e67a6a7fe71';

      $.ajax({
    url: flickrUrl,
    dataType: "jsonp",
    // jsonp: "callback",
    success: function( response ){
      console.log(response)
    
    }
  });
};

var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=';
var wikiCall = '&format=json&callback=wikiCallback';
var wikiUrlist = [];
var wikiSpot = [
  'tynehead', 'green_timbers', 'capilanoriver', 'Burnaby Fraser Foreshore', 'Campbell Valley Regional Park'
];
var wikiarticleArray = [];

for(var i = 0; i < 6; i++){
  
  wikiSpot[i]

  wikiUrlist.push(wikiUrl + wikiSpot[i] + wikiCall)
  console.log(wikiUrlist[i])
}
  // Variables for the wikipedia api
  var $wikiElem = $('#wikipedia-links');
  $wikiElem.text("");
  //var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + 'Vancouver' +'&format=json&callback=wikiCallback';

var wikiInit = function(){
  
    $.ajax({
      url: wikiUrlist[1],
      dataType: "jsonp",
       jsonp: "callback",
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
  

}

wikiInit();


$(document).ready(function() {
  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });
});

ko.applyBindings(new ViewModel(parks));
