
var map;
var marker;
/*    var viewModel = [
        'tynehead' : ko.observableArray([{name: "tynehead", place: {lat: 49.181365, lng: -122.757452},
    content: 'hello'}]),
        greenTimbers : ko.observableArray([{name: "greenTimbers", place: {lat: 49.179204, lng: -122.821221},
    content: 'my'}]),
        capilano : ko.observableArray([{name: "capilano", place: {lat: 49.352239, lng: -123.114227},
    content: 'name'}]),
        burnaby : ko.observableArray([{name: "burnaby", place: {lat: 49.194429, lng: -122.999024},
    content: 'is'}]),
        campbell : ko.observableArray([{name: "campbell", place: {lat: 49.030394, lng: -122.669163},
    content: 'John'}])
    ];*/
 /*    var viewModel = [
  {name: "tynehead", place: {lat: 49.181365, lng: -122.757452},
    content: 'hello'},
  {name: "greenTimbers", place: {lat: 49.179204, lng: -122.821221},
    content: 'my'},
  {name: "capilano", place: {lat: 49.352239, lng: -123.114227},
    content: 'name'},
  {name: "burnaby", place: {lat: 49.194429, lng: -122.999024},
    content: 'is'},
  {name: "campbell", place: {lat: 49.030394, lng: -122.669163},
    content: 'John'}
  ];
*/
   var parks = [
  {name: "tynehead", place: {lat: 49.181365, lng: -122.757452},
    content: 'hello'},
  {name: "greenTimbers", place: {lat: 49.179204, lng: -122.821221},
    content: 'my'},
  {name: "capilano", place: {lat: 49.352239, lng: -123.114227},
    content: 'name'},
  {name: "burnaby", place: {lat: 49.194429, lng: -122.999024},
    content: 'is'},
  {name: "campbell", place: {lat: 49.030394, lng: -122.669163},
    content: 'John'}
  ];
  
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 49.179282, lng: -122.820615},
    zoom: 10
  });

  //marker  -122.757452, 49.181154, -122.757398, 49.179204, -122.821221, 49.352239, -123.114227, 49.194429, -122.999024, 49.030394, -122.669163
  var myLatLng = parks[0].place;
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: myLatLng
  });
  var contentString = 'hello john';

  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });

  function markers() {
    for(var i = 0; i < 5; i++){
      var place = parks[i].place;
      var drop = google.maps.Animation.DROP;
      var name = parks[i].name; 
      marker = new google.maps.Marker({
        position: place,
        map: map,
        animation: drop,
        title: name
      });
    // clickresponse(marker, parks[i].name);

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(parks[i].name);
          infowindow.open(map, marker);
        
        }
      })(marker, i));
    }};
  markers();

/*  function clickresponse(marker, content) {
    var infowindow = new google.maps.InfoWindow({
      content: content
    });

    marker.addListener('click', function() {
      infowindow.open(marker.get('map'), marker);
      toggleBounce();

    });
  } */

  function toggleBounce() {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }
}//end initMap
    function AppViewModel() {


      this.parks = ko.observableArray(parks);
      this.show = ko.observable(true);

      function filtersearch(){
        $('.search').keyup(function () {
          var valThis = this.value.toLowerCase(),
          lenght  = this.value.length;

          $('.list>li').each(function () {
            var text  = $(this).text(),
            textL = text.toLowerCase(),
            htmlR = '<b>' + text.substr(0, lenght) + '</b>' + text.substr(lenght);
            (textL.indexOf(valThis) == 0) ? $(this).html(htmlR).show() : $(this).hide();
          });

        });
      }
      filtersearch();
    };
ko.applyBindings(new AppViewModel());

