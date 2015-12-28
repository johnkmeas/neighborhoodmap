  function initialize() {
    // Set the zoom level and center position of map
    var mapOptions = {
      zoom: 10,
      center: new google.maps.LatLng(49.179282, -122.820615)
    };
    // Assign var map to a new google map and assigned to id 'map'
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  // Call markers function to load the map markers

};
// Load the Map
google.maps.event.addDomListener(window, 'load', initialize);

$(document).ready(function() {
  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });
});